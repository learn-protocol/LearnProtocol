"use server";

import { eq } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import { answers, users } from "@/db/schema";
import type { PublicUserDetails } from "@/lib/types";

export async function GetUserDetails(username: string): Promise<PublicUserDetails | null> {
    "use cache";
    cacheLife("minutes");

    const user = (await db.select().from(users).where(eq(users.ocid, username)))[0];
    if (!user) return null;

    // Simple stats
    const answerUpvotes: number[] = (
        await db.select({ upvotes: answers.upvotes }).from(answers).where(eq(answers.userId, user.ocid))
    ).map(a => a.upvotes);

    const answerCount = answerUpvotes.length;
    const upvoteCount = answerUpvotes.reduce((acc, curr) => acc + curr, 0);

    return {
        accountAge: Math.floor((Date.now() - new Date(user.registeredAt).getTime()) / (1000 * 60 * 60 * 24)),
        balance: user.balance,
        wallet: user.wallet,
        verified: user.verified || false,
        avatar: user.avatar ?? null,
        ocid: user.ocid,
        answerCount,
        upvoteCount,
    };
}
