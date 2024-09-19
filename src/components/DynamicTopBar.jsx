import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from 'lucide-react';

const DynamicTopBar = ({ isConnected, networkName, connectionStatus, onConnect, participants }) => {
  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center">
          {isConnected ? (
            <CheckCircle className="mr-2 h-4 w-4" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          {connectionStatus}
          {isConnected && ` (${networkName})`}
        </div>
        {!isConnected ? (
          <Button onClick={onConnect} className="bg-[#B5FF81] text-[#0A0A0A] hover:bg-transparent hover:text-[#B5FF81] border border-[#B5FF81]">
            Connect Wallet
          </Button>
        ) : (
          <div>
            Participants: {participants.length}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DynamicTopBar;
