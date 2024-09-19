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
          <li>Enter any string as a participant "address" in the input field</li>
          <li>Click "Add Participant" to add the participant to the list</li>
          <li>Repeat steps 1-2 to add multiple participants</li>
          <li>Click "Generate Key" to simulate the DKG process</li>
          <li>Observe the generated mock public key</li>
        </ol>
        <p className="mt-4">
          Note: This is a simplified local simulation. In a real DKG implementation, 
          the process would involve complex cryptographic operations and blockchain interactions.
        </p>
      </div>
    </div>
  );
};

export default Index;
