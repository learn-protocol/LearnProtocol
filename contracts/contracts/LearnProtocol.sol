// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.28;

import "./Auth.sol";
import "./Votes.sol";
import "./Prize.sol";

contract LearnProtocol is Auth, Votes, Prize {
    Votes private votesContract;
    Prize private prizeContract;

    constructor(address _authorizedWallet) Auth(_authorizedWallet) {}

    function vote() public override(Votes) onlyAuthorized {
        votesContract.vote();

        if (Votes.votes >= Prize.halvingThreshold) {
            prizeContract.halve();
        }
    }

    function updateVoteThreshold(uint16 _voteThreshold) public override(Votes) onlyAuthorized {
        votesContract.updateVoteThreshold(_voteThreshold);
    }

    /**
     * Manually halve the prize and downvote cutoff values.
     */
    function halve() public override(Prize) onlyAuthorized {
        prizeContract.halve();
    }
}