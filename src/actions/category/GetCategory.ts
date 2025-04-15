"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { lower } from "@/lib/sql";
import { categories as categoriesSchema } from "@/db/schema";

export default async function GetCategory(name: string) {
    const category = await db
        .select()
        .from(categoriesSchema)
        .where(eq(lower(categoriesSchema.name), name.toLowerCase()))
        .limit(1);

    return category[0];
}
