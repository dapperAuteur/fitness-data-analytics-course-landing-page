"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { upsertLead, markSentToInbox } from "@/lib/db-safe";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { postToInbox } from "@/lib/inbox";
import { buildEbookUrl, FOUNDATIONS_SLUG } from "@/lib/ebook";

const LeadSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(120),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  token: z.string().optional(),
});

export type SubmitLeadInput = z.input<typeof LeadSchema>;

export async function submitLead(input: SubmitLeadInput): Promise<{ ok: false; error: string }> {
  const parsed = LeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? null;
  const userAgent = headerList.get("user-agent") ?? null;

  const passed = await verifyRecaptcha(parsed.data.token, "waitlist_submit", ip);
  if (!passed) {
    return { ok: false, error: "We couldn't verify that you're human. Please reload and try again." };
  }

  let lead;
  try {
    lead = await upsertLead({
      email: parsed.data.email,
      name: parsed.data.name,
      experienceLevel: parsed.data.experienceLevel,
      ip,
      userAgent,
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save your submission.",
    };
  }

  const downloadUrl = await buildEbookUrl({ slug: FOUNDATIONS_SLUG, leadId: lead.id });

  after(async () => {
    const result = await postToInbox({
      formType: "course-lead",
      submitterEmail: lead.email,
      submitterName: lead.name,
      priority: "high",
      payload: {
        experience_level: lead.experienceLevel,
        ip: lead.ip,
        user_agent: lead.userAgent,
        received_at: lead.receivedAt,
      },
    });
    // Only mark sent_to_inbox_at on a real receiver-acked write (id assigned).
    // Dev-log mode (env vars missing) returns ok:true without id and is skipped.
    if (result.ok && result.id) {
      await markSentToInbox(lead.id);
    }
  });

  redirect(
    `/thanks?email=${encodeURIComponent(lead.email)}&download=${encodeURIComponent(downloadUrl)}`,
  );
}
