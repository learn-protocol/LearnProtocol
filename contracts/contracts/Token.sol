// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPToken is ERC20, Ownable {
    constructor(uint256 initialSupply) Ownable(msg.sender) ERC20("Learn Protocol", "LP") {
        _mint(msg.sender, initialSupply);
    }
}