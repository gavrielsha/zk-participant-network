import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DKGMultisigWalletABI from '../contracts/DKGMultisigWallet.json';
import ParticipantList from './ParticipantList';
import BenchmarkDisplay from './BenchmarkDisplay';

const DKGMultisigWallet = () => {
  const [participants, setParticipants] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [benchmarks, setBenchmarks] = useState({ gas: 0, proofTime: 0, memoryUsage: 0 });
  const [networkName, setNetworkName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState('');
  const [isParticipant, setIsParticipant] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);

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

        const address = await signer.getAddress();
        setConnectedAddress(address);

        setupEventListeners(contractInstance);
        await fetchParticipants(contractInstance);
        
        // Check if the user is already a participant
        const isAlreadyParticipant = participants.some(p => p.toLowerCase() === address.toLowerCase());
        if (!isAlreadyParticipant) {
          await addParticipant(contractInstance, address);
        } else {
          setIsParticipant(true);
          setFeedback("You are already a participant.");
        }
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
      fetchParticipants(contractInstance);
      if (participant.toLowerCase() === connectedAddress.toLowerCase()) {
        setIsParticipant(true);
        setFeedback("You have been added as a participant successfully!");
        setIsAddingParticipant(false);
      }
    });

    contractInstance.on("KeyGenerated", (generatedKey) => {
      setFeedback('Key generated successfully!');
    });
  };

  const fetchParticipants = async (contractInstance) => {
    try {
      const participantList = await contractInstance.getParticipants();
      setParticipants(participantList);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const addParticipant = async (contractInstance, address) => {
    try {
      setIsAddingParticipant(true);
      setFeedback("Adding you as a participant... Transaction sent.");
      const tx = await contractInstance.addParticipant(address);
      await tx.wait();
      setIsParticipant(true);
      setFeedback("You have been added as a participant successfully!");
    } catch (error) {
      console.error("Error adding participant:", error);
      setFeedback(`Error: ${error.message}. Make sure you have enough ETH for gas.`);
    } finally {
      setIsAddingParticipant(false);
    }
  };

  const startKeyGeneration = async () => {
    if (!isConnected) {
      setFeedback("Please connect your wallet first.");
      return;
    }

    if (!isParticipant) {
      setFeedback("Please wait until you're added as a participant.");
      return;
    }

    try {
      setFeedback("Initiating key generation...");
      const startTime = performance.now();
      const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      const tx = await contract.generateKey();
      const receipt = await tx.wait();

      const endTime = performance.now();
      const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      // Calculate memory usage, ensuring it's non-negative
      const memoryUsage = Math.max(0, endMemory - startMemory);

      setBenchmarks({
        gas: receipt.gasUsed.toString(),
        proofTime: endTime - startTime,
        memoryUsage: memoryUsage,
      });

      setFeedback("Key generation completed successfully!");
    } catch (error) {
      console.error("Error in key generation process:", error);
      setFeedback(`Error: ${error.message}. Key generation failed.`);
    }
  };

  return (
    <Card className="w-full max-w-4xl bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <CardHeader>
        <CardTitle>zk-SNARKs DKG Multisig Wallet (Sepolia Testnet)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-x-4">
            <Button onClick={connectWallet} disabled={isConnected} className="bg-[#B5FF81] text-[#0A0A0A] hover:bg-transparent hover:text-[#B5FF81] border border-[#B5FF81]">
              {isConnected ? `Connected to ${networkName}` : "Connect Wallet"}
            </Button>
            <Button onClick={startKeyGeneration} disabled={!isConnected || !isParticipant || isAddingParticipant} className="bg-[#B5FF81] text-[#0A0A0A] hover:bg-transparent hover:text-[#B5FF81] border border-[#B5FF81]">
              Start Key Generation
            </Button>
          </div>
          <ParticipantList participants={participants} connectedAddress={connectedAddress} />
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
