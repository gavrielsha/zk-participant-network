import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DKGMultisigWalletABI = [
  "function addParticipant(address participant) public",
  "function submitCommitment(bytes32 commitment) public",
  "function submitShare(bytes32 share) public",
  "function startKeyGeneration() public",
  "function advanceRound() public",
  "function getParticipants() public view returns (address[] memory)",
  "function getRound() public view returns (uint256)",
  "event ParticipantAdded(address participant)",
  "event CommitmentSubmitted(address participant, bytes32 commitment)",
  "event ShareSubmitted(address participant, bytes32 share)",
  "event KeyGenerated(bytes32 publicKey)"
];

const DKGMultisigWallet = () => {
  const [participants, setParticipants] = useState([]);
  const [participantAddress, setParticipantAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gasUsed, setGasUsed] = useState(0);
  const [round, setRound] = useState(0);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setSigner(signer);

          const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
          const contractInstance = new ethers.Contract(contractAddress, DKGMultisigWalletABI, signer);
          setContract(contractInstance);

          contractInstance.on("ParticipantAdded", (participant) => {
            setParticipants(prevParticipants => [...prevParticipants, participant]);
            setFeedback(`Participant ${participant} added successfully!`);
          });

          contractInstance.on("CommitmentSubmitted", (participant, commitment) => {
            setFeedback(`Commitment submitted by ${participant}`);
          });

          contractInstance.on("ShareSubmitted", (participant, share) => {
            setFeedback(`Share submitted by ${participant}`);
          });

          contractInstance.on("KeyGenerated", (generatedKey) => {
            setPublicKey(generatedKey);
            setFeedback('Key generated successfully!');
          });

          // Initial round fetch
          const currentRound = await contractInstance.getRound();
          setRound(currentRound.toNumber());
        } catch (error) {
          console.error("Failed to connect to Ethereum:", error);
          setFeedback("Failed to connect to Ethereum. Make sure you have MetaMask installed and connected to the correct network.");
        }
      } else {
        setFeedback("Please install MetaMask to interact with this dApp.");
      }
    };

    initializeEthers();

    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, []);

  const addParticipant = async () => {
    if (!contract || !signer) {
      setFeedback("Please connect to Ethereum first.");
      return;
    }

    if (participantAddress.trim() === '') {
      setFeedback("Please enter a valid address");
      return;
    }

    try {
      const tx = await contract.addParticipant(participantAddress);
      setFeedback("Adding participant... Please wait for transaction confirmation.");
      
      const receipt = await tx.wait();
      setGasUsed(receipt.gasUsed.toString());
      setParticipantAddress('');
    } catch (error) {
      console.error("Error adding participant:", error);
      setFeedback(`Error: ${error.message}`);
    }
  };

  const startKeyGeneration = async () => {
    if (!contract || !signer) {
      setFeedback("Please connect to Ethereum first.");
      return;
    }

    try {
      const tx = await contract.startKeyGeneration();
      setFeedback("Starting key generation... Please wait for transaction confirmation.");
      
      const receipt = await tx.wait();
      setGasUsed(receipt.gasUsed.toString());
      
      const currentRound = await contract.getRound();
      setRound(currentRound.toNumber());
    } catch (error) {
      console.error("Error starting key generation:", error);
      setFeedback(`Error: ${error.message}`);
    }
  };

  const submitCommitment = async () => {
    if (!contract || !signer) {
      setFeedback("Please connect to Ethereum first.");
      return;
    }

    try {
      // In a real implementation, this would be a cryptographic commitment
      const commitment = ethers.utils.randomBytes(32);
      const tx = await contract.submitCommitment(commitment);
      setFeedback("Submitting commitment... Please wait for transaction confirmation.");
      
      const receipt = await tx.wait();
      setGasUsed(receipt.gasUsed.toString());
    } catch (error) {
      console.error("Error submitting commitment:", error);
      setFeedback(`Error: ${error.message}`);
    }
  };

  const submitShare = async () => {
    if (!contract || !signer) {
      setFeedback("Please connect to Ethereum first.");
      return;
    }

    try {
      // In a real implementation, this would be a cryptographic share
      const share = ethers.utils.randomBytes(32);
      const tx = await contract.submitShare(share);
      setFeedback("Submitting share... Please wait for transaction confirmation.");
      
      const receipt = await tx.wait();
      setGasUsed(receipt.gasUsed.toString());
    } catch (error) {
      console.error("Error submitting share:", error);
      setFeedback(`Error: ${error.message}`);
    }
  };

  const advanceRound = async () => {
    if (!contract || !signer) {
      setFeedback("Please connect to Ethereum first.");
      return;
    }

    try {
      const tx = await contract.advanceRound();
      setFeedback("Advancing round... Please wait for transaction confirmation.");
      
      const receipt = await tx.wait();
      setGasUsed(receipt.gasUsed.toString());
      
      const currentRound = await contract.getRound();
      setRound(currentRound.toNumber());
    } catch (error) {
      console.error("Error advancing round:", error);
      setFeedback(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>zk-SNARKs DKG Multisig Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="participant-address">Participant Address</Label>
            <Input
              id="participant-address"
              value={participantAddress}
              onChange={(e) => setParticipantAddress(e.target.value)}
              placeholder="Enter Ethereum address"
            />
          </div>
          <Button onClick={addParticipant}>Add Participant</Button>
          <Button onClick={startKeyGeneration}>Start Key Generation</Button>
          <Button onClick={submitCommitment}>Submit Commitment</Button>
          <Button onClick={submitShare}>Submit Share</Button>
          <Button onClick={advanceRound}>Advance Round</Button>
          <Alert>
            <AlertTitle>Participants</AlertTitle>
            <AlertDescription>
              {participants.map((p, index) => (
                <div key={index}>{p}</div>
              ))}
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Current Round</AlertTitle>
            <AlertDescription>{round}</AlertDescription>
          </Alert>
          {publicKey && (
            <Alert>
              <AlertTitle>Generated Public Key</AlertTitle>
              <AlertDescription>{publicKey}</AlertDescription>
            </Alert>
          )}
          <Alert variant={feedback.includes('Error') ? 'destructive' : 'default'}>
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{feedback}</AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Performance Metrics</AlertTitle>
            <AlertDescription>
              <p>Gas Used: {gasUsed} units</p>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default DKGMultisigWallet;
