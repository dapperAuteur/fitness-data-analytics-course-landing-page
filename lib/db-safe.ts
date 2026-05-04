import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { lead, type Lead, type NewLead } from "@/db/schema";

export async function upsertLead(input: NewLead): Promise<Lead> {
  try {
    const db = getDb();
    const [row] = await db
      .insert(lead)
      .values(input)
      .onConflictDoUpdate({
        target: lead.email,
        set: {
          name: input.name,
          experienceLevel: input.experienceLevel,
          ip: input.ip ?? null,
          userAgent: input.userAgent ?? null,
        },
      })
      .returning();
    return row;
  } catch (err) {
    console.error("[db-safe] upsertLead failed", scrubError(err));
    throw new Error("Could not save your submission. Please try again.");
  }
}

export async function markEbookDelivered(leadId: string): Promise<void> {
  try {
    const db = getDb();
    await db.update(lead).set({ ebookDeliveredAt: new Date() }).where(eq(lead.id, leadId));
  } catch (err) {
    console.error("[db-safe] markEbookDelivered failed", scrubError(err));
  }
}

export async function markSentToInbox(leadId: string): Promise<void> {
  try {
    const db = getDb();
    await db.update(lead).set({ sentToInboxAt: new Date() }).where(eq(lead.id, leadId));
  } catch (err) {
    console.error("[db-safe] markSentToInbox failed", scrubError(err));
  }
}

function scrubError(err: unknown): { name?: string; code?: string } {
  if (err && typeof err === "object") {
    const name = "name" in err && typeof err.name === "string" ? err.name : undefined;
    const code = "code" in err && typeof err.code === "string" ? err.code : undefined;
    return { name, code };
  }
  return {};
}
