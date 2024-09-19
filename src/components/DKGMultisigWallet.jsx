import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DKGMultisigWalletABI from '../contracts/DKGMultisigWallet.json';
import WalletConnection from './WalletConnection';
import ParticipantList from './ParticipantList';
import BenchmarkDisplay from './BenchmarkDisplay';

const DKGMultisigWallet = () => {
  const [participants, setParticipants] = useState([]);
  const [participantAddress, setParticipantAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [feedback, setFeedback] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [benchmarks, setBenchmarks] = useState({ gas: 0, proofTime: 0, memory: 0 });
  const [networkName, setNetworkName] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
          setNetworkName(network.name);
        } catch (error) {
          console.error("Failed to get network information:", error);
        }
      }
    };

    initializeEthers();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);

        const network = await provider.getNetwork();
        setNetworkName(network.name);

        const contractAddress = "0x1234567890123456789012345678901234567890"; // Replace with your actual deployed contract address
        const contractInstance = new ethers.Contract(contractAddress, DKGMultisigWalletABI.abi, signer);
        setContract(contractInstance);

        setIsConnected(true);
        setFeedback("Wallet connected successfully!");

        setupEventListeners(contractInstance);
      } catch (error) {
        console.error("Failed to connect to Ethereum:", error);
        setFeedback(`Failed to connect to Ethereum: ${error.message}. Make sure you have MetaMask installed and connected to the Sepolia testnet.`);
      }
    } else {
      setFeedback("Please install MetaMask to interact with this dApp.");
    }
  };

  const setupEventListeners = (contractInstance) => {
    contractInstance.on("ParticipantAdded", (participant) => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      setFeedback(`Participant ${participant} added successfully!`);
    });

    contractInstance.on("KeyGenerated", (generatedKey) => {
      setPublicKey(generatedKey);
      setFeedback('Key generated successfully!');
    });
  };

  const addParticipant = async () => {
    if (!isConnected) {
      setFeedback("Please connect your wallet first.");
      return;
    }

    if (participantAddress.trim() === '') {
      setFeedback("Please enter a valid address");
      return;
    }

    try {
      setFeedback("Initiating transaction... Please check your wallet for confirmation.");
      const tx = await contract.addParticipant(participantAddress);
      setFeedback("Transaction sent. Waiting for confirmation...");
      
      const receipt = await tx.wait();
      setParticipantAddress('');
      setFeedback("Participant added successfully!");
    } catch (error) {
      console.error("Error adding participant:", error);
      setFeedback(`Error: ${error.message}. Make sure your wallet is connected and you have enough ETH for gas.`);
    }
  };

  const startKeyGeneration = async () => {
    if (!isConnected) {
      setFeedback("Please connect your wallet first.");
      return;
    }

    try {
      setFeedback("Initiating key generation... Please check your wallet for confirmation.");
      const startTime = performance.now();
      const startMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      const tx = await contract.generateKey();
      setFeedback("Key generation transaction sent. Waiting for confirmation...");
      
      const receipt = await tx.wait();
      const endTime = performance.now();
      const endMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      setBenchmarks({
        gas: receipt.gasUsed.toString(),
        proofTime: (endTime - startTime).toFixed(2),
        memory: ((endMemory - startMemory) / (1024 * 1024)).toFixed(2)
      });

      setFeedback("Key generation completed successfully!");
    } catch (error) {
      console.error("Error starting key generation:", error);
      setFeedback(`Error: ${error.message}. Make sure your wallet is connected and you have enough ETH for gas.`);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <CardHeader>
        <CardTitle>zk-SNARKs DKG Multisig Wallet (Sepolia Testnet)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <WalletConnection networkName={networkName} isConnected={isConnected} onConnect={connectWallet} />
          <div>
            <Label htmlFor="participant-address">Participant Address</Label>
            <Input
              id="participant-address"
              value={participantAddress}
              onChange={(e) => setParticipantAddress(e.target.value)}
              placeholder="Enter Ethereum address"
              className="bg-transparent border-[#B5FF81] text-[#B5FF81]"
            />
          </div>
          <Button onClick={addParticipant} className="bg-transparent border border-[#B5FF81] text-[#B5FF81] hover:bg-[#B5FF81] hover:text-black">Add Participant</Button>
          <Button onClick={startKeyGeneration} className="bg-transparent border border-[#B5FF81] text-[#B5FF81] hover:bg-[#B5FF81] hover:text-black">Start Key Generation</Button>
          <ParticipantList participants={participants} />
          {publicKey && (
            <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
              <AlertTitle>Generated Public Key</AlertTitle>
              <AlertDescription>{publicKey}</AlertDescription>
            </Alert>
          )}
          <BenchmarkDisplay benchmarks={benchmarks} />
          <Alert variant={feedback.includes('Error') ? 'destructive' : 'default'} className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{feedback}</AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default DKGMultisigWallet;
