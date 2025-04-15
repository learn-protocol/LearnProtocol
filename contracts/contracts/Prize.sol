// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.28;

interface IPrize {
    function halve() external;
}

abstract contract Prize is IPrize {
    uint32 public upvotePrize = 10**9;
    uint32 public downvoteCutoff = 10**8;
    uint32 public halvingThreshold = 100_000; // 100k votes

    function halve() external virtual {
        upvotePrize = upvotePrize / 2;
        downvoteCutoff = downvoteCutoff / 2;
    }
}