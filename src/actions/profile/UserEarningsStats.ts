"use server";

import { and, desc, eq, gte, sql } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import Upvote from "@/lib/upvote";
import { votes } from "@/db/schema";

export async function UserEarningsStats(username: string) {
    "use cache";
    cacheLife("minutes");

    if (!username) {
        throw new Error("No username provided.");
    }

    const upvote = new Upvote();

    // Get user votes for last 30 days
    const lastVotes = await db
        .select({
            isUpvote: votes.isUpvote,
            createdAt: votes.createdAt,
        })
        .from(votes)
        .where(and(eq(votes.userId, username), gte(votes.createdAt, sql`NOW() - INTERVAL '30 days'`)))
        .orderBy(desc(votes.createdAt));

    const earningsMap = new Map<number, number>();

    for (const vote of lastVotes) {
        const day = new Date(vote.createdAt).getDate();
        const currentEarning = earningsMap.get(day) ?? 0;
        const delta = vote.isUpvote ? upvote.upvotePrize : -upvote.downvoteCutoff;
        earningsMap.set(day, +(currentEarning + delta).toFixed(2));
    }

    upvote.updateVotePrizes();

    const earnings: { day: number; earning: number }[] = Array.from(earningsMap.entries()).map(
        ([day, earning]) => ({
            day,
            earning,
        }),
    );

    const thisMonthsDayCount = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    for (let i = 1; i < thisMonthsDayCount + 1; i++) {
        if (!earnings.find(e => e.day === i)) {
            earnings.push({ day: i, earning: 0 });
        }
    }

    earnings.sort((a, b) => a.day - b.day);
    return earnings;
}
