import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DKGMultisigWalletABI from '../contracts/DKGMultisigWallet.json';

const DKGMultisigWallet = () => {
  const [participants, setParticipants] = useState([]);
  const [participantAddress, setParticipantAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [feedback, setFeedback] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [benchmarks, setBenchmarks] = useState({ gas: 0, proofTime: 0, memory: 0 });

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setSigner(signer);

          const contractAddress = "0x1234567890123456789012345678901234567890"; // Replace with your actual deployed contract address
          const contractInstance = new ethers.Contract(contractAddress, DKGMultisigWalletABI.abi, signer);
          setContract(contractInstance);

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
          setFeedback("Failed to connect to Ethereum. Make sure you have MetaMask installed and connected to the Goerli testnet.");
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
      const startTime = performance.now();
      const startMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      const tx = await contract.addParticipant(participantAddress);
      setFeedback("Adding participant... Please wait for transaction confirmation.");
      
      const receipt = await tx.wait();
      const endTime = performance.now();
      const endMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      setBenchmarks({
        gas: receipt.gasUsed.toString(),
        proofTime: (endTime - startTime).toFixed(2),
        memory: ((endMemory - startMemory) / (1024 * 1024)).toFixed(2)
      });

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
      const startTime = performance.now();
      const startMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      const tx = await contract.startKeyGeneration();
      setFeedback("Starting key generation... Please wait for transaction confirmation.");
      
      const receipt = await tx.wait();
      const endTime = performance.now();
      const endMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      setBenchmarks({
        gas: receipt.gasUsed.toString(),
        proofTime: (endTime - startTime).toFixed(2),
        memory: ((endMemory - startMemory) / (1024 * 1024)).toFixed(2)
      });
    } catch (error) {
      console.error("Error starting key generation:", error);
      setFeedback(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-md">
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
          <Alert>
            <AlertTitle>Participants</AlertTitle>
            <AlertDescription>
              Total: {participants.length}
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
          <Alert>
            <AlertTitle>Benchmarks</AlertTitle>
            <AlertDescription>
              <div>Gas Used: {benchmarks.gas}</div>
              <div>Proof Time: {benchmarks.proofTime} ms</div>
              <div>Memory Usage: {benchmarks.memory} MB</div>
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
