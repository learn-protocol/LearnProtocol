"use server";

export async function Withdraw(): Promise<{ success: boolean; message?: string }> {
    return { success: true };
}
