import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ParticipantList = ({ participants }) => {
  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Participants</AlertTitle>
      <AlertDescription>
        <div>Total: {participants.length}</div>
        {participants.map((p, index) => (
          <div key={index}>{p}</div>
        ))}
      </AlertDescription>
    </Alert>
  );
};

export default ParticipantList;
