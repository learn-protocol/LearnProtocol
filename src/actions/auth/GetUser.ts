"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { validateSession } from "@/lib/session";
import { UserSchemas } from "@/lib/definitions";

export interface IUser {
    ocid: string;
    wallet: string;
    balance: number;
    verified: boolean;
    avatar?: string | null;
}

export default async function GetUser(): Promise<{ user: IUser | null } | void> {
    return new Promise((resolve, reject) => {
        validateSession()
            .then((sessionUser: { ocid: string; wallet: string }) => {
                db.select()
                    .from(users)
                    .where(eq(users.ocid, sessionUser.ocid))
                    .then(user => {
                        if (user.length === 0) return resolve({ user: null });
                        return resolve({ user: UserSchemas.UserDTO.parse(user[0]) });
                    });
            })
            .catch(() => {
                return resolve({ user: null });
            });
    });
}
