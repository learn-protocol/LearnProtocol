import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenModule = buildModule("TokenModule", m => {
    const token = m.contract("LPToken", [5_000_000]);
    return { token };
});

export default TokenModule;
