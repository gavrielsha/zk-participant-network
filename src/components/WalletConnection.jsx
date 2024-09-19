import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WalletConnection = ({ networkName }) => {
  return (
    <Alert>
      <AlertTitle>Current Network</AlertTitle>
      <AlertDescription>{networkName || 'Not connected'}</AlertDescription>
    </Alert>
  );
};

export default WalletConnection;