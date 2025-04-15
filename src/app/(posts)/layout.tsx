import RightNav from "@/components/RightNav";

import "./posts.scss";

export default function PostsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="posts-wrapper">
            <main>{children}</main>
            <RightNav />
        </div>
    );
}
