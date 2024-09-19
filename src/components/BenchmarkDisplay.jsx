import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BenchmarkDisplay = ({ benchmarks }) => {
  if (benchmarks.gas === 0 && benchmarks.proofTime === 0 && benchmarks.memory === 0) {
    return null;
  }

  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Benchmarks</AlertTitle>
      <AlertDescription>
        <div>Gas Used: {benchmarks.gas}</div>
        <div>Proof Time: {benchmarks.proofTime} ms</div>
        <div>Memory Usage: {benchmarks.memory} MB</div>
      </AlertDescription>
    </Alert>
  );
};

export default BenchmarkDisplay;
