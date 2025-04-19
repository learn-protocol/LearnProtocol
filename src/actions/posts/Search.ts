"use server";

import { sql } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import { toCamelCaseArray } from "@/lib/utils";

export async function SearchPosts({
    query,
    page = 1,
    perPage = 25,
}: {
    query: string;
    page?: number;
    perPage?: number;
}) {
    "use cache";
    cacheLife("minutes");

    if (!query) return { posts: [], total: 0 };

    const cleanedQuery = query.trim();
    const offset = (page - 1) * perPage;

    const tsQuery = sql`websearch_to_tsquery('english', ${cleanedQuery})`;

    const [dataResult, countResult] = (await Promise.all([
        db.execute(
            sql`
                SELECT *, ts_rank(
                    to_tsvector('english', title || ' ' || content),
                    ${tsQuery}
                ) AS rank
                FROM posts
                WHERE (
                    to_tsvector('english', title || ' ' || content) @@ ${tsQuery}
                    OR title ILIKE ${`%${cleanedQuery}%`}
                    OR content ILIKE ${`%${cleanedQuery}%`}
                )
                ORDER BY rank DESC
                LIMIT ${perPage}
                OFFSET ${offset}
          `,
        ),
        db.execute(
            sql`
                SELECT COUNT(*)::int AS total FROM posts
                WHERE (
                to_tsvector('english', title || ' ' || content) @@ websearch_to_tsquery('english', ${cleanedQuery})
                OR title ILIKE ${`%${cleanedQuery}%`}
                OR content ILIKE ${`%${cleanedQuery}%`}
                )
          `,
        ),
    ])) as any[];

    return {
        posts: toCamelCaseArray(dataResult.rows),
        total: countResult.rows[0].total ?? 0,
    };
}
