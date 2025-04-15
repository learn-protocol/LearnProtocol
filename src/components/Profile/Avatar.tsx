"use client";

import { toast } from "sonner";
import { useRef, useState, useTransition } from "react";

import { FaUpload } from "react-icons/fa";

import Loading from "../Loading";
import { useUserStore } from "@/lib/states";
import { stringToLinearGradient } from "@/lib/utils";
import { UploadAvatar } from "@/actions/profile/UploadAvatar";

export default function Avatar({
    username,
    avatar: initialAvatar,
}: {
    username: string;
    avatar?: string | null;
}) {
    const { user } = useUserStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isPending, startTransition] = useTransition();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatar ?? null);

    function handleUploadClick() {
        fileInputRef.current?.click();
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        startTransition(async () => {
            try {
                const { url } = await UploadAvatar(formData);
                setAvatarUrl(url);
            } catch (error: any) {
                switch (error?.message) {
                    case "FileTooLarge":
                        toast.error("File size exceeds 2MB. Please choose a smaller file.");
                        break;
                    case "InvalidFileType":
                        toast.error("Invalid file type. Only PNG and JPEG are allowed.");
                        break;
                    case "NoFileProvided":
                        toast.error("No file provided. Please select a file to upload.");
                        break;
                    default:
                        toast.error("An error occurred while uploading the avatar. Please try again.");
                }
            }
        });
    }

    return (
        <div className="avatar-container">
            {isPending ? (
                <div className="avatar flex items-center justify-center">
                    <Loading size={32} />
                </div>
            ) : (
                <>
                    {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="avatar" src={avatarUrl} alt="User avatar" />
                    ) : (
                        <div
                            className="avatar"
                            style={{ background: stringToLinearGradient(username) }}
                        ></div>
                    )}
                </>
            )}
            {user?.ocid === username && (
                <div className="hidden-icon" onClick={handleUploadClick}>
                    <FaUpload color="#ffffff" size={32} />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    );
}
