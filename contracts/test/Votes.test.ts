import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { beforeAll, describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";

import VotesABI from "../abi/Votes";

dotenv.config();

// const provider = new JsonRpcProvider(
//     `https://arbitrum-sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
// );
const provider = new JsonRpcProvider(`https://rpc.open-campus-codex.gelato.digital`);
const signer = new Wallet(process.env.PRIVATE_KEY as string, provider);

describe("Votes contract", () => {
    const contractAddress = "0x893318bBeEB5C2d36261a110414C96E1554BAF04";
    const contract = new Contract(contractAddress, VotesABI, signer);

    let totalVotes: bigint;
    let nonce: number;

    beforeAll(async () => {
        const [_totalVotes, _nonce] = await Promise.all([
            contract.votes(),
            provider.getTransactionCount(signer, "latest"),
        ]);

        totalVotes = _totalVotes;
        nonce = _nonce;
    });

    test("Get total vote amount", async () => {
        expect(totalVotes).toBeGreaterThanOrEqual(0);
    });

    test("Get vote threshold", async () => {
        const threshold = await contract.voteThreshold();
        expect(threshold).toBe(500n);
    });

    test("Add vote", async () => {
        await contract.vote();
        const newVoteAmount = await contract.votes();
        expect(newVoteAmount).toBe(totalVotes + 500n);
    });
});
