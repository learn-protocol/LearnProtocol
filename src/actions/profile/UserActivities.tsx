"use server";

import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import { answers, posts, votes } from "@/db/schema";

interface IActivity {
    type: string;
    date: Date;
    activity: React.ReactNode;
}

export async function UserActivities(
    username: string,
    page = 1,
    perPage = 10,
): Promise<{
    activities: IActivity[];
    more: boolean;
}> {
    "use cache";
    cacheLife("minutes");

    if (!username) {
        throw new Error("No username provided.");
    }

    const activities: IActivity[] = [];

    // Get last N activities of every type
    const lastNvotes = await db
        .select({
            postId: votes.postId,
            entityId: votes.entityId,
            isUpvote: votes.isUpvote,
            createdAt: votes.createdAt,
        })
        .from(votes)
        .where(eq(votes.userId, username))
        .orderBy(desc(votes.createdAt))
        .limit(perPage + 1);
    //.offset(Math.max(0, (page - 2) * perPage)); // TODO: Add offset for optimization

    const lastNanswers = await db
        .select({
            id: answers.id,
            postId: answers.postId,
            createdAt: answers.createdAt,
        })
        .from(answers)
        .where(eq(answers.userId, username))
        .orderBy(desc(answers.createdAt))
        .limit(perPage + 1);
    //.offset(Math.max(0, (page - 2) * perPage));

    const lastNposts = await db
        .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            createdAt: posts.createdAt,
        })
        .from(posts)
        .where(eq(posts.userId, username))
        .orderBy(desc(posts.createdAt))
        .limit(perPage + 1);
    //.offset(Math.max(0, (page - 2) * perPage));

    // Create rows
    const rows: any = [
        ...lastNvotes.map(row => ({
            type: "votes",
            ...row,
        })),
        ...lastNanswers.map(row => ({
            type: "answers",
            ...row,
        })),
        ...lastNposts.map(row => ({
            type: "posts",
            ...row,
        })),
    ]
        .sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            if (a.createdAt > b.createdAt) return -1;
            return 0;
        })
        //.slice(0, perPage + 1); // TODO: This will change after adding offset to the queries
        .slice((page - 1) * perPage, page * perPage + 1);

    // Modify the data into correct format
    for (const row of rows) {
        let post: any = null;

        if (row.postId) {
            post = (
                await db
                    .select({ slug: posts.slug, id: posts.id, title: posts.title })
                    .from(posts)
                    .where(eq(posts.id, row.postId))
                    .limit(1)
            )?.[0];
        }

        switch (row.type) {
            case "votes":
                activities.push({
                    type: "Vote",
                    date: row.createdAt,
                    activity: <VoteActivity row={row} post={post} />,
                });
                break;
            case "answers":
                activities.push({
                    type: "Answer",
                    date: row.createdAt,
                    activity: <AnswerActivity row={row} post={post} />,
                });
                break;
            case "posts":
                activities.push({
                    type: "Question",
                    date: row.createdAt,
                    activity: <PostActivity row={row} />,
                });
                break;
        }
    }

    return {
        activities: activities.slice(0, perPage),
        more: activities.length > perPage,
    };
}

function VoteActivity({ row, post }: { row: any; post: any }) {
    return (
        <p>
            You {row.isUpvote ? <b>upvoted</b> : <b>downvoted</b>} answer&nbsp;
            <Link href={`/post/${post!.slug}-${post!.id}#answer-${row.entityId}`}>
                {row.entityId}
            </Link> at post &quot;
            <Link href={`/post/${post!.slug}-${post!.id}`}>{post!.title}</Link>&quot;
        </p>
    );
}

function AnswerActivity({ row, post }: { row: any; post: any }) {
    return (
        <p>
            You post an answer at post &quot;
            <Link href={`/post/${post!.slug}-${post!.id}#answer-${post!.id}`}>{post!.title}</Link>
            &quot;
        </p>
    );
}

function PostActivity({ row }: { row: any }) {
    return (
        <p>
            You post a question &quot;
            <Link href={`/post/${row.slug}-${row.id}`}>{row.title}</Link>&quot;
        </p>
    );
}
