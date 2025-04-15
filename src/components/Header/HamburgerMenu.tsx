"use client";

import { useState } from "react";

import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Button } from "../ui/button";
import HeaderLink from "./HeaderLink";

export default function HamburgerMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const targetElement = event.target as HTMLElement;
        if (!targetElement.closest(".wrapper")) {
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            <Button variant="ghost" className="hamburger-btn p-0" onClick={toggleMenu}>
                <RxHamburgerMenu />
            </Button>
            {isMenuOpen && (
                <div className="hamburger-menu" onClick={handleMenuClick}>
                    <div className="wrapper">
                        <HeaderLink href="/">Home</HeaderLink>
                        <HeaderLink href="/stats">Statistics</HeaderLink>
                        <HeaderLink href="/litepaper">Litepaper</HeaderLink>
                        <a href="https://blog.learnprotocol.io" target="_blank">
                            Blog
                            <FaExternalLinkAlt />
                        </a>
                    </div>
                    <IoClose className="close" onClick={toggleMenu} />
                </div>
            )}
        </>
    );
}
