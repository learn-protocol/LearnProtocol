"use server";

import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

import { db } from "@/db";
import { users } from "@/db/schema";
import GetUser from "../auth/GetUser";

const s3 = new S3Client({
    region: process.env.DO_REGION!,
    endpoint: process.env.DO_BUCKET_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.DO_ACCESS_KEY!,
        secretAccessKey: process.env.DO_SECRET_KEY!,
    },
});

export async function UploadAvatar(formData: FormData) {
    const user = (await GetUser())?.user;
    if (!user) {
        throw new Error("User not found.");
    }

    const file = formData.get("avatar");

    if (!file || typeof file === "string") {
        throw new Error("NoFileProvided");
    }

    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
        throw new Error("InvalidFileType");
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
        throw new Error("FileTooLarge");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop();
    const key = `avatars/${randomUUID()}.${fileExt}`;

    const uploadParams = {
        Bucket: process.env.DO_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: ObjectCannedACL.public_read,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // Get user's previous avatar URL
    const previousAvatar = (
        await db.select({ avatar: users.avatar }).from(users).where(eq(users.ocid, user.ocid))
    )[0]?.avatar;

    if (previousAvatar) {
        const previousKey = previousAvatar.split("/").pop();
        if (previousKey) {
            const deleteParams = {
                Bucket: process.env.DO_BUCKET_NAME!,
                Key: `avatars/${previousKey}`,
            };
            await s3.send(new PutObjectCommand(deleteParams));
        }
    }

    // Update user's avatar in the database
    await db
        .update(users)
        .set({ avatar: `${process.env.DO_BUCKET_ENDPOINT}/${process.env.DO_BUCKET_NAME}/${key}` })
        .where(eq(users.ocid, user.ocid));

    // Revalidate the user's profile page
    revalidatePath(`/profile/${user.ocid}/`);

    const avatarUrl = `${process.env.DO_BUCKET_ENDPOINT}/${process.env.DO_BUCKET_NAME}/${key}`;
    return { url: avatarUrl };
}
