"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { FaHistory } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { FaGear, FaSackDollar } from "react-icons/fa6";

import { Button } from "../ui/button";
import { useUserStore } from "@/lib/states";
import { Logout } from "@/actions/auth/Logout";

const pages = [
    // { name: "Settings", path: "/settings", icon: <FaGear />, requiresAuth: true },
    { name: "Earnings", path: "/earnings", icon: <FaSackDollar />, requiresAuth: true },
    { name: "Statistics", path: "/statistics", icon: <BsGraphUp /> },
    { name: "Activity", path: "/activity", icon: <FaHistory /> },
];

export default function ProfilePages({ username }: { username: string }) {
    const { user, logout } = useUserStore();

    const router = useRouter();
    const pathname = usePathname();

    function handleLogout() {
        Logout()
            .then((response: { status: boolean }) => {
                if (response.status) {
                    try {
                        localStorage.removeItem("ocid_connect_state");
                    } catch (error) {}

                    logout();
                    router.push("/");
                }
            })
            .catch(error => {
                console.error("Logout error:", error);
            });
    }

    return (
        <div className="pages-container">
            <div className="pages">
                {pages.map(page => {
                    if ((page.requiresAuth && user?.ocid === username) || !page.requiresAuth) {
                        return (
                            <Link
                                key={page.name}
                                href={`/profile/${encodeURIComponent(username)}${page.path}`}
                                className={`page ${"/" + pathname.split("/").at(-1) === page.path ? "active" : ""}`}
                            >
                                {page.icon}
                                {page.name}
                            </Link>
                        );
                    }
                    return null;
                })}
            </div>
            <Button variant="destructive" className="logout-btn" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
}
