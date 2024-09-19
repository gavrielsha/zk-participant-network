import React from 'react';
import DKGMultisigWallet from '../components/DKGMultisigWallet';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">zkDKG: Zero-Knowledge Distributed Key Generation</h1>
      <DKGMultisigWallet />
      <div className="mt-8 text-center max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">How to Deploy and Make Functional:</h2>
        <ol className="text-left list-decimal pl-6 space-y-2">
          <li>Install Hardhat: <code>npm install --save-dev hardhat</code></li>
          <li>Initialize Hardhat project: <code>npx hardhat</code></li>
          <li>Write your smart contract in the <code>contracts/</code> directory</li>
          <li>Compile the contract: <code>npx hardhat compile</code></li>
          <li>Deploy to local network: <code>npx hardhat run scripts/deploy.js --network localhost</code></li>
          <li>Copy the deployed contract address</li>
          <li>Paste the address into the "Contract Address" field in the UI</li>
          <li>Click "Initialize Contract" to connect to the deployed contract</li>
          <li>You can now interact with the contract using the UI</li>
        </ol>
      </div>
    </div>
  );
};

export default Index;
