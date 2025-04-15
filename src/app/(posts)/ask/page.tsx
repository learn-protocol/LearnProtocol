"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";

import { RxCross2 } from "react-icons/rx";
import { BsFillQuestionCircleFill } from "react-icons/bs";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Logo from "@/components/Logo";
import Loading from "@/components/Loading";
import { useUserStore } from "@/lib/states";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddPost } from "@/actions/posts/AddPost";
import CategoryIcon from "@/components/Category/Icons";
import GetCategories from "@/actions/category/GetCategories";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import "./ask.scss";

export default function AskPage() {
    const router = useRouter();

    const [state, action, pending] = useActionState(AddPost, undefined);

    const { user, setUser } = useUserStore();

    const [content, setContent] = useState("");
    const [categories, setCategories] = useState<
        Array<{
            name: string;
            description: string | null;
        }>
    >([]);
    const [bounty, setBounty] = useState(0);
    const [showGreeting, setShowGreeting] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [Tiptap, setTiptap] = useState<React.FC<any> | null>(null);

    useEffect(() => {
        const getCategories = async () => {
            const categories_ = await GetCategories();
            setCategories(categories_);
        };

        getCategories();

        if (localStorage.getItem("ask-greeting") === null) {
            setShowGreeting(true);
        }

        // Lazy-load editor component
        import("@/components/Editor").then(module => {
            setTiptap(() => module.default);
        });
    }, []);

    useEffect(() => {
        // Error message handling
        if (
            state &&
            "errors" in state &&
            !["content", "title", "category"].includes(Object.keys(state.errors)[0])
        ) {
            toast.error(Object.values(state.errors)[0]);
            return;
        }

        // Redirect to the post page if the post is created
        if (state && "url" in state) {
            // Check if bounty is set
            if (bounty) {
                const newBalance = user!.balance - bounty;
                setUser({ ...user!, balance: newBalance });
            }

            router.push(`/post/${state.url}`);
        }
    }, [state]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
    }

    const isError = state && "errors" in state;

    return (
        <div id="ask">
            {showGreeting && (
                <div className="greeting">
                    <h2>Welcome to Learn Protocol</h2>
                    <p>
                        Please read the guidelines before asking a question. This will help you get better
                        answers.
                    </p>
                    <Button
                        asChild
                        variant={null}
                        className="close"
                        onClick={() => {
                            setShowGreeting(false);
                            localStorage.setItem("ask-greeting", "0");
                        }}
                    >
                        <RxCross2 fill="red" size={18} />
                    </Button>
                </div>
            )}

            <h1>Ask a Question</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <Input
                        name="title"
                        id="title"
                        type="text"
                        placeholder="How to deploy a smart contract?"
                        maxLength={128}
                        minLength={15}
                        required
                    />
                    {isError && state?.errors?.title && (
                        <p className="text-sm text-red-500">{state.errors.title}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    {Tiptap && (
                        <>
                            <Tiptap
                                showLength
                                maxLength={15000}
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
                        </>
                    )}
                    {isError && state?.errors?.content && (
                        <p className="text-sm text-red-500">{state.errors.content}</p>
                    )}
                </div>
                <div className="flex items-start gap-3">
                    <div className="form-group flex-1">
                        <label htmlFor="category">Category</label>
                        <Select name="category">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    {categories.map((category, index) => (
                                        <SelectItem key={index} value={category.name}>
                                            <div className="flex items-center gap-3">
                                                <CategoryIcon
                                                    color="#2f4ce7"
                                                    size={18}
                                                    category={category.name}
                                                />
                                                {category.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {isError && state?.errors?.category && (
                            <p className="text-sm text-red-500">{state.errors.category}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger type="button" className="w-fit">
                                    <div className="flex items-center justify-start gap-2 w-fit">
                                        <label htmlFor="bounty">
                                            Bounty <small>(Optional)</small>
                                        </label>
                                        <BsFillQuestionCircleFill />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p className="max-w-[320px]">
                                        Bounty is the amount of money you are willing to pay for the answer.
                                        If you don&apos;t mark an answer as correct, most upvoted answer will
                                        be selected automatically. If you think the answer is not correct, you
                                        can ask for a refund by contacting Learn Protocol moderators.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="relative w-fit">
                            <Input
                                className="w-[240px] pr-10"
                                name="bounty"
                                type="number"
                                id="bounty"
                                placeholder="10.00"
                                maxLength={128}
                                defaultValue={0}
                                value={bounty}
                                onChange={e => {
                                    const value = parseFloat(e.target.value);
                                    if (value < 0) setBounty(0);
                                    else if (user?.balance && value > user.balance) setBounty(user.balance);
                                    else setBounty(value);
                                }}
                                required
                            />
                            <div className="absolute right-1 top-1/2 -translate-y-1/2">
                                <Logo size={27} />
                            </div>
                        </div>
                    </div>
                </div>
                <Button variant="default" type="submit" disabled={pending} className="mt-4">
                    {pending ? <Loading size={24} white /> : "Submit Question"}
                </Button>
            </form>
            <div className="guidelines">
                <h3>Guidelines</h3>
                <h4>Who will answer my question?</h4>
                <p>
                    Learn Protocol community members will answer your questions. Make sure to provide enough
                    information so others can understand the issue.
                    <br />
                    Other users will earn $LP tokens for answering your question. That&apos;s what motivates
                    them to help you.
                </p>
                <h4>What if my question doesn&apos;t get answered</h4>
                <p>
                    If your question doesn&apos;t get answered, you can set a bounty or ask the question again
                    with more details. Be sure that you don&apos;t ask the same question over and over. Learn
                    Protocol moderators will remove spam questions.
                </p>
                <h4>What is bounty system?</h4>
                <p>
                    Bounty is the amount of money you are willing to pay for the answer. If you don&apos;t
                    mark an answer as correct, most upvoted answer will be selected automatically. If you
                    think the answer is not correct, you can ask for a refund by contacting Learn Protocol
                    moderators.
                </p>
            </div>
        </div>
    );
}
