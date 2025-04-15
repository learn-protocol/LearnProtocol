"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";

// Getting rid of SSR errors by using dynamic import
const OCConnect = dynamic(() => import("@opencampus/ocid-connect-js").then(mod => mod.OCConnect), {
    ssr: false,
}) as React.ComponentType<{
    opts: { redirectUri: string | undefined };
    sandboxMode: boolean;
    children: ReactNode;
}>;

const opts = {
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
};

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    if (!OCConnect) return null;
    return (
        <OCConnect opts={opts} sandboxMode={true}>
            {children}
        </OCConnect>
    );
}
