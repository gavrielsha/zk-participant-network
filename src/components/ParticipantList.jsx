import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ParticipantList = ({ participants }) => {
  return (
    <Alert>
      <AlertTitle>Participants</AlertTitle>
      <AlertDescription>
        Total: {participants.length}
        {participants.map((p, index) => (
          <div key={index}>{p}</div>
        ))}
      </AlertDescription>
    </Alert>
  );
};

export default ParticipantList;