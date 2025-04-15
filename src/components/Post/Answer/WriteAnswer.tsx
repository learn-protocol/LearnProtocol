"use client";

import { useReCaptcha } from "next-recaptcha-v3";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";

import Tiptap from "@/components/Editor";
import { toast } from "@/hooks/use-toast";
import PublishAnswerButton from "./PublishButton";
import { useAnswerTextareaStore } from "@/lib/states";
import { AnswerPost } from "@/actions/posts/AddAnswer";

import "./answer.scss";

export default function WriteAnswer({ id }: { id: number }) {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const { executeRecaptcha } = useReCaptcha();

    const [state, action, pending] = useActionState(AnswerPost, undefined);

    const answerState = useAnswerTextareaStore();

    const [content, setContent] = useState("");

    useEffect(() => {
        if (answerState.triggerOutline) {
            // Focus on the textarea
            (textAreaRef.current?.querySelector("div[contenteditable='true']") as HTMLElement)?.focus();

            // Scroll to the bottom of the textarea
            textAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
        }
        answerState.setTriggerOutline(false);
    }, [answerState.triggerOutline]);

    useEffect(() => {
        // Error message handling
        if (state && "errors" in state && !["content"].includes(Object.keys(state.errors)[0])) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: Object.values(state.errors)[0],
            });
        }
    }, [state]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Generate captcha token
        const token = await executeRecaptcha("form_submit");

        // Add captcha token to form data
        formData.append("token", token);

        // Attach post ID
        formData.append("post-id", id.toString());

        startTransition(() => action(formData));
    }

    const isError = state && "errors" in state;

    return (
        <div className="write-answer">
            <form onSubmit={handleSubmit}>
                <Tiptap
                    ref={textAreaRef}
                    maxLength={10000}
                    placeholder="Write your answer..."
                    onChange={(c: string) => {
                        setContent(c);
                    }}
                />
                <textarea
                    style={{ visibility: "hidden", height: 0 }}
                    name="content"
                    value={content}
                    readOnly
                />
                {isError && state?.errors?.content && (
                    <p className="text-sm text-red-500">{state.errors.content}</p>
                )}
                <small>
                    <b>Note: </b>
                    You can get help from LLMs (ChatGPT, Claude, etc.) but copying and pasting answers from AI
                    tools to farm $LP tokens is not allowed. It may cause your account to be banned
                    permanently.
                </small>
                <div className="action">
                    <PublishAnswerButton pending={pending} />
                </div>
            </form>
        </div>
    );
}
