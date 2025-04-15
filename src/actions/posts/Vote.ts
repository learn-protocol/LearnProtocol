"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import Upvote from "@/lib/upvote";
import GetUser from "../auth/GetUser";
import { increment } from "@/lib/sql";
import { answers, posts, stats, users, votes } from "@/db/schema";

export async function Vote({
    answerID,
    voteType, // 1 for upvote, -1 for downvote
}: {
    answerID: number;
    voteType: 1 | -1;
}) {
    // Validate inputs
    if (!answerID) {
        return {
            errors: {
                answer: "This answer no longer exists",
            },
        };
    }
    if (voteType !== 1 && voteType !== -1) {
        return {
            errors: {
                voteType: "Invalid vote type",
            },
        };
    }

    // Check if user is logged in
    const user = (await GetUser())?.user;
    if (!user) {
        return {
            errors: {
                user: "You must be logged in to vote an answer",
            },
        };
    }

    // Get the answer data
    const answer = (await db.select().from(answers).where(eq(answers.id, answerID)))[0];
    if (!answer) {
        return {
            errors: {
                answer: "This answer no longer exists",
            },
        };
    }

    // Check if user is the author of the answer
    if (answer.userId === user.ocid) {
        return {
            errors: {
                user: "You cannot vote on your own answer",
            },
        };
    }

    // Check if user already voted on the answer
    const existingVote = (
        await db
            .select()
            .from(votes)
            .where(and(eq(votes.userId, user.ocid), eq(votes.entityId, answerID)))
    )[0];

    if (existingVote) {
        return {
            errors: {
                user: "You have already voted on this answer",
            },
        };
    }

    const upvote = new Upvote();

    // Update answer votes
    const updateAnswerVotes = () =>
        db
            .update(answers)
            .set({
                upvotes: voteType === 1 ? answer.upvotes + 1 : answer.upvotes,
                downvotes: voteType === -1 ? answer.downvotes + 1 : answer.downvotes,
            })
            .where(eq(answers.id, answerID));

    // Insert vote into votes table
    const insertVoteIntoVotesTable = () =>
        db.insert(votes).values({
            userId: user.ocid,
            createdAt: new Date(),
            postId: answer.postId,
            entityId: answerID,
            isUpvote: voteType === 1,
        });

    // Update post votes
    const updatePostVotes = () =>
        db
            .update(posts)
            .set({
                upvotes: voteType === 1 ? sql`${posts.upvotes} + 1` : posts.upvotes,
                downvotes: voteType === -1 ? sql`${posts.downvotes} + 1` : posts.downvotes,
            })
            .where(eq(posts.id, answer.postId));

    // Update user balance
    const updateUserBalance = () =>
        db
            .update(users)
            .set({
                balance: increment(
                    users.balance,
                    voteType === 1 ? upvote.upvotePrize : -upvote.downvoteCutoff,
                ),
            })
            .where(eq(users.ocid, answer.userId));

    // Update global stats
    const updateGlobalStats = async () => {
        // Check if the stats row exists
        const statsRow = (await db.select().from(stats).where(eq(stats.id, 1)))?.[0];
        if (!statsRow) {
            // If it doesn't exist, create it
            await db.insert(stats).values({
                distributedUpvotePrize: upvote.upvotePrize,
                distributedDownvoteCutoff: upvote.downvoteCutoff,
            });
            return;
        }
        await db
            .update(stats)
            .set({
                distributedUpvotePrize: increment(stats.distributedUpvotePrize, upvote.upvotePrize),
                distributedDownvoteCutoff: increment(stats.distributedDownvoteCutoff, upvote.downvoteCutoff),
            })
            .where(eq(stats.id, 1));
    };

    // Execute all updates in parallel
    await Promise.all([
        updateAnswerVotes(),
        insertVoteIntoVotesTable(),
        updatePostVotes(),
        updateUserBalance(),
        updateGlobalStats(),
    ]);

    // Get post slug
    const post = (await db.select().from(posts).where(eq(posts.id, answer.postId)))[0];

    revalidatePath(`/post/${post.slug}-${answer.postId}`);

    return {
        success: true,
    };
}
