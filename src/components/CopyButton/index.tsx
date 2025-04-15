"use client";

import { toast } from "sonner";

import { CopyIcon } from "lucide-react";

import { Button } from "../ui/button";

export default function CopyButton({
    content,
    icon = true,
    children,
    variant = "link",
    notify = false,
}: {
    content: string;
    icon?: boolean;
    children: React.ReactNode;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
    notify?: boolean;
}) {
    return (
        <Button
            variant={variant}
            onClick={() => {
                navigator.clipboard.writeText(content);
                if (notify) {
                    toast.success(content);
                }
            }}
            className="copy-button"
        >
            {children}
            {icon && <CopyIcon />}
        </Button>
    );
}
