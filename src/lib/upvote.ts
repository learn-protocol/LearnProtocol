import "server-only";

interface IUpvote {
    upvotePrize: number;
    downvoteCutoff: number;
    updateVotePrizes(): Promise<void>;
}

export default class Upvote implements IUpvote {
    public upvotePrize = 1;
    public downvoteCutoff = 0.1;

    constructor() {
        this.getVotePrizes();
    }

    async getVotePrizes(): Promise<{ upvotePrize: number; downvoteCutoff: number }> {
        return {
            upvotePrize: 1,
            downvoteCutoff: 0.1,
        };
    }

    async updateVotePrizes(): Promise<void> {}
}
