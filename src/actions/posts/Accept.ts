"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import GetUser from "../auth/GetUser";
import { answers, posts, users } from "@/db/schema";

export async function AcceptAnswer({ answerID }: { answerID: number }): Promise<
    | {
          errors: {
              answer?: string;
          };
      }
    | boolean
> {
    // Check if user is logged in
    const user = (await GetUser())?.user;
    if (!user) {
        return {
            errors: {
                answer: "You must be logged in to accept an answer",
            },
        };
    }

    // Get the answer data
    const answer = (
        await db
            .select({
                id: answers.id,
                postId: answers.postId,
                userId: answers.userId,
                isAccepted: answers.isAccepted,
            })
            .from(answers)
            .where(and(eq(answers.id, answerID)))
    )?.[0];

    if (!answer) {
        return {
            errors: {
                answer: "This answer no longer exists",
            },
        };
    }
    if (answer.isAccepted) {
        return {
            errors: {
                answer: "This answer is already accepted",
            },
        };
    }

    // Check if user is the author of the post
    const post = (
        await db
            .select({
                slug: posts.slug,
                bounty: posts.bounty,
                userId: posts.userId,
            })
            .from(posts)
            .where(eq(posts.id, answer.postId))
    )?.[0];

    if (!post) {
        return {
            errors: {
                answer: "This post no longer exists",
            },
        };
    }
    if (post.userId !== user.ocid) {
        return {
            errors: {
                answer: "You are not the author of this post",
            },
        };
    }

    // Accept the answer
    await db
        .update(answers)
        .set({
            isAccepted: true,
        })
        .where(eq(answers.id, answer.id));

    // If bounty is attached to the post, transfer it to the answer author
    if (post.bounty) {
        // Get the answer author
        const answerAuthor = (
            await db
                .select({
                    id: users.ocid,
                    balance: users.balance,
                })
                .from(users)
                .where(eq(users.ocid, answer.userId))
        )?.[0];

        // Add bounty to the answer author
        if (answerAuthor) {
            await db
                .update(users)
                .set({
                    balance: answerAuthor.balance + post.bounty,
                })
                .where(eq(users.ocid, answer.userId));
        }
    }

    // Revalidate the post page
    revalidatePath(`/post/${post.slug}-${answer.postId}`);

    return true;
}
