"use cache";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { answers, users, votes } from "@/db/schema";
import type { Answer, UserDetails } from "@/lib/types";

export async function GetAnswers(postID: number) {
    const answers_: Array<Answer & Partial<UserDetails>> = await db
        .select()
        .from(answers)
        .where(eq(answers.postId, postID));

    // Get user details for each answer
    for (let i = 0; i < answers_.length; i++) {
        const answer = answers_[i];
        const user_ = (await db.select().from(users).where(eq(users.ocid, answer.userId)))[0];

        answers_[i].wallet = user_.wallet;
        answers_[i].avatar = user_.avatar || "";

        // Check each answer if upvoted by the user
        if (answers_[i].upvotes > 0 || answers_[i].downvotes > 0) {
            const voteEntries = await db.select().from(votes).where(eq(votes.entityId, answer.id));

            if (voteEntries.length > 0) {
                answers_[i].voters = voteEntries.map(vote => ({
                    user: vote.userId,
                    isUpvote: vote.isUpvote,
                }));
            }
        }
    }

    return answers_.map(answer => ({
        id: answer.id,
        userId: answer.userId,
        wallet: answer.wallet,
        avatar: answer.avatar,
        voters: answer.voters,
        content: answer.content,
        upvotes: answer.upvotes,
        downvotes: answer.downvotes,
        createdAt: answer.createdAt,
        isAccepted: answer.isAccepted,
    }));
}
