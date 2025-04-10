import { ethers } from "ethers";

import { ARBITRUM_PROVIDER } from "../web3";

export const getContract = (
    address: string,
    abi: any,
    provider: ethers.JsonRpcProvider = ARBITRUM_PROVIDER,
) => {
    const contract = new ethers.Contract(address, abi, provider);
    return contract;
};
