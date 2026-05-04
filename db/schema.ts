import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const lead = pgTable("lead", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  experienceLevel: text("experience_level").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
  sentToInboxAt: timestamp("sent_to_inbox_at", { withTimezone: true }),
  ebookDeliveredAt: timestamp("ebook_delivered_at", { withTimezone: true }),
});

export type Lead = typeof lead.$inferSelect;
export type NewLead = typeof lead.$inferInsert;
