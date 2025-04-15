import "server-only";
import { z } from "zod";

// User schemas
export class UserSchemas {
    static UserDTO = z
        .object({
            ocid: z.string(),
            wallet: z.string().max(64),
            avatar: z.string().max(255).nullable().optional(),
            verified: z.boolean().default(false),
            balance: z.number(),
        })
        .strip();
}

// Post schemas
export class PostSchemas {
    static PostDTO = z
        .object({
            slug: z.string(),
            title: z.string().min(15).max(128),
            content: z.string().min(50).max(15000),
            category: z.string().min(1, "You must select a category"),
            bounty: z.number().nullable().optional(),
        })
        .strip();

    static UpvoteDTO = z
        .object({
            point: z.union([z.literal(1), z.literal(-1)]),
        })
        .strip();

    static AnswerDTO = z
        .object({
            postId: z.number(),
            content: z.string().min(50).max(10000),
        })
        .strip();
}
