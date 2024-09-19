import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DKGMultisigWallet = () => {
  const [participants, setParticipants] = useState([]);
  const [participantAddress, setParticipantAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [feedback, setFeedback] = useState('');

  const addParticipant = () => {
    if (participantAddress.trim() === '') {
      setFeedback('Please enter a valid address');
      return;
    }
    if (participants.includes(participantAddress)) {
      setFeedback('This participant is already added');
      return;
    }
    setParticipants([...participants, participantAddress]);
    setParticipantAddress('');
    setFeedback('Participant added successfully!');
  };

  const generateKey = () => {
    if (participants.length === 0) {
      setFeedback('Add participants before generating a key');
      return;
    }
    // Simulate key generation with a random hash
    const mockPublicKey = Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setPublicKey(mockPublicKey);
    setFeedback('Key generated successfully!');
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>zk-SNARKs DKG Multisig Wallet (Local Simulation)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="participant-address">Participant Address</Label>
            <Input
              id="participant-address"
              value={participantAddress}
              onChange={(e) => setParticipantAddress(e.target.value)}
              placeholder="Enter any string as an address"
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
