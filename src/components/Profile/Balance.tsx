"use client";

import Logo from "../Logo";
import Withdraw from "./Withdraw";
import { useUserStore } from "@/lib/states";

export default function BalanceContainer() {
    const { user } = useUserStore();

    if (!user) return null;
    return (
        <div className="balance-container">
            <p>You have</p>
            <h2>
                <Logo size={32} />{" "}
                {user.balance.toString().includes(".") ? user.balance.toFixed(2) : user.balance}
            </h2>
            <p>$LP tokens in your account</p>
            <Withdraw />
        </div>
    );
}
