import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DKGMultisigWalletABI from '../contracts/DKGMultisigWallet.json';
import ParticipantList from './ParticipantList';
import BenchmarkDisplay from './BenchmarkDisplay';
import DynamicTopBar from './DynamicTopBar';

const DKGMultisigWallet = () => {
  const [participants, setParticipants] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [benchmarks, setBenchmarks] = useState({ gas: 0, proofTime: 0, memory: 0 });
  const [networkName, setNetworkName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Not connected');

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
        setConnectionStatus('Connecting wallet...');
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
        setConnectionStatus('Wallet connected. Adding as participant...');

        // Automatically add the connected wallet as a participant
        await addParticipant(await signer.getAddress());

        setupEventListeners(contractInstance);
        await fetchParticipants(contractInstance);

        setConnectionStatus('Connected and added as participant');
      } catch (error) {
        console.error("Failed to connect to Ethereum:", error);
        setConnectionStatus(`Error: ${error.message}`);
      }
    } else {
      setConnectionStatus("Please install MetaMask to interact with this dApp.");
    }
  };

  const setupEventListeners = (contractInstance) => {
    contractInstance.on("ParticipantAdded", (participant) => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      setFeedback(`Participant ${participant} added successfully!`);
      fetchParticipants(contractInstance);
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

  const addParticipant = async (address) => {
    if (!contract) {
      setFeedback("Contract not initialized. Please connect your wallet first.");
      return;
    }

    try {
      setFeedback("Adding participant... Please check your wallet for confirmation.");
      const tx = await contract.addParticipant(address);
      setFeedback("Transaction sent. Waiting for confirmation...");
      
      const receipt = await tx.wait();
      setFeedback("Participant added successfully!");
      
      // Update benchmarks
      setBenchmarks(prevBenchmarks => ({
        ...prevBenchmarks,
        gas: receipt.gasUsed.toString(),
      }));

      // Fetch updated participant list
      fetchParticipants(contract);
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

      const tx = await contract.generateKey();
      setFeedback("Key generation transaction sent. Waiting for confirmation...");
      
      const receipt = await tx.wait();
      const endTime = performance.now();

      setBenchmarks({
        gas: receipt.gasUsed.toString(),
        proofTime: endTime - startTime,
        memory: 0 // We don't have access to memory usage in the browser
      });

      setFeedback("Key generation completed successfully!");
    } catch (error) {
      console.error("Error starting key generation:", error);
      setFeedback(`Error: ${error.message}. Make sure your wallet is connected and you have enough ETH for gas.`);
    }
  };

  return (
    <Card className="w-full max-w-4xl bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <CardHeader>
        <CardTitle>zk-SNARKs DKG Multisig Wallet (Sepolia Testnet)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DynamicTopBar
            isConnected={isConnected}
            networkName={networkName}
            connectionStatus={connectionStatus}
            onConnect={connectWallet}
          />
          <div className="space-x-4">
            <Button onClick={startKeyGeneration} className="bg-[#B5FF81] text-[#0A0A0A] hover:bg-transparent hover:text-[#B5FF81] border border-[#B5FF81]">Start Key Generation</Button>
          </div>
          <ParticipantList participants={participants} />
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
