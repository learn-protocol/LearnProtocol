"use client";

import { Button } from "@/components/ui/button";
import { useAnswerTextareaStore } from "@/lib/states";

export default function AnswerButton({
    variant = "default",
    title,
}: {
    variant?: "default" | "outline" | "secondary";
    title: string;
}) {
    const setTriggerOutline = useAnswerTextareaStore().setTriggerOutline;

    return (
        <Button variant={variant} onClick={() => setTriggerOutline(true)}>
            {title}
        </Button>
    );
}
