"use server";

import { count, desc, eq } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import { lower } from "@/lib/sql";
import { posts } from "@/db/schema";

export async function LatestPosts({
    page = 1,
    perPage = 25,
    category = null,
}: {
    page: number;
    perPage: number;
    category?: string | null;
}) {
    "use cache";
    cacheLife("minutes");

    // Get last (perPage) posts
    const lastPosts = await db
        .select()
        .from(posts)
        .where(category ? eq(lower(posts.category), category.toLowerCase()) : undefined)
        .orderBy(desc(posts.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage)
        .execute();

    const countResponse = await db.select({ count: count() }).from(posts);

    return { posts: lastPosts, total: countResponse[0]?.count ?? 0 };
}
