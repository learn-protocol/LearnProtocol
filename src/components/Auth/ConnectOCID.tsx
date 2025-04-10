"use client";

import { toast } from "sonner";
import { useOCAuth } from "@opencampus/ocid-connect-js";

import { Button } from "../ui/button";
import { useUserStore } from "@/lib/states";

export default function ConnectOCID() {
    const { ocAuth } = useOCAuth();
    const { user, status } = useUserStore();

    const handleLogin = async () => {
        try {
            await ocAuth.signInWithRedirect({ state: "opencampus" });
        } catch (error) {
            toast.error("You couldn't login to Learn Protocol, please try again.");
            if (error) console.error("Login error:", error);
        }
    };

    if (user || status === "loading") return null;
    return <Button onClick={handleLogin}>Connect OCID</Button>;
}
