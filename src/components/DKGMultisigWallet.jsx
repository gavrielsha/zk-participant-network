import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import the ABI of your deployed contract
import DKGMultisigWalletABI from '../contracts/DKGMultisigWallet.json';

const DKGMultisigWallet = () => {
  const [participants, setParticipants] = useState([]);
  const [participantAddress, setParticipantAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gasUsed, setGasUsed] = useState(0);
  const [proofTime, setProofTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
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

          // Replace with your deployed contract address
          const contractAddress = "YOUR_CONTRACT_ADDRESS";
          const contractInstance = new ethers.Contract(contractAddress, DKGMultisigWalletABI.abi, signer);
          setContract(contractInstance);

          // Listen for events
          contractInstance.on("ParticipantAdded", (participant) => {
            setParticipants(prevParticipants => [...prevParticipants, participant]);
            setFeedback(`Participant ${participant} added successfully!`);
          });

          contractInstance.on("KeyGenerated", (generatedKey) => {
            setPublicKey(generatedKey);
            setFeedback('Key generated successfully!');
          });
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
      setFeedback('Please connect to Ethereum first.');
      return;
    }

    if (participantAddress.trim() === '') {
      setFeedback('Please enter a valid address');
      return;
    }

    try {
      const tx = await contract.addParticipant(participantAddress);
      setFeedback('Adding participant... Please wait for transaction confirmation.');
      
      const receipt = await tx.wait();
      
      setGasUsed(receipt.gasUsed.toString());
      // Note: Actual proof time and memory usage would require additional instrumentation
      // These are placeholders and should be replaced with actual measurements
      setProofTime(Math.random() * 10); // Replace with actual proof time measurement
      setMemoryUsage(Math.floor(Math.random() * 500) + 100); // Replace with actual memory usage measurement
      
      setParticipantAddress('');
    } catch (error) {
      console.error("Error adding participant:", error);
      setFeedback(`Error: ${error.message}`);
    }
  };

  const generateKey = async () => {
    if (!contract || !signer) {
      setFeedback('Please connect to Ethereum first.');
      return;
    }

    try {
      const tx = await contract.generateKey();
      setFeedback('Generating key... Please wait for transaction confirmation.');
      
      const receipt = await tx.wait();
      
      setGasUsed(receipt.gasUsed.toString());
      // Note: Actual proof time and memory usage would require additional instrumentation
      // These are placeholders and should be replaced with actual measurements
      setProofTime(Math.random() * 10); // Replace with actual proof time measurement
      setMemoryUsage(Math.floor(Math.random() * 500) + 100); // Replace with actual memory usage measurement
    } catch (error) {
      console.error("Error generating key:", error);
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
          <Button onClick={generateKey}>Generate Key</Button>
          <Alert>
            <AlertTitle>Participants</AlertTitle>
            <AlertDescription>
              {participants.map((p, index) => (
                <div key={index}>{p}</div>
              ))}
            </AlertDescription>
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
              <p>Proof Time: {proofTime.toFixed(2)} seconds</p>
              <p>Memory Usage: {memoryUsage} MB</p>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default DKGMultisigWallet;
