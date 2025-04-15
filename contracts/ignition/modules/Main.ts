import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { Wallet } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const MainModule = buildModule("LearnProtocol", m => {
    const AUTHORIZED_WALLET = new Wallet(process.env.PRIVATE_KEY!).address;
    const main = m.contract("LearnProtocol", [AUTHORIZED_WALLET]);
    return { main };
});

export default MainModule;
