import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Authenticated users synced from Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name').default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// G1: Persistent 12-language full-article translation cache
export const articleTranslations = pgTable('article_translations', {
  id: serial('id').primaryKey(),
  cacheKey: text('cache_key').notNull().unique(),
  articleId: text('article_id').notNull(),
  targetLanguage: text('target_language').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle').default('').notNull(),
  abstract: text('abstract').default('').notNull(),
  keyFindingsJson: text('key_findings_json').default('[]').notNull(),
  contentParagraphsJson: text('content_paragraphs_json').default('[]').notNull(),
  modelUsed: text('model_used').default('gemini').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// G2: Persistent Q&A author escalation & SMTP/Resend delivery log
export const qaEscalations = pgTable('qa_escalations', {
  id: serial('id').primaryKey(),
  receiptId: text('receipt_id').notNull().unique(),
  articleId: text('article_id').notNull(),
  articleTitle: text('article_title').notNull(),
  inquiryType: text('inquiry_type').default('question').notNull(),
  askerName: text('asker_name').default('Anonim Okur').notNull(),
  askerEmail: text('asker_email').default('').notNull(),
  questionText: text('question_text').notNull(),
  deliveryChannel: text('delivery_channel').default('').notNull(),
  smtpProvider: text('smtp_provider').default('outbox').notNull(),
  deliveredExternally: boolean('delivered_externally').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// G4: Persistent visitor analytics events
export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  eventType: text('event_type').notNull(),
  domain: text('domain').default('').notNull(),
  articleId: text('article_id').default('').notNull(),
  language: text('language').default('tr').notNull(),
  userUid: text('user_uid').references(() => users.uid, { onDelete: 'set null' }),
  payloadJson: text('payload_json').default('{}').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// G3/G4: Persistent search engine indexing & webmaster snapshots
export const indexingSnapshots = pgTable('indexing_snapshots', {
  id: serial('id').primaryKey(),
  snapshotType: text('snapshot_type').notNull(),
  propertyOrigin: text('property_origin').notNull(),
  totalUrlsSubmitted: integer('total_urls_submitted').default(0).notNull(),
  languagesCount: integer('languages_count').default(12).notNull(),
  primaryHttpStatus: integer('primary_http_status').default(200).notNull(),
  reportJson: text('report_json').default('{}').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Authenticated user bookmarks & reading progress
export const userBookmarks = pgTable(
  'user_bookmarks',
  {
    id: serial('id').primaryKey(),
    userUid: text('user_uid')
      .notNull()
      .references(() => users.uid, { onDelete: 'cascade' }),
    articleId: text('article_id').notNull(),
    isBookmarked: boolean('is_bookmarked').default(true).notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    progressPercent: integer('progress_percent').default(0).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('user_bookmarks_uid_article_idx').on(table.userUid, table.articleId)]
);

export const usersRelations = relations(users, ({ many }) => ({
  bookmarks: many(userBookmarks),
  analyticsEvents: many(analyticsEvents),
}));

export const userBookmarksRelations = relations(userBookmarks, ({ one }) => ({
  user: one(users, {
    fields: [userBookmarks.userUid],
    references: [users.uid],
  }),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  user: one(users, {
    fields: [analyticsEvents.userUid],
    references: [users.uid],
  }),
}));
