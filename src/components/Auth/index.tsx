"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useOCAuth } from "@opencampus/ocid-connect-js";

import Login from "@/actions/auth/Login";
import { type IUser, useUserStore } from "@/lib/states";

export default function Auth() {
    const { ocAuth, authState } = useOCAuth();
    const { setUser, setStatus } = useUserStore();

    function loginError() {
        toast.error("You couldn't login to Learn Protocol, please try again.");
    }

    useEffect(() => {
        // OCID is connected, check session
        if (authState?.accessToken && ocAuth?.tokenManager?.publicKey) {
            Login(authState.accessToken, ocAuth.tokenManager.publicKey)
                .then((response: { status: boolean; user: IUser | null }) => {
                    if (response.status) setUser(response.user!);
                })
                .catch(error => {
                    if (error) console.error("Login error:", error);
                    loginError();
                })
                .finally(() => {
                    setStatus("idle");
                });
        }

        // OCID is not connected
        else if (!authState?.accessToken && ocAuth?.tokenManager?.publicKey) {
            setStatus("idle");
        }
    }, [authState.accessToken, ocAuth?.tokenManager?.publicKey]);

    return null;
}
