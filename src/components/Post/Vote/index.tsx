"use client";

import { toast } from "sonner";

import { FaAngleDown, FaCheck } from "react-icons/fa6";

import { useUserStore } from "@/lib/states";
import { AcceptAnswer } from "@/actions/posts/Accept";
import { Vote as VoteAction } from "@/actions/posts/Vote";

import "./vote.scss";

export default function Vote({
    id,
    votes,
    postAuthor,
    answerAuthor,
    voters = [],
    isAccepted = false,
}: {
    id: number;
    votes: number;
    postAuthor: string;
    answerAuthor: string;
    voters?: { user: string; isUpvote: boolean }[];
    isAccepted: boolean;
}) {
    const user = useUserStore(s => s.user);
    const isPostOwner = user?.ocid === postAuthor;
    const isAnswerOwner = user?.ocid === answerAuthor;
    const isVoted = voters.map(v => v.user).includes(user?.ocid || "");

    const voteEvent = (voteType: 1 | -1) => {
        if (!user) {
            toast.error("You must be logged in to vote.");
            return;
        }
        if (isVoted) {
            toast.error("You have already voted.");
            return;
        }
        if (isAnswerOwner) {
            toast.error("You cannot vote on your own post.");
            return;
        }

        VoteAction({
            answerID: id,
            voteType,
        })
            .then(res => {
                if (res?.errors) {
                    toast.error(Object.values(res.errors)[0]);
                }
            })
            .catch(err => {
                toast.error("An error occurred while processing your vote.");
            });
    };

    const acceptAnswer = () => {
        if (!user) {
            toast.error("You must be logged in to accept an answer.");
            return;
        }

        if (isAccepted) {
            toast.error("This answer is already accepted.");
            return;
        }

        AcceptAnswer({
            answerID: id,
        })
            .then(res => {
                if (res === true) {
                    toast.success("Answer accepted successfully.");
                    return;
                }
                toast.error(Object.values((res as any as { errors: { answer: string } }).errors)[0]);
            })
            .catch(err => {
                toast.error("An error occurred while accepting the answer.");
            });
    };

    return (
        <div className="votes">
            {isAccepted ? (
                <div className="accepted">
                    <FaCheck color="rgb(17,167,62)" size={32} />
                </div>
            ) : (
                <>
                    {isPostOwner && (
                        <div className="accept-answer" onClick={acceptAnswer}>
                            <FaCheck color="#999" size={32} />
                        </div>
                    )}
                </>
            )}
            <div
                className={
                    "vote-btn upvote " +
                    (isVoted || isAnswerOwner ? "disabled " : " ") +
                    (isVoted && voters.filter(v => v.user === user?.ocid)[0].isUpvote ? "voted" : "")
                }
                onClick={() => voteEvent(1)}
            >
                <FaAngleDown style={{ transform: "rotateZ(180deg)" }} />
            </div>
            <p>{votes}</p>
            <div
                className={
                    "vote-btn downvote " +
                    ((isVoted || isAnswerOwner) ? "disabled " : " ") +
                    (isVoted && voters.filter(v => v.user === user?.ocid)[0].isUpvote === false
                        ? "voted"
                        : "")
                }
                onClick={() => voteEvent(-1)}
            >
                <FaAngleDown />
            </div>
        </div>
    );
}
