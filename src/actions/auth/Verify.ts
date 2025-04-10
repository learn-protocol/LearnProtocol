"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import GetUser from "./GetUser";
import Wallet from "@/lib/wallet";
import { users, verificationWallets } from "@/db/schema";
import { GetVerificationWallet } from "./GetVerificationWallet";

export async function Verify(): Promise<{ verified: boolean }> {
    const user = (await GetUser())?.user;
    if (!user) throw new Error("User not found");

    // Check if user is already verified
    if (user.verified) {
        return { verified: true };
    }

    // Get user's verification wallet
    const verificationWallet = await GetVerificationWallet();
    if (!verificationWallet?.wallet) throw new Error("Verification wallet not found");

    const address = verificationWallet.wallet;

    // Check EDU balance of wallet
    const wallet = new Wallet();
    const balance = await wallet.getEduBalance(address);

    if (balance < 1) {
        return { verified: false };
    }

    // Update user verification status
    await Promise.all([
        db.update(users).set({ verified: true }).where(eq(users.ocid, user.ocid)),
        db
            .update(verificationWallets)
            .set({ verified: true })
            .where(eq(verificationWallets.address, address)),
    ]);

    return { verified: true };
}
