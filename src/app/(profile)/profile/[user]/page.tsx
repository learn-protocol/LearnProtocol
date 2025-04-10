import { notFound, redirect } from "next/navigation";

export default async function UserPage({ params }: { params: Promise<{ user: string }> }) {
    const user = (await params)?.user;
    if (!user) return notFound();
    redirect(`/profile/${encodeURIComponent(user)}/statistics`);
}
