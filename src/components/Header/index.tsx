import Link from "next/link";

import Logo from "../Logo";
import Profile from "./Profile";
import { Button } from "../ui/button";
import HeaderLink from "./HeaderLink";
import HamburgerMenu from "./HamburgerMenu";
import ConnectOCID from "../Auth/ConnectOCID";

import "./header.scss";

export default function Header() {
    return (
        <header>
            <div>
                <Link href="/" className="brand">
                    <Logo size={35} />
                    <h1>Learn Protocol</h1>
                </Link>
                <div className="links">
                    <HeaderLink href="/">Home</HeaderLink>
                    <HeaderLink href="/stats">Statistics</HeaderLink>
                    <HeaderLink href="/litepaper">Litepaper</HeaderLink>
                    <a href="https://blog.learnprotocol.io" target="_blank">
                        Blog
                    </a>
                </div>
                <div className="actions">
                    <Button variant="outline" asChild>
                        <Link href="/ask" className="ask-btn">
                            Ask a Question
                        </Link>
                    </Button>
                    <Profile />
                    <ConnectOCID />
                </div>
                <div className="hamburger">
                    <HamburgerMenu />
                </div>
            </div>
        </header>
    );
}
