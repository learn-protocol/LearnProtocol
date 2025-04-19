"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FaMagnifyingGlass } from "react-icons/fa6";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import "./search.scss";

const placeholders = [
    "How to Fix Next.js 15 Dynamic Route Prerender Error",
    "How to Deploy a Smart Contract on EDU Chain",
    'What is the Difference Between "private" and "internal" in Solidity?',
];

export default function Search({ className }: { className?: string }) {
    const router = useRouter();

    const [search, setSearch] = useState<string>("");
    const [placeholder, setPlaceholder] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const currentWord = placeholders[currentWordIndex];
        const typingDelay = 30;
        const deletionDelay = 20;
        const pauseDelay = 1400;

        const timer = setTimeout(
            () => {
                if (!isDeleting && !isPaused && placeholder !== currentWord) {
                    setPlaceholder(currentWord.slice(0, placeholder.length + 1));
                } else if (isDeleting && !isPaused && placeholder !== "") {
                    setPlaceholder(placeholder.slice(0, -1));
                } else if (placeholder === currentWord && !isPaused) {
                    setIsPaused(true);
                    setTimeout(() => {
                        setIsPaused(false);
                        setIsDeleting(true);
                    }, pauseDelay);
                } else if (placeholder === "" && isDeleting) {
                    setIsDeleting(false);
                    setCurrentWordIndex(prevIndex => (prevIndex + 1) % placeholders.length);
                }
            },
            isDeleting ? deletionDelay : typingDelay,
        );

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placeholder, currentWordIndex, isDeleting, isPaused, placeholders]);

    function handleSearch() {
        if (!search) return;
        const query = encodeURIComponent(search.trim()).replaceAll(/%20/g, "+");
        router.push(`/search/${query}`);
    }

    return (
        <div className="search-container">
            <Input
                placeholder={placeholder}
                className={`placeholder:opacity-50 ${className}`}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
                onChange={e => setSearch(e.target.value)}
            />
            <Button variant="outline" onClick={handleSearch}>
                <FaMagnifyingGlass className="search-icon" />
            </Button>
        </div>
    );
}
