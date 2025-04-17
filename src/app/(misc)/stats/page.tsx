import Logo from "@/components/Logo";
import { TotalVotes } from "@/actions/stats/TotalVotes";
import { TotalUsers } from "@/actions/stats/TotalUsers";

import { IoMdPerson } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

import "./stats.scss";

export default async function Stats() {
    const voteStats = await TotalVotes();
    const userStats = await TotalUsers();
    const progress = (voteStats.upvotes / 100_000) * 100;

    return (
        <main className="grid">
            <div id="stats" className="max-[1150px]:pt-16">
                <h1>Statistics</h1>
                <div className="flex items-start gap-4 max-sm:flex-col">
                    <div className="box">
                        <h2>Distributed Prize</h2>
                        <p className="value">
                            <Logo size={36} />
                            {voteStats.distributedUpvotePrize}
                        </p>
                        <p>$LP tokens distributed</p>
                    </div>
                    <div className="box">
                        <h2>Cutoff Amount</h2>
                        <p className="value">
                            <Logo size={36} />
                            {voteStats.distributedDownvoteCutoff}
                        </p>
                        <p>$LP tokens reduced from user balance</p>
                    </div>
                </div>
                <div className="box total upvotes">
                    <h2>Upvotes</h2>
                    <p className="value">
                        {voteStats.upvotes}
                        <FaChevronUp size={18} color="rgb(17, 167, 62)" />
                    </p>
                    <p>
                        In <span>{voteStats.answers}</span> answers
                    </p>
                </div>
                <div className="box total downvotes">
                    <h2>Downvotes</h2>
                    <p className="value">
                        {voteStats.upvotes}
                        <FaChevronDown size={18} color="rgb(201, 8, 8)" />
                    </p>
                </div>
                <div className="flex items-start gap-4 max-sm:flex-col">
                    <div className="box prize-amount">
                        <h2>Upvote Prize Amount</h2>
                        <p className="value">
                            <Logo size={36} />
                            {voteStats.upvotePrize}
                        </p>
                    </div>
                    <div className="box prize-amount">
                        <h2>Downvote Cutoff Amount</h2>
                        <p className="value">
                            <Logo size={36} />-{voteStats.downvoteCutoff}
                        </p>
                    </div>
                </div>
                <div className="box halving">
                    <p>Until prize halving ({progress.toFixed(3)}%)</p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="flex items-start gap-4 max-sm:flex-col">
                    <div className="box">
                        <h2>Users</h2>
                        <p className="value">
                            <IoMdPerson size={36} color="#2f4ce7" />
                            {userStats.totalUsers}
                        </p>
                        <p>Connected their OCID</p>
                    </div>
                    <div className="box">
                        <h2>Verified Users</h2>
                        <p className="value">
                            <IoMdPerson size={36} color="#2f4ce7" />
                            {userStats.verifiedUsers}
                        </p>
                        <p>Deposited 1 $EDU</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
