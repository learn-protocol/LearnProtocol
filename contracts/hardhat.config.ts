import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    paths: {
        sources: "./contracts",
    },
    networks: {
        arbitrum_testnet: {
            url: "https://sepolia-rollup.arbitrum.io/rpc",
            accounts: [process.env.PRIVATE_KEY!],
            chainId: 421614,
        },
        "edu-chain-testnet": {
            url: `https://rpc.open-campus-codex.gelato.digital`,
            accounts: [process.env.PRIVATE_KEY!],
            chainId: 656476,
        },
    },
    etherscan: {
        apiKey: {
            "edu-chain-testnet": process.env.ETHERSCAN_API_KEY!,
        },
        customChains: [
            {
                network: "edu-chain-testnet",
                chainId: 656476,
                urls: {
                    apiURL: "https://edu-chain-testnet.blockscout.com/api",
                    browserURL: "https://edu-chain-testnet.blockscout.com",
                },
            },
        ],
    },
};

export default config;
