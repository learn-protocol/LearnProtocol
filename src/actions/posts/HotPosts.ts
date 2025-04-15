"use server";

/**
 * Hot Post Formula
 *
 * Upvotes: U
 * Downvotes: D
 * Post Age: A
 * Gravity: G
 *
 * Hotness Score = (U + D) / (A + 2)^G
 */

import { desc } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { calculateHoursBetween } from "@/lib/utils";

const Gravity = 1.5;

function calculateHotnessScore(upvotes: number, downvotes: number, timestamp: number) {
    const postAge = calculateHoursBetween(timestamp);
    return (upvotes + downvotes) / Math.pow(postAge + 2, Gravity);
}

export async function HotPosts() {
    "use cache";
    cacheLife("minutes");

    // Get last 200 posts
    const lastPosts = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(200).execute();

    // Calculate hotness score for each post
    const scores: { [title: string]: number } = {};
    const hotPosts: Array<(typeof lastPosts)[number]> = [];

    for (const post of lastPosts) {
        const score = calculateHotnessScore(post.upvotes, post.downvotes, post.createdAt.getTime());
        scores[post.title] = score;
    }

    // Sort by hotness score
    const sortedPosts = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

    // Get top 15 hot posts
    for (const title of sortedPosts.slice(0, 15)) {
        const post = lastPosts.find(p => p.title === title);
        if (post) hotPosts.push(post);
    }

    return hotPosts;
}
