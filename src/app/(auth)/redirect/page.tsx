"use client";

import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { LoginCallBack, useOCAuth } from "@opencampus/ocid-connect-js";

import Loading from "@/components/Loading";

export default function RedirectPage() {
    const router = useRouter();

    const loginSuccess = () => {
        toast.success("You have successfully signed in. Now you can start learning.");

        setTimeout(() => {
            router.replace("/");
        }, 1000);
    };

    const loginError = (error: string) => {
        if (error) console.error("Login error:", error);
    };

    function CustomErrorComponent() {
        const { authState } = useOCAuth();
        return (
            <div className="w-full flex justify-center text-red-600 p-5">
                Error logging in: {authState.error?.message}
            </div>
        );
    }

    function CustomLoadingComponent() {
        return (
            <div className="w-full flex justify-center p-5">
                <Loading size={24} />
            </div>
        );
    }

    return (
        <LoginCallBack
            errorCallback={loginError}
            successCallback={loginSuccess}
            customErrorComponent={<CustomErrorComponent />}
            customLoadingComponent={<CustomLoadingComponent />}
        />
    );
}
