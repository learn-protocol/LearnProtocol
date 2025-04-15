import "server-only";
import { ethers, Wallet as EthersWallet } from "ethers";

import { EDU_PROVIDER } from "./web3";

// mport { getContract } from "./contracts/contract";
// mport { EDU_ERC20_CONTRACT_ADDRESS, ETHEREUM_PROVIDER } from "./web3";

interface IWallet {
    create(): { address: string; privateKey: string };
    getEduBalance(wallet: string): Promise<number>;
}

const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
];

export default class Wallet implements IWallet {
    create() {
        const wallet = EthersWallet.createRandom();

        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
        };
    }

    /*
    async getEduBalance(wallet: string): Promise<number> {
        const contract = getContract(
            EDU_ERC20_CONTRACT_ADDRESS,
            erc20Abi,
            ETHEREUM_PROVIDER,
        );

        const balance = await contract.balanceOf(wallet);
        const decimals = await contract.decimals();

        const formatted = ethers.formatUnits(balance, decimals);
        return parseFloat(formatted);
    }
    */

    async getEduBalance(wallet: string): Promise<number> {
        const balance = await EDU_PROVIDER.getBalance(wallet);
        const formatted = ethers.formatEther(balance);
        return parseFloat(formatted);
    }
}
