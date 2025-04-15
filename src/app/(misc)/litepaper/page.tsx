import Link from "next/link";
import type { Metadata } from "next";

import "./litepaper.scss";
import Tiptap from "@/components/Editor";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Litepaper - Learn Protocol",
    description: "Litepaper of Learn Protocol",
};

export default function Litepaper() {
    return (
        <main className="grid">
            <div id="litepaper">
                <h1>Learn Protocol - Litepaper</h1>
                <div className="table-of-contents">
                    <ol>
                        <li>
                            <Link href="#introduction">Introduction</Link>
                            <ul>
                                <li>
                                    1.1. <Link href="#what-is-learn-protocol">What is Learn Protocol?</Link>
                                </li>
                                <li>
                                    1.2. <Link href="#how-it-works">How it works?</Link>
                                </li>
                                <li>
                                    1.3. <Link href="#how-to-withdraw">How to withdraw?</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link href="#economy">Economy</Link>
                            <ul>
                                <li>
                                    2.1. <Link href="#prize-distribution">Prize Distribution</Link>
                                </li>
                                <li>
                                    2.2. <Link href="#tokenomics">Tokenomics</Link>
                                </li>
                                <li>
                                    2.3. <Link href="#mainnet-launch">Mainnet Launch</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link href="#contracts">Contracts</Link>
                        </li>
                        <li>
                            <Link href="#rules">Rules</Link>
                        </li>
                    </ol>
                </div>
                <section id="introduction">
                    <h2>Introduction</h2>
                    <p>
                        Welcome to Learn Protocol. This litepaper is a brief overview of the Learn Protocol,
                        it contains everything you need to know about the protocol.
                    </p>
                    <h3 id="what-is-learn-protocol">What is Learn Protocol?</h3>
                    <p>
                        Learn Protocol is a platform that rewards users for teaching. Users can earn{" "}
                        <span>$LP</span> tokens by helping others learn. The protocol is built on the{" "}
                        <span>EDU Chain</span> and uses a custom ERC-20 token as its native currency. Our
                        greatest mission is to motivate people to teach what they know by rewarding them.
                    </p>
                    <h3 id="how-it-works">How it works?</h3>
                    <p>
                        In Learn Protocol, users ask and answer questions, just like any other Q&A platform.
                        For every upvote your answer gets, you earn <span>$LP</span> tokens. The more upvotes
                        you get, the more <span>$LP</span> tokens you earn. On the contrary, if your answer
                        gets downvoted, you lose <span>$LP</span> tokens. The amount of <span>$LP</span>{" "}
                        tokens you earn or lose is determined by the smart contract.
                    </p>
                    <p>
                        To gain more upvotes, you should detail your answers and provide more information. The
                        more information you provide, the more likely you are to get upvotes.
                    </p>
                    <h3 id="how-to-withdraw">How to withdraw?</h3>
                    <p>
                        Before you withdraw your earned <span>$LP</span> tokens, you need to complete 2 steps:
                    </p>
                    <ol>
                        <li>
                            Verify your account. In order to claim your <span>$LP</span> tokens you must
                            verify your Learn Protocol account. For that, you need to transfer 1 EDU coin to
                            treasury wallet.
                        </li>
                        <li>
                            Get at least 50 upvotes. Answer some questions and gain upvotes from other users.
                            You need minimum 50 upvotes to activate <span>$LP</span> withdraws.
                        </li>
                    </ol>
                    <p>
                        After you complete these steps, you can withdraw your <span>$LP</span> tokens. You can
                        withdraw your <span>$LP</span> tokens to any wallet that supports ERC-20 tokens.
                    </p>
                </section>
                <section id="economy">
                    <h2>Economy</h2>
                    <h3>Prize Distribution</h3>
                    <p>
                        The initial halving threshold is 100,000 <span>$LP</span> tokens, and the initial
                        upvote prize is 1 <span>$LP</span> token per upvote. That means, until the total
                        upvote amount reaches the 100,000 each upvote worths single <span>$LP</span> token. We
                        can calculate prize pool with these variables.
                    </p>
                    <Tiptap value="$\\\sum_{i=0}^{\infty} \frac{100000}{2^i}=200000$" readOnly heightFit />
                    <p>
                        The prize pool is calculated with the formula above. That means, the total prize pool
                        is 200,000 <span>$LP</span> tokens. The upvote prize is halved every 100,000 upvotes.
                    </p>
                    <h3>Tokenomics</h3>
                    <p>
                        The total supply of <span>$LP</span> tokens is 5,000,000. All of the tokens are minted
                        at the beginning. 200,000 of them are reserved for the prize pool.
                    </p>
                    <Image src="/tokenomics.png" alt="Tokenomics" height={768} width={1024} quality={100} />
                    <p>Funds for each category are distributed as follows:</p>
                    <ul>
                        <li>
                            65% for <span>Liquidity</span> (3,250,000 $LP)
                        </li>
                        <li>
                            10% for <span>Reserve Fund</span> (500,000 $LP)
                        </li>
                        <li>
                            10% for <span>Marketing</span> (500,000 $LP)
                        </li>
                        <li>
                            7% for <span>Team</span> (350,000 $LP)
                        </li>
                        <li>
                            4% for <span>Rewards</span> (200,000 $LP)
                        </li>
                        <li>
                            4% for <span>ICO</span> (200,000 $LP)
                        </li>
                    </ul>
                    <h3>Mainnet Launch</h3>
                    <p>
                        Currently, Learn Protocol runs on the testnet. <span>$LP</span> token is deployed on{" "}
                        <span>Edu Chain Testnet</span> network. Also, <span>EDU</span> token deposits are made
                        on <span>Open Campus Codex Sepolia</span> network.
                    </p>
                    <p>
                        Before the mainnet launch, we have a roadmap ahead. We will launch the mainnet on{" "}
                        <span>EDU Chain</span> after the testnet is fully tested. The mainnet launch will be
                        announced on our official channels. Our first priority is to make the platform
                        completely safe and secure for everyone. Then Learn Protocol needs to be funded in
                        order to provide liquidity for the token. We will use the funds from the ICO and
                        accelerator programs to provide liquidity for the <span>$LP</span> token.
                    </p>
                </section>
                <section id="contracts">
                    <h2>Contracts</h2>
                    <p>Learn Protocol has 2 main contracts:</p>
                    <ul>
                        <li>ERC20 Token Contract</li>
                        <li>Utility Contract</li>
                    </ul>
                    <p>
                        As the name suggests, the ERC-20 token contract is a standard contract that implements
                        the ERC-20 token standard.
                    </p>
                    <p>
                        The utility contract on the other hand, is a custom contract that implements the logic
                        of the Learn Protocol. It inherits 2 contracts: <span>Votes</span> and{" "}
                        <span>Prize</span>
                    </p>
                    <p>
                        Votes abstract contract is used to implement the voting system of the Learn Protocol.
                        It keeps track of the total votes and voting threshold. Voting threshold is the
                        minimum number of votes required before saving new votes to the contract.
                    </p>
                    <p>
                        Prize abstract contract holds single upvote prize, and downvote cutoff amounts. It
                        also implements the logic of halving the upvote prize every <span>n</span> upvotes.
                        That <span>n</span> value is determined by a halving threshold value. When total
                        upvotes reach the halving threshold, the upvote prize and downvote cutoff amount is
                        halved.
                    </p>
                </section>
                <section id="rules">
                    <h2>Rules</h2>
                    <p>
                        To keep the platform safe for everyone, we have several rules. Note that it is
                        everyone&#39;s right to learn new things on this platform. Therefore, we do not allow
                        any kind of discrimination, hate speech, or harassment. We also do not allow any kind
                        of activity that harms the platform and users. If you encounter one of these harmful
                        activities, please report the content.
                    </p>
                    <p>
                        If you go against the rules, your account may get banned <span>permanently</span>.
                        Here is a list of rules:
                    </p>
                    <ul>
                        <li>
                            Do not copy & paste answers from AI tools. You can use AI tools to enhance your
                            answer, or to organize your thoughts. However, we do not allow low-effort answers.
                        </li>
                        <li>
                            Do not advertise. You can use external links in your questions and answers but do
                            not use them for advertising. Learn Protocol is an ad-free platform that only
                            focuses on education.
                        </li>
                        <li>
                            Do not share illegal content. We do not allow any kind of illegal content on the
                            platform. This includes but is not limited to: drugs, weapons, and illegal
                            activities. You can ask whatever you want outside of these topics.
                        </li>
                    </ul>
                </section>
            </div>
        </main>
    );
}
