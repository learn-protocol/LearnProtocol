"use server";

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import GetUser from "../auth/GetUser";
import { answers, posts } from "@/db/schema";
import type { ReturnError } from "@/lib/types";
import { PostSchemas } from "@/lib/definitions";

export async function AnswerPost(state, formData: FormData): Promise<ReturnError | { id: number }> {
    const window = new JSDOM("").window;
    const purify = DOMPurify(window);
    const postID = parseInt(formData.get("post-id") as string);
    let content = purify.sanitize(formData.get("content") as string);

    if (!postID) {
        return {
            errors: {
                post: "Invalid post ID",
            },
        };
    }

    // Check if user is logged in
    const user = (await GetUser())?.user;
    if (!user) {
        return {
            errors: {
                user: "You must be logged in to create a post",
            },
        };
    }

    // Content sanitization
    const dom = new JSDOM(content);
    if (!dom?.window?.document?.body?.textContent) return { errors: { content: "Please enter an answer" } };

    const doc = dom.window.document;
    doc.body.querySelectorAll("*").forEach(p => {
        if (!p.textContent?.trim()) {
            p.remove();
        }
    });

    content = doc.body.innerHTML;
    const realLength = dom.window.document.body.textContent.length;
    if (realLength < 50 || realLength > 10000) {
        return {
            errors: {
                content: "Content must be between 50 and 10000 characters",
            },
        };
    }

    // Create answer schema
    const answer = {
        postId: postID,
        content,
    };

    // Validate answer
    const validation = PostSchemas.AnswerDTO.safeParse(answer);
    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
        };
    }

    /// Authority checks
    const post = (await db.select().from(posts).where(eq(posts.id, postID)))[0];

    // Check if user is the author of the post
    if (post.userId === user.ocid) {
        return {
            errors: {
                content: "You cannot answer your own post, you can edit your post instead.",
            },
        };
    }

    // Check if user has already answered the post
    if (process.env.NODE_ENV !== "development") {
        const existingAnswer = await db
            .select()
            .from(answers)
            .where(and(eq(answers.userId, user.ocid), eq(answers.postId, postID)));

        if (existingAnswer.length) {
            return {
                errors: {
                    content: "You have already answered this post, you can edit your answer instead.",
                },
            };
        }
    }

    // Captcha validation
    const captchaToken = formData.get("token") as string;

    const captchaVerificationEndpoint = new URL("https://www.google.com/recaptcha/api/siteverify");
    captchaVerificationEndpoint.searchParams.append("secret", process.env.RECAPTCHA_SERVER_KEY!);
    captchaVerificationEndpoint.searchParams.append("response", captchaToken);

    const req = await fetch(captchaVerificationEndpoint);
    const captchaResponse = await req.json();

    if (!captchaResponse.success) {
        return {
            errors: {
                toast: "Bot activity detected, please try again.",
            },
        };
    }

    // Add answer to the database
    const { id } = (
        await db
            .insert(answers)
            .values({
                ...answer,
                userId: user.ocid,
            })
            .returning({ id: answers.id })
    )[0];

    // Get post slug
    const postSlug = post.slug;

    revalidatePath(`/post/${postSlug}-${postID}`);

    return { id };
}
