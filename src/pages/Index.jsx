import React from 'react';
import DKGMultisigWallet from '../components/DKGMultisigWallet';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">zkDKG: Zero-Knowledge Distributed Key Generation</h1>
      <DKGMultisigWallet />
    </div>
  );
};

export default Index;
