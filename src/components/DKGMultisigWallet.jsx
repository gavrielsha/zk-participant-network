import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock ABI for demonstration purposes
const contractABI = [
  "function addParticipant(address participant) public",
  "function generateKey() public",
  "event ParticipantAdded(address participant)",
  "event KeyGenerated(bytes32 publicKey)"
];

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
          const signer = provider.getSigner();
          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          
          setProvider(provider);
          setContract(contract);

          const accounts = await provider.listAccounts();
          setAccount(accounts[0]);

          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          setFeedback('Connected to MetaMask successfully!');
        } catch (error) {
          setFeedback('Error connecting to MetaMask: ' + error.message);
        }
      } else {
        setFeedback('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const addParticipant = async () => {
    if (!contract) {
      setFeedback('Contract not initialized. Please make sure you are connected to MetaMask.');
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
      // For memory usage, we'd typically need backend integration. This is a mock value.
      setMemoryUsage(Math.random() * 100);
      setFeedback('Participant added successfully!');
    } catch (error) {
      setFeedback('Error: ' + error.message);
    }
  };

  const generateKey = async () => {
    if (!contract) {
      setFeedback('Contract not initialized. Please make sure you are connected to MetaMask.');
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
      setMemoryUsage(Math.random() * 100);
      setFeedback('Key generated successfully!');
    } catch (error) {
      setFeedback('Error: ' + error.message);
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
              placeholder="0x..."
            />
          </div>
          <Button onClick={addParticipant}>Add Participant</Button>
          <Button onClick={generateKey}>Generate Key</Button>
          <Alert>
            <AlertTitle>Wallet Information</AlertTitle>
            <AlertDescription>
              <p>Connected Account: {account || 'Not connected'}</p>
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
