"use client";

import { toast } from "sonner";

import { Button } from "../ui/button";
import { useUserStore } from "@/lib/states";
import { Withdraw } from "@/actions/profile/Withdraw";

export default function WithdrawComponent() {
    const { setUser, user } = useUserStore();

    function handleWithdraw() {
        Withdraw().then((res: { success: boolean; message?: string }): void => {
            if (!res?.success && res?.message) {
                toast.error(res.message);
                return;
            }

            toast.success("You have successfully withdrawn your $LP tokens!");
            setUser({ ...user!, balance: 0 });
        });
    }

    if (!user) return null;
    return <Button onClick={handleWithdraw}>Withdraw</Button>;
}
