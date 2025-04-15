import "server-only";

export type ReturnError = {
    errors: {
        [key: string]: string | string[];
    };
};

export type UserDetails = {
    wallet: string;
    avatar: string | null;
};

export type Answer = {
    id: number;
    content: string;
    userId: string;
    upvotes: number;
    downvotes: number;
    isAccepted: boolean;
    createdAt: Date;
    voters?: { user: string; isUpvote: boolean }[];
};

export type PublicUserDetails = UserDetails & {
    ocid: string;
    accountAge: number; // in days
    balance: number;
    verified: boolean;
    answerCount: number;
    upvoteCount: number;
};
