"use cache";

import Link from "next/link";

import MetaBox from "./MetaBox";
import type { Post } from "../Posts/List";
import CategoryIcon from "../Category/Icons";
import { HotPosts } from "@/actions/posts/HotPosts";

import "./rightnav.scss";

export default async function RightNav() {
    const hotPosts = await HotPosts();

    return (
        <aside className="right-nav">
            <MetaBox />

            {/* Questions */}
            <div className="questions">
                <h3>Hot Questions</h3>
                <ul>
                    {hotPosts.map((post: Post) => (
                        <li key={post.id}>
                            <CategoryIcon category={post.category} />
                            <Link href={`/post/${post.slug}-${post.id}`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
