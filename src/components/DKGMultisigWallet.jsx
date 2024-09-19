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
  const [networkName, setNetworkName] = useState('');

  useEffect(() => {
    const initializeEthers = async () => {
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
          setFeedback(`Failed to connect to Ethereum: ${error.message}. Make sure you have MetaMask installed and connected to the Sepolia testnet.`);
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
      setFeedback("Initiating transaction... Please check your wallet for confirmation.");
      const startTime = performance.now();
      const startMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      const tx = await contract.addParticipant(participantAddress);
      setFeedback("Transaction sent. Waiting for confirmation...");
      
      const receipt = await tx.wait();
      const endTime = performance.now();
      const endMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      setBenchmarks({
        gas: receipt.gasUsed.toString(),
        proofTime: (endTime - startTime).toFixed(2),
        memory: ((endMemory - startMemory) / (1024 * 1024)).toFixed(2)
      });

      setParticipantAddress('');
      setFeedback("Participant added successfully!");
    } catch (error) {
      console.error("Error adding participant:", error);
      setFeedback(`Error: ${error.message}. Make sure your wallet is connected and you have enough ETH for gas.`);
    }
  };

  const startKeyGeneration = async () => {
    if (!contract || !signer) {
      setFeedback("Please connect to Ethereum first.");
      return;
    }

    try {
      setFeedback("Initiating key generation... Please check your wallet for confirmation.");
      const startTime = performance.now();
      const startMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

      const tx = await contract.startKeyGeneration();
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>zk-SNARKs DKG Multisig Wallet (Sepolia Testnet)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Current Network</AlertTitle>
            <AlertDescription>{networkName || 'Not connected'}</AlertDescription>
          </Alert>
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
          <Alert>
            <AlertTitle>How to Use</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal list-inside">
                <li>Ensure MetaMask is installed and connected to Sepolia testnet</li>
                <li>If using MetaMask mobile, open the app and connect to the dApp</li>
                <li>Enter participant address and click "Add Participant"</li>
                <li>Confirm the transaction in your MetaMask wallet</li>
                <li>Once all participants are added, click "Start Key Generation"</li>
                <li>Check benchmarks and generated public key</li>
              </ol>
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Troubleshooting</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                <li>Ensure you're connected to Sepolia testnet</li>
                <li>Check if you have enough Sepolia ETH for gas</li>
                <li>If using mobile, try refreshing the dApp or reconnecting your wallet</li>
                <li>For persistent issues, check the browser console for errors</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default DKGMultisigWallet;
