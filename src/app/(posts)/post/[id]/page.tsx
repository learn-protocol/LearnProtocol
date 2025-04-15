"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Tiptap from "@/components/Editor";
import Vote from "@/components/Post/Vote";
import { DDMMYYYYHHMM } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/CopyButton";
import { GetPost } from "@/actions/posts/GetPost";
import Profile from "@/components/Post/Profile/Profile";
import { GetAnswers } from "@/actions/posts/GetAnswers";
import WriteAnswer from "@/components/Post/Answer/WriteAnswer";
import AnswerButton from "@/components/Post/Answer/AnswerButton";

function parseSlugAndIdFromURL(url: string): { slug: string; id: number } {
    const slug = url.split("-").slice(0, -1).join("-");
    const id = parseInt(url.split("-").at(-1) as string);

    if (isNaN(id)) throw new Error("Invalid ID");
    if (slug.length === 0) throw new Error("Invalid Slug");

    return { slug, id };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const _404 = {
        title: "Post not found - Learn Protocol",
        description: "The post you are looking for does not exist.",
    };

    const { id: url } = await params;

    const { slug, id } = parseSlugAndIdFromURL(url);
    if (!slug || !id) return _404;

    const post = await GetPost(slug, id);
    if (!post) return _404;

    return {
        title: `${post.title} - Learn Protocol`,
        description: post.content.split(" ").slice(0, 15).join(" ") + "...",
    };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: url } = await params;

    let slug: string, id: number;
    try {
        const { slug: postSlug, id: postId } = parseSlugAndIdFromURL(url);
        slug = postSlug;
        id = postId;
    } catch (e) {
        return notFound();
    }

    const [answers, post] = await Promise.all([
        GetAnswers(id), // Get answers by post id
        GetPost(slug, id), // Get post by slug and id
    ]);

    if (!post) return notFound();
    return (
        <>
            <div id="post">
                <div className="question">
                    <div className="top">
                        <div className="post-info">
                            <h1>{post.title}</h1>
                            <div className="metadata">
                                <p>
                                    Asked at <span>{DDMMYYYYHHMM(post.createdAt)}</span>
                                </p>
                            </div>
                        </div>
                        <div className="actions">
                            <AnswerButton title="Answer" />
                        </div>
                    </div>
                    <div className="content">
                        <Tiptap value={post.content} readOnly />
                    </div>
                    <div className="footer">
                        <div className="actions">
                            <Button variant="link">
                                <span>Report Question</span>
                            </Button>
                            <CopyButton
                                notify
                                variant="link"
                                content={`https://learnprotocol.io/post/${post.slug}-${post.id}`}
                            >
                                <span>Copy Link</span>
                            </CopyButton>
                        </div>
                        <div className="user-container">
                            <Profile
                                username={post.userId}
                                avatar={post.avatar}
                                wallet={post.wallet}
                                verified={post.userVerified}
                            />
                        </div>
                    </div>
                </div>
                <div className="answers">
                    {answers.length > 0 ? (
                        answers.map((answer, i) => {
                            return (
                                <div key={i} className="answer" id={`answer-${answer.id}`}>
                                    <div>
                                        <Vote
                                            id={answer.id}
                                            voters={answer.voters}
                                            postAuthor={post.userId}
                                            answerAuthor={answer.userId}
                                            isAccepted={answer.isAccepted}
                                            votes={answer.upvotes - answer.downvotes}
                                        />
                                        <div className="content">
                                            <Tiptap value={answer.content} readOnly />
                                        </div>
                                    </div>
                                    <div className="footer">
                                        <div className="actions">
                                            <Button variant="link">
                                                <span>Report Answer</span>
                                            </Button>
                                            <CopyButton
                                                notify
                                                variant="link"
                                                content={`https://learnprotocol.io/post/${post.slug}-${post.id}#answer-${answer.id}`}
                                            >
                                                <span>Copy Link</span>
                                            </CopyButton>
                                        </div>
                                        <div className="user-container">
                                            <Profile
                                                username={answer.userId}
                                                avatar={answer.avatar!}
                                                wallet={answer.wallet!}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <NoAnswer />
                    )}
                </div>
            </div>
            <WriteAnswer id={id} />
        </>
    );
}

function NoAnswer() {
    return (
        <div className="no-answers">
            <p>No answers yet. Be the first one and help the community!</p>
            <AnswerButton variant="outline" title="Write an Answer" />
            <ul>
                <li>
                    <a
                        href="https://blog.learnprotocol.io/how-to-earn-lp-tokens-in-learn-protocol"
                        target="_blank"
                    >
                        How to earn $LP tokens in Learn Protocol?
                    </a>
                </li>
                <li>
                    <a href="https://blog.learnprotocol.io/writing-a-good-answer" target="_blank">
                        Writing the best answer
                    </a>
                </li>
                <li>
                    <a href="https://blog.learnprotocol.io/learn-protocol-in-one-take" target="_blank">
                        Learn Protocol in one take
                    </a>
                </li>
                <li>
                    <a href="https://blog.learnprotocol.io/benefits-of-using-learn-protocol" target="_blank">
                        Benefits of using Learn Protocol
                    </a>
                </li>
            </ul>
        </div>
    );
}
