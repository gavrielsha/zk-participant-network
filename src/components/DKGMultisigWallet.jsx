import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DKGMultisigWalletABI from '../contracts/DKGMultisigWallet.json';
import WalletConnection from './WalletConnection';
import ParticipantList from './ParticipantList';
import BenchmarkDisplay from './BenchmarkDisplay';
import NetworkStatus from './NetworkStatus';

const DKGMultisigWallet = () => {
  const [participants, setParticipants] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [benchmarks, setBenchmarks] = useState({ gas: 0, proofTime: 0, memoryUsage: 0 });
  const [networkName, setNetworkName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState('');

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

        const address = await signer.getAddress();
        setConnectedAddress(address);

        setupEventListeners(contractInstance);
        fetchParticipants(contractInstance);
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
      setFeedback(`Participant ${participant} added successfully!`);
      fetchParticipants(contractInstance);
    });

    contractInstance.on("KeyGenerated", (generatedKey) => {
      setFeedback('Key generated successfully!');
    });

    contractInstance.on("ProofSubmitted", (participant) => {
      setFeedback(`Proof submitted by ${participant} successfully!`);
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

  const addParticipant = async () => {
    if (!isConnected) {
      setFeedback("Please connect your wallet first.");
      return;
    }

    try {
      setFeedback("Adding you as a participant... Please check your wallet for confirmation.");
      const tx = await contract.addParticipant(connectedAddress);
      await tx.wait();
      setFeedback("Transaction sent. Waiting for confirmation...");
      // The ParticipantAdded event will trigger a refresh of the participant list
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
      setFeedback("Initiating off-chain key generation...");
      const startTime = performance.now();
      const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      // Simulate off-chain key generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating 2 seconds of computation

      const endTime = performance.now();
      const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

      // Generate a mock proof (this should be replaced with actual zk-SNARK proof generation)
      const mockProof = {
        a: [ethers.BigNumber.from(ethers.utils.randomBytes(32)), ethers.BigNumber.from(ethers.utils.randomBytes(32))],
        b: [[ethers.BigNumber.from(ethers.utils.randomBytes(32)), ethers.BigNumber.from(ethers.utils.randomBytes(32))], [ethers.BigNumber.from(ethers.utils.randomBytes(32)), ethers.BigNumber.from(ethers.utils.randomBytes(32))]],
        c: [ethers.BigNumber.from(ethers.utils.randomBytes(32)), ethers.BigNumber.from(ethers.utils.randomBytes(32))]
      };

      // Submit the proof to the network
      const tx = await contract.submitProof(mockProof.a, mockProof.b, mockProof.c);
      const receipt = await tx.wait();

      setBenchmarks({
        gas: receipt.gasUsed.toString(),
        proofTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
      });

      setFeedback("Key generation completed and proof submitted successfully!");
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
          <NetworkStatus isConnected={isConnected} networkName={networkName} />
          <WalletConnection networkName={networkName} isConnected={isConnected} onConnect={connectWallet} />
          <div className="space-x-4">
            <Button onClick={addParticipant} className="bg-[#B5FF81] text-[#0A0A0A] hover:bg-transparent hover:text-[#B5FF81] border border-[#B5FF81]">Add Participant</Button>
            <Button onClick={startKeyGeneration} className="bg-[#B5FF81] text-[#0A0A0A] hover:bg-transparent hover:text-[#B5FF81] border border-[#B5FF81]">Start Key Generation</Button>
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
