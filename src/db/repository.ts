import { desc, eq, sql } from 'drizzle-orm';
import { db, isDatabaseConfigured } from './index.ts';
import {
  analyticsEvents,
  articleTranslations,
  indexingSnapshots,
  qaEscalations,
  userBookmarks,
  users,
} from './schema.ts';

export async function getOrCreateUser(uid: string, email: string, displayName = '') {
  if (!isDatabaseConfigured()) return null;
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database user upsert failed:', error);
    throw new Error('Failed to synchronize user account.', { cause: error });
  }
}

export interface CachedArticleTranslationPayload {
  title: string;
  subtitle: string;
  abstract: string;
  keyFindings: string[];
  contentParagraphs: string[];
  cachedFromDb?: boolean;
  updatedAt?: string;
}

export async function getCachedArticleTranslation(
  cacheKey: string
): Promise<CachedArticleTranslationPayload | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    const rows = await db
      .select()
      .from(articleTranslations)
      .where(eq(articleTranslations.cacheKey, cacheKey))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return {
      title: row.title,
      subtitle: row.subtitle,
      abstract: row.abstract,
      keyFindings: JSON.parse(row.keyFindingsJson || '[]'),
      contentParagraphs: JSON.parse(row.contentParagraphsJson || '[]'),
      cachedFromDb: true,
      updatedAt: row.updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error('Database translation cache lookup failed:', error);
    throw new Error('Translation cache lookup failed.', { cause: error });
  }
}

export async function upsertArticleTranslation(params: {
  cacheKey: string;
  articleId: string;
  targetLanguage: string;
  title: string;
  subtitle: string;
  abstract: string;
  keyFindings: string[];
  contentParagraphs: string[];
  modelUsed?: string;
}) {
  if (!isDatabaseConfigured()) return null;
  try {
    const now = new Date();
    const result = await db
      .insert(articleTranslations)
      .values({
        cacheKey: params.cacheKey,
        articleId: params.articleId,
        targetLanguage: params.targetLanguage,
        title: params.title,
        subtitle: params.subtitle || '',
        abstract: params.abstract || '',
        keyFindingsJson: JSON.stringify(params.keyFindings || []),
        contentParagraphsJson: JSON.stringify(params.contentParagraphs || []),
        modelUsed: params.modelUsed || 'gemini',
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: articleTranslations.cacheKey,
        set: {
          title: params.title,
          subtitle: params.subtitle || '',
          abstract: params.abstract || '',
          keyFindingsJson: JSON.stringify(params.keyFindings || []),
          contentParagraphsJson: JSON.stringify(params.contentParagraphs || []),
          modelUsed: params.modelUsed || 'gemini',
          updatedAt: now,
        },
      })
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database translation cache upsert failed:', error);
    throw new Error('Failed to store translation cache entry.', { cause: error });
  }
}

export async function getTranslationCacheStats() {
  if (!isDatabaseConfigured()) {
    return { totalCachedTranslations: 0, byLanguage: {} as Record<string, number> };
  }
  try {
    const rows = await db
      .select({
        targetLanguage: articleTranslations.targetLanguage,
        count: sql<number>`count(*)::int`,
      })
      .from(articleTranslations)
      .groupBy(articleTranslations.targetLanguage);
    const byLanguage: Record<string, number> = {};
    let totalCachedTranslations = 0;
    for (const r of rows) {
      byLanguage[r.targetLanguage] = Number(r.count || 0);
      totalCachedTranslations += Number(r.count || 0);
    }
    return { totalCachedTranslations, byLanguage };
  } catch (error) {
    console.error('Database translation stats query failed:', error);
    throw new Error('Failed to retrieve translation cache statistics.', { cause: error });
  }
}

export async function saveQaEscalation(params: {
  receiptId: string;
  articleId: string;
  articleTitle: string;
  inquiryType: string;
  askerName: string;
  askerEmail: string;
  questionText: string;
  deliveryChannel: string;
  smtpProvider: string;
  deliveredExternally: boolean;
}) {
  if (!isDatabaseConfigured()) return null;
  try {
    const result = await db
      .insert(qaEscalations)
      .values(params)
      .onConflictDoNothing({ target: qaEscalations.receiptId })
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database Q&A escalation save failed:', error);
    throw new Error('Failed to persist Q&A escalation.', { cause: error });
  }
}

export async function listQaEscalations(limitCount = 50) {
  if (!isDatabaseConfigured()) return [];
  try {
    return await db
      .select()
      .from(qaEscalations)
      .orderBy(desc(qaEscalations.createdAt))
      .limit(limitCount);
  } catch (error) {
    console.error('Database Q&A escalation query failed:', error);
    throw new Error('Failed to load Q&A escalations.', { cause: error });
  }
}

export async function recordAnalyticsEventDb(params: {
  eventType: string;
  domain?: string;
  articleId?: string;
  language?: string;
  userUid?: string | null;
  payload?: Record<string, unknown>;
}) {
  if (!isDatabaseConfigured()) return null;
  try {
    const result = await db
      .insert(analyticsEvents)
      .values({
        eventType: params.eventType,
        domain: params.domain || '',
        articleId: params.articleId || '',
        language: params.language || 'tr',
        userUid: params.userUid || null,
        payloadJson: JSON.stringify(params.payload || {}),
      })
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database analytics event insert failed:', error);
    throw new Error('Failed to record analytics event.', { cause: error });
  }
}

export async function saveIndexingSnapshotDb(params: {
  snapshotType: string;
  propertyOrigin: string;
  totalUrlsSubmitted: number;
  languagesCount: number;
  primaryHttpStatus: number;
  report: Record<string, unknown>;
}) {
  if (!isDatabaseConfigured()) return null;
  try {
    const result = await db
      .insert(indexingSnapshots)
      .values({
        snapshotType: params.snapshotType,
        propertyOrigin: params.propertyOrigin,
        totalUrlsSubmitted: params.totalUrlsSubmitted,
        languagesCount: params.languagesCount,
        primaryHttpStatus: params.primaryHttpStatus,
        reportJson: JSON.stringify(params.report || {}),
      })
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database indexing snapshot save failed:', error);
    throw new Error('Failed to store indexing snapshot.', { cause: error });
  }
}

export async function getRecentIndexingSnapshotsDb(limitCount = 10) {
  if (!isDatabaseConfigured()) return [];
  try {
    const rows = await db
      .select()
      .from(indexingSnapshots)
      .orderBy(desc(indexingSnapshots.createdAt))
      .limit(limitCount);
    return rows.map((r) => ({
      id: r.id,
      snapshotType: r.snapshotType,
      propertyOrigin: r.propertyOrigin,
      totalUrlsSubmitted: r.totalUrlsSubmitted,
      languagesCount: r.languagesCount,
      primaryHttpStatus: r.primaryHttpStatus,
      createdAt: r.createdAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Database indexing snapshot lookup failed:', error);
    throw new Error('Failed to fetch recent indexing snapshots.', { cause: error });
  }
}

export async function getUserBookmarksDb(userUid: string) {
  if (!isDatabaseConfigured()) return [];
  try {
    return await db
      .select()
      .from(userBookmarks)
      .where(eq(userBookmarks.userUid, userUid))
      .orderBy(desc(userBookmarks.updatedAt));
  } catch (error) {
    console.error('Database user bookmarks query failed:', error);
    throw new Error('Failed to fetch user bookmarks.', { cause: error });
  }
}

export async function upsertUserBookmarkDb(params: {
  userUid: string;
  articleId: string;
  isBookmarked: boolean;
  isRead: boolean;
  progressPercent: number;
}) {
  if (!isDatabaseConfigured()) return null;
  try {
    const now = new Date();
    const result = await db
      .insert(userBookmarks)
      .values({
        userUid: params.userUid,
        articleId: params.articleId,
        isBookmarked: params.isBookmarked,
        isRead: params.isRead,
        progressPercent: Math.max(0, Math.min(100, Math.round(params.progressPercent))),
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [userBookmarks.userUid, userBookmarks.articleId],
        set: {
          isBookmarked: params.isBookmarked,
          isRead: params.isRead,
          progressPercent: Math.max(0, Math.min(100, Math.round(params.progressPercent))),
          updatedAt: now,
        },
      })
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database user bookmark upsert failed:', error);
    throw new Error('Failed to update user bookmark.', { cause: error });
  }
}

// GDPR Art. 15 & 20 / KVKK Madde 11: Full Data Subject Access & Portability Export
export async function exportUserPersonalDataDb(userUid: string, email: string) {
  if (!isDatabaseConfigured()) {
    return {
      profile: null,
      bookmarks: [],
      analyticsEvents: [],
      qaInquiries: [],
    };
  }
  try {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const [profileRows, bookmarkRows, eventRows, qaRows] = await Promise.all([
      db.select().from(users).where(eq(users.uid, userUid)).limit(1),
      db.select().from(userBookmarks).where(eq(userBookmarks.userUid, userUid)),
      db
        .select()
        .from(analyticsEvents)
        .where(eq(analyticsEvents.userUid, userUid))
        .orderBy(desc(analyticsEvents.createdAt))
        .limit(200),
      cleanEmail
        ? db
            .select()
            .from(qaEscalations)
            .where(sql`lower(${qaEscalations.askerEmail}) = ${cleanEmail}`)
            .orderBy(desc(qaEscalations.createdAt))
            .limit(200)
        : Promise.resolve([]),
    ]);

    return {
      profile: profileRows[0] || null,
      bookmarks: bookmarkRows,
      analyticsEvents: eventRows,
      qaInquiries: qaRows,
    };
  } catch (error) {
    console.error('Database GDPR/KVKK data export failed:', error);
    throw new Error('Failed to export personal data.', { cause: error });
  }
}

// GDPR Art. 17 ("Right to be Forgotten") / KVKK Madde 7 & 11: Permanent Personal Data Erasure
export async function deleteUserPersonalDataDb(userUid: string, email: string) {
  if (!isDatabaseConfigured()) {
    return {
      deletedBookmarks: 0,
      anonymizedAnalytics: 0,
      deletedQaRecords: 0,
      deletedProfile: false,
    };
  }
  try {
    const cleanEmail = String(email || '').trim().toLowerCase();

    const deletedBookmarksRows = await db
      .delete(userBookmarks)
      .where(eq(userBookmarks.userUid, userUid))
      .returning({ id: userBookmarks.id });

    const anonymizedEventsRows = await db
      .update(analyticsEvents)
      .set({ userUid: null })
      .where(eq(analyticsEvents.userUid, userUid))
      .returning({ id: analyticsEvents.id });

    let deletedQaCount = 0;
    if (cleanEmail) {
      const deletedQaRows = await db
        .delete(qaEscalations)
        .where(sql`lower(${qaEscalations.askerEmail}) = ${cleanEmail}`)
        .returning({ id: qaEscalations.id });
      deletedQaCount = deletedQaRows.length;
    }

    const deletedUserRows = await db
      .delete(users)
      .where(eq(users.uid, userUid))
      .returning({ id: users.id });

    return {
      deletedBookmarks: deletedBookmarksRows.length,
      anonymizedAnalytics: anonymizedEventsRows.length,
      deletedQaRecords: deletedQaCount,
      deletedProfile: deletedUserRows.length > 0,
    };
  } catch (error) {
    console.error('Database GDPR/KVKK data erasure failed:', error);
    throw new Error('Failed to erase personal data.', { cause: error });
  }
}

