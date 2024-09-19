import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DKGMultisigWalletABI from '../contracts/DKGMultisigWallet.json';

const DKGMultisigWallet = () => {
  const [feedback, setFeedback] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedWallets, setConnectedWallets] = useState(0);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);

        const contractAddress = "0x1234567890123456789012345678901234567890"; // Replace with your actual deployed contract address
        const contractInstance = new ethers.Contract(contractAddress, DKGMultisigWalletABI.abi, signer);
        setContract(contractInstance);

        setIsConnected(true);
        setFeedback("Wallet connected successfully!");

        const address = await signer.getAddress();
        await addParticipant(contractInstance, address);

        setupEventListeners(contractInstance);
        fetchConnectedWallets(contractInstance);
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
      fetchConnectedWallets(contractInstance);
    });
  };

  const fetchConnectedWallets = async (contractInstance) => {
    try {
      const count = await contractInstance.getParticipantCount();
      setConnectedWallets(count.toNumber());
    } catch (error) {
      console.error("Error fetching connected wallets:", error);
    }
  };

  const addParticipant = async (contractInstance, address) => {
    try {
      const tx = await contractInstance.addParticipant(address);
      await tx.wait();
    } catch (error) {
      console.error("Error adding participant:", error);
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
          <Button onClick={connectWallet} disabled={isConnected} className="bg-[#B5FF81] text-[#0A0A0A] hover:bg-transparent hover:text-[#B5FF81] border border-[#B5FF81]">
            {isConnected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
          {isConnected && (
            <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
              <AlertTitle>Connected Wallets</AlertTitle>
              <AlertDescription>{connectedWallets}</AlertDescription>
            </Alert>
          )}
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
