import { ReCaptchaProvider } from "next-recaptcha-v3";

import Auth from "./Auth";
import QueryWrapper from "./Query";
import { Toaster } from "./ui/sonner";
import AuthWrapper from "./Auth/AuthWrapper";

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <QueryWrapper>
            <AuthWrapper>
                <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
                    <Auth />
                    {children}
                    <Toaster />
                </ReCaptchaProvider>
            </AuthWrapper>
        </QueryWrapper>
    );
}
