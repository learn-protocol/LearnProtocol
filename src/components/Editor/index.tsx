/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { all, createLowlight } from "lowlight";

import {
    useEditor,
    EditorContent,
    ReactNodeViewRenderer,
    NodeViewContent,
    NodeViewWrapper,
    type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Mathematics } from "@tiptap-pro/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import {
    FaAlignCenter,
    FaAlignJustify,
    FaAlignLeft,
    FaAlignRight,
    FaBold,
    FaCode,
    FaHighlighter,
    FaItalic,
    FaParagraph,
    FaStrikethrough,
} from "react-icons/fa6";

import "katex/dist/katex.min.css";
import "./editor.scss";

const lowlight = createLowlight(all);

const Tiptap = ({
    ref = null,
    value = "",
    placeholder = "",
    readOnly = false,
    maxLength = 15000,
    onChange = () => {},
    showLength = false,
    heightFit = false,
    clear = false,
    setClear = () => {},
}: {
    ref?: any;
    value?: string;
    placeholder?: string;
    readOnly?: boolean;
    maxLength?: number;
    onChange?: (content: string) => void;
    showLength?: boolean;
    heightFit?: boolean;
    clear?: boolean;
    setClear?: (clear: boolean) => void;
}) => {
    const [characterCount, setCharacterCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [percentage, setPercentage] = useState(0);

    const editor = useEditor({
        extensions: [
            Highlight,
            StarterKit,
            Mathematics,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder: placeholder || "Write something …",
            }),
            CharacterCount.configure({
                limit: maxLength,
            }),
            CodeBlockLowlight.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent);
                },
            }).configure({ lowlight }),
        ],
        content: value,
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        onUpdate: ({ editor }) => {
            if (editor && editor.storage.characterCount && !readOnly) {
                const chars = editor.storage.characterCount.characters();
                const words = editor.storage.characterCount.words();

                setWordCount(words);
                setCharacterCount(chars);
                setPercentage(Math.round((100 / maxLength) * chars));

                onChange(editor.getHTML());
            }
        },
    });

    useEffect(() => {
        if (editor && readOnly) {
            editor.setEditable(false);
        }
    }, [editor, readOnly]);

    useEffect(() => {
        if (editor && clear) {
            editor.commands.clearContent(true)
            editor.commands.setContent("");
            setClear(false);
        }
    }, [editor, clear]);

    if (!editor) {
        return null;
    }

    return (
        <div className={"editor " + (heightFit ? "height-fit" : "")}>
            {!readOnly && <MenuBar editor={editor} />}
            <EditorContent ref={ref} editor={editor} spellCheck={false} />

            {showLength && (
                <div
                    className={`character-count ${characterCount === maxLength ? "character-count--warning" : ""}`}
                >
                    <svg height="40" width="40" viewBox="0 0 20 20">
                        <circle r="10" cx="10" cy="10" fill="#e9ecef" />
                        <circle
                            r="5"
                            cx="10"
                            cy="10"
                            fill="transparent"
                            stroke="#2f4ce7"
                            strokeWidth="10"
                            transform="rotate(-90) translate(-20)"
                            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
                        />
                        <circle r="6" cx="10" cy="10" fill="white" />
                    </svg>
                    <div>
                        <p>
                            <span>{characterCount}</span> / {maxLength} characters
                        </p>
                        <p>
                            <span>{wordCount}</span> words
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

function CodeBlockComponent({
    node: {
        attrs: { language: defaultLanguage },
    },
    updateAttributes,
    extension,
}: any) {
    return (
        <NodeViewWrapper className="code-block">
            <select
                contentEditable={false}
                defaultValue={defaultLanguage}
                onChange={event => updateAttributes({ language: event.target.value })}
            >
                <option value="null">auto</option>
                <option disabled>—</option>
                {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
                    <option key={index} value={lang}>
                        {lang}
                    </option>
                ))}
            </select>
            <pre>
                <NodeViewContent as="code" />
            </pre>
        </NodeViewWrapper>
    );
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    return (
        <div className="control-group">
            <div className="button-group">
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor!.isActive("heading", { level: 2 }) ? "is-active" : ""}
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor!.isActive("heading", { level: 3 }) ? "is-active" : ""}
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={editor!.isActive("heading", { level: 4 }) ? "is-active" : ""}
                >
                    H4
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().setParagraph().run()}
                    className={editor!.isActive("paragraph") ? "is-active" : ""}
                >
                    <FaParagraph />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().toggleCodeBlock().run()}
                    className={editor!.isActive("codeBlock") ? "is-active" : ""}
                >
                    <FaCode />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().toggleBold().run()}
                    className={editor!.isActive("bold") ? "is-active" : ""}
                >
                    <FaBold />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().toggleItalic().run()}
                    className={editor!.isActive("italic") ? "is-active" : ""}
                >
                    <FaItalic />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().toggleStrike().run()}
                    className={editor!.isActive("strike") ? "is-active" : ""}
                >
                    <FaStrikethrough />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().toggleHighlight().run()}
                    className={editor!.isActive("highlight") ? "is-active" : ""}
                >
                    <FaHighlighter />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().setTextAlign("left").run()}
                    className={editor!.isActive({ textAlign: "left" }) ? "is-active" : ""}
                >
                    <FaAlignLeft />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().setTextAlign("center").run()}
                    className={editor!.isActive({ textAlign: "center" }) ? "is-active" : ""}
                >
                    <FaAlignCenter />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().setTextAlign("right").run()}
                    className={editor!.isActive({ textAlign: "right" }) ? "is-active" : ""}
                >
                    <FaAlignRight />
                </button>
                <button
                    type="button"
                    onClick={() => editor!.chain().focus().setTextAlign("justify").run()}
                    className={editor!.isActive({ textAlign: "justify" }) ? "is-active" : ""}
                >
                    <FaAlignJustify />
                </button>
            </div>
        </div>
    );
};

export default Tiptap;
