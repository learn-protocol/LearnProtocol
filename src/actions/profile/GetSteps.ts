"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import GetUser from "../auth/GetUser";
import { answers } from "@/db/schema";

export async function GetSteps() {
    const user = (await GetUser())?.user;
    if (!user) {
        return { "step-1": false, "step-2": false };
    }

    /// Step-1: Is user verificated?
    const step1 = user.verified;

    /// Step-2: Is user has at least 50 upvotes?
    const totalUpvotes = (
        await db.select({ upvotes: answers.upvotes }).from(answers).where(eq(answers.userId, user.ocid))
    ).reduce((acc, curr) => acc + curr.upvotes, 0);

    const step2 = totalUpvotes >= 50;

    // Return steps
    return { "step-1": step1, "step-2": step2 };
}
