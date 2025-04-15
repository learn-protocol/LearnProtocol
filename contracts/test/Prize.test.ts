import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";

import PrizeABI from "../abi/Prize";

dotenv.config();

// const provider = new JsonRpcProvider(
//     `https://arbitrum-sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
// );
const provider = new JsonRpcProvider(`https://rpc.open-campus-codex.gelato.digital`);
const signer = new Wallet(process.env.PRIVATE_KEY as string, provider);

describe("Prize contract", () => {
    const contractAddress = "0xb40dC94537902dFC398d617812AbeEb3eAE18DAf";
    const contract = new Contract(contractAddress, PrizeABI, signer);

    const _1e9 = 1000000000n;
    let upvotePrize: bigint, downvoteCutoff: bigint;

    test("Get vote prizes", async () => {
        upvotePrize = (await contract.upvotePrize()) / _1e9;
        downvoteCutoff = (await contract.downvoteCutoff()) / _1e9;

        expect(upvotePrize).toBeLessThanOrEqual(1);
        expect(downvoteCutoff).toBeLessThanOrEqual(0.1);
    });

    test("Halving", async () => {
        await contract.halve();

        const newUpvotePrize = (await contract.upvotePrize()) / _1e9;
        const newDownvoteCutoff = (await contract.downvoteCutoff()) / _1e9;

        expect(newUpvotePrize).toBe(upvotePrize / 2n);
        expect(newDownvoteCutoff).toBe(downvoteCutoff / 2n);
    });
});
