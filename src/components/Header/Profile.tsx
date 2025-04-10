"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useUserStore } from "@/lib/states";
import { stringToLinearGradient, truncateUsername } from "@/lib/utils";

export default function Profile() {
    const { user, status } = useUserStore();

    const [truncatedName, setTruncatedName] = useState("");

    useEffect(() => {
        if (!user?.ocid) return;
        setTruncatedName(truncateUsername(user.ocid));
    }, [user?.ocid]);

    if (!user || status === "loading") return null;
    return (
        <div className="profile-container">
            <div className="balance">
                <p>{user.balance.toFixed(2)}</p>
                <span>$LP</span>
            </div>

            <Link href={`/profile/${user.ocid}`} className="profile">
                <p>{truncatedName}</p>
                {user?.avatar ? (
                    <img className="avatar" src={user.avatar} alt="User avatar" />
                ) : (
                    <div className="avatar" style={{ background: stringToLinearGradient(user.ocid) }}></div>
                )}
            </Link>
        </div>
    );
}
