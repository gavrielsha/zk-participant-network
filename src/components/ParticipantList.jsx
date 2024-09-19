import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from 'lucide-react';

const ParticipantList = ({ participants }) => {
  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Participants</AlertTitle>
      <AlertDescription>
        <div>Total: {participants.length}</div>
        {participants.map((p, index) => (
          <div key={index} className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            {p}
          </div>
        ))}
      </AlertDescription>
    </Alert>
  );
};

export default ParticipantList;
