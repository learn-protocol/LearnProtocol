import React from "react";
import rehypeRaw from "rehype-raw";
// import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

type MarkdownRendererProps = {
    children: string;
};

export function MarkdownRenderer({ children: markdown }: MarkdownRendererProps) {
    return (
        <Markdown
            skipHtml={false}
            // remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");

                    return (
                        <SyntaxHighlighter
                            style={dracula}
                            PreTag="div"
                            language={!inline && match ? match[1] : undefined}
                            {...props}
                        >
                            {String(children ?? "").replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    );
                },
            }}
        >
            {markdown}
        </Markdown>
    );
}
