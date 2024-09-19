import React from 'react';
import DKGMultisigWallet from '../components/DKGMultisigWallet';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">zkDKG: Zero-Knowledge Distributed Key Generation</h1>
      <DKGMultisigWallet />
      <div className="mt-8 text-center max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">How to Use:</h2>
        <ol className="text-left list-decimal pl-6 space-y-2">
          <li>Install MetaMask browser extension if you haven't already</li>
          <li>Connect MetaMask to the Goerli testnet:
            <ul className="list-disc pl-6 mt-2">
              <li>Open MetaMask</li>
              <li>Click on the network dropdown at the top</li>
              <li>Select "Goerli Test Network"</li>
            </ul>
          </li>
          <li>Ensure you have some Goerli ETH (you can get it from a faucet)</li>
          <li>Refresh this page and connect your MetaMask wallet</li>
          <li>Once connected, you can interact with the DKG Multisig Wallet</li>
          <li>Add participants by entering their Ethereum addresses</li>
          <li>Generate keys using the provided buttons</li>
        </ol>
      </div>
    </div>
  );
};

export default Index;
