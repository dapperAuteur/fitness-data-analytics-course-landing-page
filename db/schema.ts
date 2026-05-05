import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

// One row per ebook download. FDAC has no age-gate so sessionId is always
// null today; the column is here so the same schema works for ECS (which
// populates it from the age-gate cookie). Index on (slug, downloaded_at)
// supports per-day / per-cohort funnel queries.
export const downloadLog = pgTable(
  "download_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    sessionId: text("session_id"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    downloadedAt: timestamp("downloaded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugDownloadedIdx: index("download_log_slug_downloaded_at_idx").on(t.slug, t.downloadedAt),
  }),
);

export type DownloadLog = typeof downloadLog.$inferSelect;
export type NewDownloadLog = typeof downloadLog.$inferInsert;
