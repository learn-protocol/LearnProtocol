"use server";

import { count, eq } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import Upvote from "@/lib/upvote";
import { answers, stats, votes } from "@/db/schema";

export async function TotalVotes() {
    "use cache";
    cacheLife("hours");

    const getVotesCount = () =>
        db
            .select({
                count: count(),
            })
            .from(votes);

    const getAnswersCount = () =>
        db
            .select({
                count: count(),
            })
            .from(answers);

    const getUpvoteCount = () =>
        db
            .select({
                count: count(),
            })
            .from(votes)
            .where(eq(votes.isUpvote, true));

    const getPrizeDistribution = () =>
        db
            .select({
                distributedUpvotePrize: stats.distributedUpvotePrize,
                distributedDownvoteCutoff: stats.distributedDownvoteCutoff,
            })
            .from(stats)
            .limit(1);

    const [votesResult, answersResult, upvoteResult, prizeResult] = await Promise.all([
        getVotesCount(),
        getAnswersCount(),
        getUpvoteCount(),
        getPrizeDistribution(),
    ]);

    const votesCount = votesResult[0]?.count ?? 0;
    const answersCount = answersResult[0]?.count ?? 0;
    const upvoteCount = upvoteResult[0]?.count ?? 0;
    const downvoteCount = votesCount - upvoteCount;

    const upvoteHandler = new Upvote();

    return {
        votes: votesCount,
        answers: answersCount,
        upvotes: upvoteCount,
        downvotes: downvoteCount,
        upvotePrize: upvoteHandler.upvotePrize,
        downvoteCutoff: upvoteHandler.downvoteCutoff,
        distributedUpvotePrize: prizeResult[0]?.distributedUpvotePrize ?? 0,
        distributedDownvoteCutoff: prizeResult[0]?.distributedDownvoteCutoff ?? 0,
    };
}
