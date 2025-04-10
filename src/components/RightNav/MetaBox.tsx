"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { useUserStore } from "@/lib/states";

export default function MetaBox() {
    const pathname = usePathname();
    const { user } = useUserStore();

    if (pathname === "/ask") {
        return (
            <div className="meta-box">
                <h3>Tips</h3>
                <p>
                    Provide as much detail as possible in your question to get faster and more accurate
                    answers.
                </p>
                <ol>
                    <li>
                        <strong>Be specific</strong>
                        <p>Make sure your question is specific and clear.</p>
                        <ul>
                            <li>
                                <span>Bad: </span>How do I code in JavaScript?
                                <br />
                                <span>Good: </span> How do I use the map function in JavaScript?
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Provide context</strong>
                        <p>
                            Include any relevant information such as error messages, the environment
                            you&apos;re working in, and what you&apos;ve tried so far.
                        </p>
                    </li>
                    <li>
                        <strong>Be concise but thorough</strong>
                        <p>
                            Avoid excessive details, but make sure you provide enough information to help
                            others understand the issue.
                        </p>
                    </li>
                    <li>
                        <strong>Follow up</strong>
                        <p>
                            If someone provides a solution or asks for more information, be sure to respond
                            quickly to help resolve the issue.
                        </p>
                    </li>
                    <li>
                        <strong>Be polite</strong>
                        <p>Maintain a positive tone in your posts. Everyone is here to help.</p>
                    </li>
                </ol>
            </div>
        );
    }

    if (user && pathname !== "/ask") {
        return (
            <div className="meta-box">
                <h3>Ask a Question</h3>
                <p>If you have a question, feel free to ask it here. The community is here to help you.</p>
                <Button variant="outline" asChild>
                    <Link href="/ask">Ask Question</Link>
                </Button>
            </div>
        );
    }

    if (!user) {
        <div className="meta-box">
            <h3>Join Learn Protocol</h3>
            <p>Join Learn Protocol to earn LP tokens by helping others learn.</p>
            <Button variant="outline">Join Now</Button>
        </div>;
    }
}
