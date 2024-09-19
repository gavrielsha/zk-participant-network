import React from 'react';
import DKGMultisigWallet from '../components/DKGMultisigWallet';
import Instructions from '../components/Instructions';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center" style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/b/b4/Iracema.jpg')"}}>
      <h1 className="text-4xl font-bold mb-8 text-[#B5FF81]">zkDKG: Zero-Knowledge Distributed Key Generation</h1>
      <DKGMultisigWallet />
      <Instructions />
    </div>
  );
};

export default Index;
