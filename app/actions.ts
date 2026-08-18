"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { upsertLead, markSentToInbox } from "@/lib/db-safe";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { postToInbox } from "@/lib/inbox";

const LeadSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(120),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  token: z.string().optional(),
});

export type SubmitLeadInput = z.input<typeof LeadSchema>;

/**
 * Coarse, machine-readable failure classes for analytics.
 *
 * The client captures this code, never `error`. The storage branch below puts
 * `err.message` in `error`, and a Neon failure fills that field with
 * postgres://user:pass@host — the exact leak lib/sentry-scrub.ts exists to prevent.
 * Sending the message to a third-party analytics vendor would reopen it. Keeping the
 * reason as a closed union also means the funnel does not break the day a piece of
 * user-facing copy is reworded.
 */
export type SubmitLeadFailure = "validation" | "recaptcha" | "storage";

export async function submitLead(
  input: SubmitLeadInput,
): Promise<{ ok: false; error: string; reason: SubmitLeadFailure }> {
  const parsed = LeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again.", reason: "validation" };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? null;
  const userAgent = headerList.get("user-agent") ?? null;

  const passed = await verifyRecaptcha(parsed.data.token, "waitlist_submit", ip);
  if (!passed) {
    return {
      ok: false,
      error: "We couldn't verify that you're human. Please reload and try again.",
      reason: "recaptcha",
    };
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
      reason: "storage",
    };
  }

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
        intent: "notify-on-enrollment",
      },
    });
    if (result.ok && result.id) {
      await markSentToInbox(lead.id);
    }
  });

  redirect(`/thanks?email=${encodeURIComponent(lead.email)}`);
}
