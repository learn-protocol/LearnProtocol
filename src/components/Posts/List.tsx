"use cache";

import Link from "next/link";
import { JSDOM } from "jsdom";
import { unstable_cacheLife } from "next/cache";

import { DDMMYYYYHHMM } from "@/lib/utils";
import CategoryIcon from "../Category/Icons";
import { LatestPosts } from "@/actions/posts/LatestPosts";
import Pagination from "../Pagination";

export interface Post {
    id: number;
    userId: string;
    slug: string;
    title: string;
    content: string;
    category: string;
    upvotes: number;
    downvotes: number;
    bounty: number;
    createdAt: Date;
}

const stripHtmlWithSpaces = (html: string) => {
    const dom = new JSDOM(html);
    const body = dom.window.document.body;
    let text = "";

    body.childNodes.forEach(node => {
        if (node.nodeType === 3) {
            text += node.textContent?.trim() + " ";
        } else if (node.nodeType === 1) {
            text += node.textContent?.trim() + " ";
        }
    });

    return text.replace(/\s+/g, " ").trim();
};

export default async function PostList({
    page,
    category = null,
}: {
    page: number;
    category?: string | null;
}) {
    unstable_cacheLife({
        stale: 60,
        revalidate: 60,
    });

    const { posts, total } = await LatestPosts({ page, perPage: 25, category });

    return (
        <>
            {posts.length > 0 ? (
                <>
                    {posts.map((post: Post, i: number) => {
                        const plainContent = stripHtmlWithSpaces(post.content);

                        return (
                            <Link key={i} href={`/post/${post.slug}-${post.id}`} className="post">
                                <h3>{post.title}</h3>
                                <p>
                                    {plainContent!.length > 400
                                        ? plainContent!.slice(0, 400) + "..."
                                        : plainContent}
                                </p>
                                <div className="metadata">
                                    <div className="category">
                                        <CategoryIcon size={16} category={post.category} />
                                        <span>{post.category}</span>
                                    </div>
                                    <span>{DDMMYYYYHHMM(post.createdAt)}</span>
                                </div>
                            </Link>
                        );
                    })}
                    {/* Pagination */}
                    <Pagination total={total} currentPage={page} />
                </>
            ) : (
                <div className="no-posts">
                    <h3>No posts found</h3>
                    <p>
                        There are no posts. Why don&apos;t you <Link href="/ask">create</Link> one?
                    </p>
                </div>
            )}
        </>
    );
}
