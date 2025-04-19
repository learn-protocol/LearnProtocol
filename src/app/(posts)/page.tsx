import { Suspense } from "react";

import PostList from "@/components/Posts/List";
import PostSkeleton from "@/components/Posts/Loading";
import GetCategories from "@/actions/category/GetCategories";
import CategoryCarousel from "@/components/Category/Carousel";

export default async function Home({ searchParams }: { searchParams: Promise<{ p: number }> }) {
    const { p } = await searchParams;

    const categories = await GetCategories();

    return (
        <div className="posts">
            {/* Heading */}
            <h2>Latest Posts</h2>
            <p className="description">
                Take a look at the latest posts on Learn Protocol. Post the most detailed answer on a question
                and earn as much as $LP token.
            </p>

            {/* Categories */}
            <div className="category-container">
                <CategoryCarousel categories={categories.map(c => c.name)} />
            </div>

            {/* Posts */}
            <div className="post-container">
                <Suspense fallback={<PostSkeleton />}>
                    <PostList page={Number(p) || 1} />
                </Suspense>
            </div>
        </div>
    );
}