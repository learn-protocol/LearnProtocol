import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PrizeModule = buildModule("PrizeModule", m => {
    const prize = m.contract("Prize", []);
    return { prize };
});

export default PrizeModule;
