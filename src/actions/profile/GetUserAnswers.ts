"use server";

import { desc, eq } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import { answers, posts } from "@/db/schema";

export async function GetUserAnswers(username: string, page = 1, perPage = 10) {
    "use cache";
    cacheLife("minutes");

    if (!username) {
        throw new Error("No username provided.");
    }

    // Fetch posts from the database
    const userAnswers = await db
        .select({
            id: answers.id,
            postId: answers.postId,
            upvotes: answers.upvotes,
            downvotes: answers.downvotes,
            createdAt: answers.createdAt,
        })
        .from(answers)
        .where(eq(answers.userId, username))
        .orderBy(desc(answers.createdAt))
        .limit(perPage + 1)
        .offset((page - 1) * perPage);

    // Check if there are more posts available
    const more = userAnswers.length > perPage;
    if (more) {
        userAnswers.pop(); // Remove the last item if there are more
    }

    // Format the posts for the response
    const formattedAnswers: any[] = [];
    for (const answer of userAnswers) {
        const post = await db
            .select({ title: posts.title, slug: posts.slug })
            .from(posts)
            .where(eq(posts.id, answer.postId))
            .limit(1);

        formattedAnswers.push({
            id: answer.id,
            postId: answer.postId,
            createdAt: answer.createdAt,
            postTitle: post[0]?.title,
            postSlug: post[0]?.slug,
            votes: answer.upvotes - answer.downvotes,
        });
    }

    return {
        answers: formattedAnswers,
        more,
    };
}
