import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotesModule = buildModule("VotesModule", m => {
    const votes = m.contract("Votes", []);
    return { votes };
});

export default VotesModule;
