// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.28;

interface IVotes {
    function vote() external;
    function updateVoteThreshold(uint16 _voteThreshold) external;
}

abstract contract Votes is IVotes {
    uint32 public votes;

    /**
     * @notice Smallest chunk of votes that can be added to the total votes
     */
    uint16 public voteThreshold = 500;

    function vote() external virtual {
        votes += voteThreshold;
    }

    function updateVoteThreshold(uint16 _voteThreshold) external virtual {
        require(_voteThreshold > 0, "Vote threshold must be greater than zero");
        require(_voteThreshold != voteThreshold, "Vote threshold is already set to this value");

        voteThreshold = _voteThreshold;
    }
}