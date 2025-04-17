"use server";

import { count, eq } from "drizzle-orm";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function TotalUsers() {
    "use cache";
    cacheLife("hours");

    const getUsersCount = () =>
        db
            .select({
                count: count(),
            })
            .from(users);

    const getVerifiedUsersCount = () =>
        db
            .select({
                count: count(),
            })
            .from(users)
            .where(eq(users.verified, true));

    const [usersCount, verifiedUsersCount] = await Promise.all([getUsersCount(), getVerifiedUsersCount()]);

    return {
        totalUsers: usersCount[0].count,
        verifiedUsers: verifiedUsersCount[0].count,
    };
}
