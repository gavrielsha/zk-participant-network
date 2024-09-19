import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const WalletConnection = ({ networkName, isConnected, onConnect }) => {
  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Wallet Connection</AlertTitle>
      <AlertDescription>
        {isConnected ? (
          <>Connected to {networkName}</>
        ) : (
          <Button onClick={onConnect} className="bg-transparent border border-[#B5FF81] text-[#B5FF81] hover:bg-[#B5FF81] hover:text-black">
            Connect Wallet
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default WalletConnection;
