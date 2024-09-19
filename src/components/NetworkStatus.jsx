import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from 'lucide-react';

const NetworkStatus = ({ isConnected, networkName }) => {
  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertDescription className="flex items-center">
        {isConnected ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Connected to {networkName}
          </>
        ) : (
          <>
            <XCircle className="mr-2 h-4 w-4" />
            Not connected
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default NetworkStatus;
