import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BenchmarkDisplay = ({ benchmarks }) => {
  const formatGas = (gas) => {
    const kgas = gas / 1000;
    return kgas.toFixed(2);
  };

  const formatTime = (time) => {
    const seconds = time / 1000;
    return seconds.toFixed(2);
  };

  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Benchmarks</AlertTitle>
      <AlertDescription>
        <div>Gas Used: {formatGas(benchmarks.gas)} kgas</div>
        <div>Proof Time: {formatTime(benchmarks.proofTime)} seconds</div>
      </AlertDescription>
    </Alert>
  );
};

export default BenchmarkDisplay;
