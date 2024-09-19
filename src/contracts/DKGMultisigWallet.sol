// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ZoKratesVerifier.sol";

contract DKGMultisigWallet {
    struct Participant {
        address addr;
        bytes32 commitment;
        bytes32 share;
    }

    Participant[] public participants;
    bytes32 public groupPublicKey;
    uint256 public threshold;
    uint256 public round;
    ZoKratesVerifier public verifier;

    event ParticipantAdded(address participant);
    event CommitmentSubmitted(address participant, bytes32 commitment);
    event ShareSubmitted(address participant, bytes32 share);
    event KeyGenerated(bytes32 publicKey);

    constructor(uint256 _threshold, address _verifierAddress) {
        threshold = _threshold;
        round = 0;
        verifier = ZoKratesVerifier(_verifierAddress);
    }

    function addParticipant(address participant) public {
        require(round == 0, "Key generation has already started");
        for (uint i = 0; i < participants.length; i++) {
            require(participants[i].addr != participant, "Participant already exists");
        }
        participants.push(Participant(participant, bytes32(0), bytes32(0)));
        emit ParticipantAdded(participant);
    }

    function submitCommitment(bytes32 commitment) public {
        require(round == 1, "Not in commitment phase");
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i].addr == msg.sender) {
                require(participants[i].commitment == bytes32(0), "Commitment already submitted");
                participants[i].commitment = commitment;
                emit CommitmentSubmitted(msg.sender, commitment);
                return;
            }
        }
        revert("Not a registered participant");
    }

    function submitShare(bytes32 share, uint[2] memory a, uint[2][2] memory b, uint[2] memory c) public {
        require(round == 2, "Not in share submission phase");
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i].addr == msg.sender) {
                require(participants[i].share == bytes32(0), "Share already submitted");
                require(verifier.verifyTx(a, b, c, [uint256(share)]), "ZKP verification failed");
                participants[i].share = share;
                emit ShareSubmitted(msg.sender, share);
                return;
            }
        }
        revert("Not a registered participant");
    }

    function generateKey() public {
        require(round == 0, "Key generation already started");
        require(participants.length >= threshold, "Not enough participants");
        round = 1;
    }

    function advanceRound() public {
        require(round < 3, "Key generation completed");
        for (uint i = 0; i < participants.length; i++) {
            if (round == 1 && participants[i].commitment == bytes32(0)) revert("Not all commitments submitted");
            if (round == 2 && participants[i].share == bytes32(0)) revert("Not all shares submitted");
        }
        round++;
        if (round == 3) {
            // In a real implementation, we would combine the shares here
            groupPublicKey = keccak256(abi.encodePacked(block.timestamp, participants.length));
            emit KeyGenerated(groupPublicKey);
        }
    }

    function getParticipants() public view returns (address[] memory) {
        address[] memory addrs = new address[](participants.length);
        for (uint i = 0; i < participants.length; i++) {
            addrs[i] = participants[i].addr;
        }
        return addrs;
    }

    function getRound() public view returns (uint256) {
        return round;
    }
}
