import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Instructions = () => {
  return (
    <Card className="mt-8 w-full max-w-3xl bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <CardHeader>
        <CardTitle>How to Use</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2">
          <li>Install MetaMask browser extension from metamask.io</li>
          <li>Add Sepolia Testnet to MetaMask (Network ID: 11155111)</li>
          <li>Get Sepolia ETH from a faucet (e.g., sepoliafaucet.com)</li>
          <li>Connect your wallet to this dApp</li>
          <li>Add participants and start key generation</li>
        </ol>
      </CardContent>
    </Card>
  );
};

export default Instructions;