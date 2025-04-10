import { ethers } from "ethers";

export const ARBITRUM_RPC_URL = `https://arbitrum-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
export const ARBITRUM_PROVIDER = new ethers.JsonRpcProvider(ARBITRUM_RPC_URL);

export const ETHEREUM_RPC_URL = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
export const ETHEREUM_PROVIDER = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);

export const EDU_RPC_URL = `https://rpc.open-campus-codex.gelato.digital`;
export const EDU_PROVIDER = new ethers.JsonRpcProvider(EDU_RPC_URL);

export const EDU_ERC20_CONTRACT_ADDRESS = "0xf8173a39c56a554837C4C7f104153A005D284D11";
