import { notFound } from "next/navigation";

import { CakeIcon } from "lucide-react";
import { FaPencil } from "react-icons/fa6";
import { IoArrowUpCircle } from "react-icons/io5";
import { RiVerifiedBadgeFill } from "react-icons/ri";

import Logo from "@/components/Logo";
import Avatar from "@/components/Profile/Avatar";
import { daysToRelativeHistory } from "@/lib/utils";
import ProfilePages from "@/components/Profile/ProfilePages";
import { GetUserDetails } from "@/actions/profile/GetUserDetails";

export default async function InnerUserLayout({
    params,
    children,
}: {
    params: Promise<{ user: string }>;
    children: React.ReactNode;
}) {
    const { user: username } = await params;

    const user = await GetUserDetails(username);
    if (!user) return notFound();

    return (
        <div className="user-container">
            <div className="user-banner-template">
                <div className="user-information">
                    {/* Avatar */}
                    <Avatar username={username} avatar={user.avatar} />

                    <div className="user-details flex flex-col gap-2">
                        {/* Username and wallet address */}
                        <div className="flex items-center gap-3">
                            <h2>
                                {username}
                                {user.verified && <RiVerifiedBadgeFill color="#2f4ce7" size={28} />}
                            </h2>
                            <small className="mt-3">
                                <a
                                    href={`https://educhain.blockscout.com/address/${user.wallet}`}
                                    target="_blank"
                                >
                                    {user.wallet}
                                </a>
                            </small>
                        </div>
                        {/* User details */}
                        <div className="meta flex items-center gap-3">
                            <div>
                                <CakeIcon color="#4c4c4c" size={18} />
                                <p>
                                    <span>{daysToRelativeHistory(user.accountAge)}</span>
                                    &nbsp;ago
                                </p>
                            </div>
                            <div>
                                <IoArrowUpCircle color="#4c4c4c" size={18} />
                                <p>
                                    <span>{user.upvoteCount}</span>
                                    &nbsp;upvotes
                                </p>
                            </div>
                            <div>
                                <FaPencil color="#4c4c4c" size={16} />
                                <p>
                                    <span>{user.upvoteCount}</span>
                                    &nbsp;answers
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* User balance */}
                    <div className="balance">
                        <div className="flex items-center gap-2">
                            <Logo size={24} />
                            <p>{user.balance.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile links */}
            <ProfilePages username={username} />

            {/* Profile content (Page component) */}
            <div className="profile-content">{children}</div>
        </div>
    );
}
