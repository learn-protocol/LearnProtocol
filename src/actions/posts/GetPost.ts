"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { posts, users } from "@/db/schema";

interface PostBase {
    id: number;
    slug: string;
    title: string;
    userId: string;
    content: string;
    createdAt: Date;
}

interface Post extends PostBase {
    wallet: string;
    avatar: string | null;
    userVerified: boolean;
}

export async function GetPost(slug: string, id: number): Promise<Post | null> {
    const rawPost = await db
        .select()
        .from(posts)
        .where(and(eq(posts.id, id), eq(posts.slug, slug)));

    if (!rawPost?.[0]) return null;
    const post: PostBase = rawPost[0];

    // Get user details from post
    const { userId } = post;

    const user = await db.select().from(users).where(eq(users.ocid, userId!));

    return {
        ...post,
        avatar: user[0].avatar,
        wallet: user[0].wallet,
        userVerified: user[0].verified || false,
    };
}
