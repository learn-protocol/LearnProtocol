import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PostList from "@/components/Posts/List";
import PostSkeleton from "@/components/Posts/Loading";
import GetCategory from "@/actions/category/GetCategory";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category } = await params;

    const categoryDetails = await GetCategory(category);

    return {
        title: `${category} - Learn Protocol`,
        description: categoryDetails?.description || `Explore posts in this ${category} category`,
    };
}

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ p: number }>;
}) {
    const { p } = await searchParams;
    const { category } = await params;

    const categoryDetails = await GetCategory(category);
    if (!categoryDetails) return notFound();

    return (
        <div id="category" className="posts">
            {/* Heading */}
            <h2>{categoryDetails.name}</h2>
            <p className="description">{categoryDetails.description}</p>

            {/* Posts */}
            <div className="post-container">
                <Suspense fallback={<PostSkeleton />}>
                    <PostList category={category} page={Number(p) || 1} />
                </Suspense>
            </div>
        </div>
    );
}
