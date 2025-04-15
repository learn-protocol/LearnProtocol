import Link from "next/link";
import Image from "next/image";

import { RiVerifiedBadgeFill } from "react-icons/ri";

import { stringToLinearGradient, truncateUsername, truncateWalletAddress } from "@/lib/utils";

import "./profile.scss";

export default function Profile({
    username,
    avatar,
    wallet,
    verified,
}: {
    username: string;
    avatar?: string | null;
    wallet: string;
    verified?: boolean;
}) {
    return (
        <div className="profile-box">
            <Link href={`/profile/${username}/statistics`}>
                {avatar ? (
                    <Image className="avatar" src={avatar} alt={username} height={24} width={24} />
                ) : (
                    <div className="avatar" style={{ background: stringToLinearGradient(username) }}></div>
                )}
                <div className="info">
                    <p className="flex gap-1 items-center">
                        {truncateUsername(username)}
                        {verified && <RiVerifiedBadgeFill className="verified" color="#2f4ce7" size={14} />}
                    </p>
                    <span>{truncateWalletAddress(wallet, 12)}</span>
                </div>
            </Link>
        </div>
    );
}
