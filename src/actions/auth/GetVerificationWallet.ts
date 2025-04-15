"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import GetUser from "./GetUser";
import Wallet from "@/lib/wallet";
import { verificationWallets } from "@/db/schema";

export async function GetVerificationWallet(): Promise<{ wallet: string }> {
    const user = (await GetUser())?.user;
    if (!user) throw new Error("User not found");

    // Check if user has a verification wallet created in the database
    const duplicateWallet = await db
        .select({ wallet: verificationWallets.address })
        .from(verificationWallets)
        .where(eq(verificationWallets.userId, user.ocid))
        .limit(1);

    if (duplicateWallet.length > 0) {
        return { wallet: duplicateWallet[0].wallet };
    }

    // Create a new verification wallet for the user
    const wallet = new Wallet();
    const { address, privateKey } = wallet.create();

    await db.insert(verificationWallets).values({
        userId: user.ocid,
        address,
        privateKey,
    });

    return { wallet: address };
}
