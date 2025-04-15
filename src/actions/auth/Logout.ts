"use server";

import { destroySession } from "@/lib/session";

export async function Logout(): Promise<{ status: boolean }> {
    try {
        await destroySession();
    } catch (error) {
        return { status: false };
    }
    return { status: true };
}
