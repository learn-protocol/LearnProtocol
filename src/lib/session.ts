import "server-only";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import type { IUser } from "@/actions/auth/GetUser";

const cookieKey = "session";

export function createSession(ocid: string, wallet: string) {
    return new Promise(async (resolve, reject) => {
        const cookieStore = await cookies();

        jwt.sign(
            { ocid, wallet },
            process.env.SESSION_SECRET!,
            { expiresIn: "1d" },
            (error: Error | null, encoded: string | undefined) => {
                if (error) return reject(error);
                if (!encoded) return reject(new Error("Failed to create session"));

                // Set the session cookie
                cookieStore.set(cookieKey, encoded, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24,
                });

                return resolve(encoded);
            },
        );
    });
}

export function validateSession(): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
        const cookieStore = await cookies();

        const sessionCookie = cookieStore.get(cookieKey);
        if (!sessionCookie) return reject();

        jwt.verify(sessionCookie.value, process.env.SESSION_SECRET!, (err, decoded) => {
            if (err) return reject();
            return resolve(decoded as IUser);
        });
    });
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.set(cookieKey, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
    });
}
