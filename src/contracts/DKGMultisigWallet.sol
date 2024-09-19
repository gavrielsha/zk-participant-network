// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DKGMultisigWallet {
    mapping(address => bool) public participants;
    address[] public participantList;
    uint256 public threshold;

    event ParticipantAdded(address participant);

    constructor(uint256 _threshold) {
        threshold = _threshold;
    }

    function addParticipant(address participant) public {
        require(!participants[participant], "Participant already exists");
        
        participants[participant] = true;
        participantList.push(participant);
        emit ParticipantAdded(participant);
    }

    function getParticipants() public view returns (address[] memory) {
        return participantList;
    }

    function getParticipantCount() public view returns (uint256) {
        return participantList.length;
    }
}
