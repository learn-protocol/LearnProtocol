"use server";

import { unstable_cacheLife as cacheLife } from "next/cache";

import { db } from "@/db";
import { categories as categoriesSchema } from "@/db/schema";

export default async function GetCategories() {
    "use cache";

    cacheLife({
        stale: 3600 * 24,
        revalidate: 3600 * 24 * 2,
    });

    const categories = await db.select().from(categoriesSchema);
    return categories;
}
