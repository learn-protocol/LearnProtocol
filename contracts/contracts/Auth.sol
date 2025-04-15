// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

abstract contract Auth {
    address public authorizedWallet;

    constructor(address _authorizedWallet) {
        if (_authorizedWallet != address(0)) {
            authorizedWallet = _authorizedWallet;
        }
    }

    modifier onlyAuthorized() {
        require(msg.sender == authorizedWallet, "Not authorized");
        _;
    }
}