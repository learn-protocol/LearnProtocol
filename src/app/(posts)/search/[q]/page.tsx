import { Suspense } from "react";

import { queryToTitle } from "@/lib/utils";
import PostList from "@/components/Posts/List";
import PostSkeleton from "@/components/Posts/Loading";

export default async function SearchPage({
    params,
    searchParams,
}: {
    params: Promise<{ q: string }>;
    searchParams: Promise<{ p: number }>;
}) {
    const { q } = await params;
    const { p } = await searchParams;

    return (
        <div className="posts">
            {/* Heading */}
            <h2>{queryToTitle(decodeURIComponent(q))}</h2>
            <p className="description">
                Search results for <strong>{queryToTitle(decodeURIComponent(q))}</strong>. If you can&apos;t
                find what you&apos;re looking for,{" "}
                <a href="/ask" className="ask-link">
                    ask a question
                </a>
                .
            </p>

            {/* Posts */}
            <div className="post-container">
                <Suspense fallback={<PostSkeleton />}>
                    <PostList page={Number(p) || 1} query={decodeURIComponent(q)} />
                </Suspense>
            </div>
        </div>
    );
}
