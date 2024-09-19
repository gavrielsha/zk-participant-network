import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const contractABI = [
  "function addParticipant(address participant) public",
  "function generateKey() public",
  "function getParticipants() public view returns (address[])",
  "event ParticipantAdded(address participant)",
  "event KeyGenerated(bytes32 publicKey)"
];

const DKGMultisigWallet = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [participantAddress, setParticipantAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('0x1234567890123456789012345678901234567890'); // Replace with your deployed contract address
  const [participants, setParticipants] = useState([]);
  const [publicKey, setPublicKey] = useState('');
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

          // Initialize contract
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(contract);
          setFeedback('Contract initialized successfully!');

          // Load participants
          loadParticipants(contract);
        } catch (error) {
          setFeedback('Error connecting to MetaMask: ' + error.message);
        }
      } else {
        setFeedback('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const loadParticipants = async (contract) => {
    try {
      const participantList = await contract.getParticipants();
      setParticipants(participantList);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const addParticipant = async () => {
    if (!contract) {
      setFeedback('Contract not initialized.');
      return;
    }
    if (!ethers.utils.isAddress(participantAddress)) {
      setFeedback('Invalid participant address');
      return;
    }
    try {
      setFeedback('Processing...');
      const tx = await contract.addParticipant(participantAddress);
      await tx.wait();
      setFeedback('Participant added successfully!');
      loadParticipants(contract);
      setParticipantAddress('');
    } catch (error) {
      setFeedback('Error: ' + error.message);
    }
  };

  const generateKey = async () => {
    if (!contract) {
      setFeedback('Contract not initialized.');
      return;
    }
    try {
      setFeedback('Generating key...');
      const tx = await contract.generateKey();
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'KeyGenerated');
      if (event) {
        setPublicKey(event.args.publicKey);
        setFeedback('Key generated successfully!');
      }
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
            <Label htmlFor="contract-address">Contract Address</Label>
            <Input
              id="contract-address"
              value={contractAddress}
              readOnly
            />
          </div>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DKGMultisigWallet;
