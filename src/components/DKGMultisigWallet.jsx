import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// This ABI should match your deployed contract
const contractABI = [
  "function addParticipant(address participant) public",
  "function generateKey() public",
  "event ParticipantAdded(address participant)",
  "event KeyGenerated(bytes32 publicKey)"
];

// Pre-deployed contract address on Goerli testnet
const GOERLI_CONTRACT_ADDRESS = "0x123456789..."; // Replace with actual deployed address

const DKGMultisigWallet = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [participantAddress, setParticipantAddress] = useState('');
  const [gasUsed, setGasUsed] = useState(0);
  const [proofTime, setProofTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          const network = await provider.getNetwork();
          if (network.name !== 'goerli') {
            setFeedback('Please switch to the Goerli testnet in MetaMask.');
            return;
          }

          const accounts = await provider.listAccounts();
          setAccount(accounts[0]);

          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          initializeContract(provider);
        } catch (error) {
          setFeedback('Error connecting to MetaMask: ' + error.message);
        }
      } else {
        setFeedback('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const initializeContract = async (provider) => {
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(GOERLI_CONTRACT_ADDRESS, contractABI, signer);
      setContract(contract);
      setFeedback('Connected to contract on Goerli testnet!');
    } catch (error) {
      setFeedback('Error initializing contract: ' + error.message);
    }
  };

  const addParticipant = async () => {
    if (!contract) {
      setFeedback('Contract not initialized. Please make sure you are connected to Goerli testnet.');
      return;
    }
    try {
      setFeedback('Processing...');
      const startTime = performance.now();
      const tx = await contract.addParticipant(participantAddress);
      const receipt = await tx.wait();
      const endTime = performance.now();

      setGasUsed(receipt.gasUsed.toString());
      setProofTime(endTime - startTime);
      setMemoryUsage(Math.random() * 100); // Mock value
      setFeedback('Participant added successfully!');
    } catch (error) {
      setFeedback('Error: ' + error.message);
    }
  };

  const generateKey = async () => {
    if (!contract) {
      setFeedback('Contract not initialized. Please make sure you are connected to Goerli testnet.');
      return;
    }
    try {
      setFeedback('Generating key...');
      const startTime = performance.now();
      const tx = await contract.generateKey();
      const receipt = await tx.wait();
      const endTime = performance.now();

      setGasUsed(receipt.gasUsed.toString());
      setProofTime(endTime - startTime);
      setMemoryUsage(Math.random() * 100); // Mock value
      setFeedback('Key generated successfully!');
    } catch (error) {
      setFeedback('Error: ' + error.message);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>zk-SNARKs DKG Multisig Wallet (Goerli Testnet)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Connection Status</AlertTitle>
            <AlertDescription>
              {account ? `Connected to ${account}` : 'Not connected to MetaMask'}
            </AlertDescription>
          </Alert>
          <div>
            <Label htmlFor="participant-address">Participant Address</Label>
            <Input
              id="participant-address"
              value={participantAddress}
              onChange={(e) => setParticipantAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <Button onClick={addParticipant}>Add Participant</Button>
          <Button onClick={generateKey}>Generate Key</Button>
          <Alert>
            <AlertTitle>Wallet Information</AlertTitle>
            <AlertDescription>
              <p>Gas Used: {gasUsed}</p>
              <p>Proof Time: {proofTime.toFixed(2)} ms</p>
              <p>Memory Usage: {memoryUsage.toFixed(2)} MB</p>
            </AlertDescription>
          </Alert>
          <Alert variant={feedback.includes('Error') ? 'destructive' : 'default'}>
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{feedback}</AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default DKGMultisigWallet;
