"use server";

import { desc, eq } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import { posts } from "@/db/schema";

export async function GetUserPosts(username: string, page = 1, perPage = 10) {
    "use cache";
    cacheLife("minutes");

    if (!username) {
        throw new Error("No username provided.");
    }

    // Fetch posts from the database
    const userPosts = await db
        .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            createdAt: posts.createdAt,
        })
        .from(posts)
        .where(eq(posts.userId, username))
        .orderBy(desc(posts.createdAt))
        .limit(perPage + 1)
        .offset((page - 1) * perPage);

    // Check if there are more posts available
    const more = userPosts.length > perPage;
    if (more) {
        userPosts.pop(); // Remove the last item if there are more
    }

    // Format the posts for the response
    const formattedPosts = userPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        createdAt: post.createdAt,
    }));

    return {
        posts: formattedPosts,
        more,
    };
}
