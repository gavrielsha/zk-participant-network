import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from 'lucide-react';

const ParticipantList = ({ participants, connectedAddress, isConnected }) => {
  const displayParticipants = isConnected ? [connectedAddress, ...participants.filter(p => p.toLowerCase() !== connectedAddress.toLowerCase())] : participants;

  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Participants</AlertTitle>
      <AlertDescription>
        <div>Total: {displayParticipants.length}</div>
        {displayParticipants.map((p, index) => (
          <div key={index} className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            {p.slice(0, 6)}...{p.slice(-4)} {p.toLowerCase() === connectedAddress.toLowerCase() ? ' (You)' : ''}
          </div>
        ))}
      </AlertDescription>
    </Alert>
  );
};

export default ParticipantList;
