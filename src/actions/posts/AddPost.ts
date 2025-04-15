"use server";

import { JSDOM } from "jsdom";
import { eq } from "drizzle-orm";
import DOMPurify from "dompurify";

import { db } from "@/db";
import GetUser from "../auth/GetUser";
import { posts, users } from "@/db/schema";
import type { ReturnError } from "@/lib/types";
import { PostSchemas } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function AddPost(state, formData: FormData): Promise<ReturnError | { url: string }> {
    const title = formData.get("title") as string;
    const category = (formData.get("category") as string).trim();
    const bounty = parseFloat((formData.get("bounty") as string) || "0");

    // Content sanitization
    const window = new JSDOM("").window;
    const purify = DOMPurify(window);
    let content = purify.sanitize(formData.get("content") as string);

    // Check lengths
    if (title.length < 15 || title.length > 128) {
        return {
            errors: {
                title: "Title must be between 15 and 128 characters",
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
    if (realLength < 50 || realLength > 15000) {
        return {
            errors: {
                content: "Content must be between 50 and 15000 characters",
            },
        };
    }

    // Generate slug
    // Post URLs are in the format `${slug}-${id}`
    const slug: string = title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const post = {
        slug,
        title,
        bounty,
        content,
        category,
    };

    // Validate post
    const validation = PostSchemas.PostDTO.safeParse(post);
    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
        };
    }

    // Check user balance if bounty is set
    if (bounty && user.balance < bounty) {
        return {
            errors: {
                bounty: "You don't have enough balance to set this bounty",
            },
        };
    }

    // Add post to database
    const { id } = (
        await db
            .insert(posts)
            .values({
                ...post,
                userId: user.ocid,
            })
            .returning({ id: posts.id })
    )[0];

    // Update user balance if bounty is set
    if (bounty) {
        await db
            .update(users)
            .set({
                balance: user.balance - bounty,
            })
            .where(eq(users.ocid, user.ocid));
    }

    revalidatePath("/");
    revalidatePath("/category/" + category);

    return { url: `${slug}-${id}` };
}
