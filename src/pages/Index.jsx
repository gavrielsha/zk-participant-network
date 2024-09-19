import React from 'react';
import DKGMultisigWallet from '../components/DKGMultisigWallet';
import Instructions from '../components/Instructions';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/b/b4/Iracema.jpg')"}}>
      <div className="fixed inset-0 bg-[#0A0A0A] opacity-35"></div>
      <div className="relative z-10 w-full max-w-4xl overflow-y-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#B5FF81] text-center">zkDKG: Zero-Knowledge Distributed Key Generation</h1>
        <DKGMultisigWallet />
        <Instructions />
      </div>
    </div>
  </div>
  );
};

export default Index;
