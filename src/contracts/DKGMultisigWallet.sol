// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ZoKratesVerifier.sol";

contract DKGMultisigWallet {
    struct Participant {
        address addr;
        bool isActive;
    }

    mapping(address => Participant) public participants;
    address[] public participantList;
    bytes32 public groupPublicKey;
    uint256 public threshold;
    uint256 public round;
    ZoKratesVerifier public verifier;

    event ParticipantAdded(address participant);
    event KeyGenerated(bytes32 publicKey);
    event ProofSubmitted(address participant);

    constructor(uint256 _threshold, address _verifierAddress) {
        threshold = _threshold;
        round = 0;
        verifier = ZoKratesVerifier(_verifierAddress);
    }

    function addParticipant(address participant) public {
        require(round == 0, "Key generation has already started");
        require(!participants[participant].isActive, "Participant already exists");
        
        participants[participant] = Participant(participant, true);
        participantList.push(participant);
        emit ParticipantAdded(participant);
    }

    function submitProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c) public {
        require(participants[msg.sender].isActive, "Not a registered participant");
        require(verifier.verifyTx(a, b, c, []), "ZKP verification failed");
        emit ProofSubmitted(msg.sender);
    }

    function generateKey() public {
        require(round == 0, "Key generation already started");
        require(participantList.length >= threshold, "Not enough participants");
        round = 1;
        // In a real implementation, we would combine the proofs here
        groupPublicKey = keccak256(abi.encodePacked(block.timestamp, participantList.length));
        emit KeyGenerated(groupPublicKey);
    }

    function getParticipants() public view returns (address[] memory) {
        return participantList;
    }

    function getParticipantCount() public view returns (uint256) {
        return participantList.length;
    }

    function getRound() public view returns (uint256) {
        return round;
    }
}
