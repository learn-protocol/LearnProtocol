import "server-only";
import { AnyColumn, sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export function lower(email: AnyPgColumn): SQL {
    return sql`lower(${email})`;
}

export function increment(column: AnyColumn, value = 1) {
    return sql`${column} + ${value}`;
}
