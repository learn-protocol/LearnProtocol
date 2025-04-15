"use server";

import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/session";
import { UserSchemas } from "@/lib/definitions";
import GetUser, { type IUser } from "./GetUser";

interface IDecodedJWT {
    edu_username: string;
    eth_address: string;
}

export default async function Login(
    token: string,
    key: string,
): Promise<{ status: boolean; user: IUser | null }> {
    const userBySession = await GetUser();
    if (userBySession?.user) return { status: true, user: userBySession.user };

    key = `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`;
    const decoded = jwt.verify(token, key, { algorithms: ["ES256"] }) as IDecodedJWT & { exp: number };

    if (!decoded.edu_username || !decoded.eth_address) throw new Error("Invalid token");
    if (Date.now() > decoded.exp * 1000) return { status: false, user: null };

    await createSession(decoded.edu_username, decoded.eth_address);

    // Check if user exists
    const user = await db.select().from(users).where(eq(users.ocid, decoded.edu_username));
    if (user.length > 0)
        return {
            status: true,
            user: UserSchemas.UserDTO.parse(user[0]),
        };

    const newUser = {
        ocid: decoded.edu_username,
        wallet: decoded.eth_address,
        verified: false,
        balance: 0,
    };

    await db.insert(users).values(newUser);

    return {
        status: true,
        user: newUser,
    };
}
