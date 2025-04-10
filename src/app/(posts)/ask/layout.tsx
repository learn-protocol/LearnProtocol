import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ask Question - Learn Protocol",
    description: "Ask a question and get answers from the community.",
};

export default function AskLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
