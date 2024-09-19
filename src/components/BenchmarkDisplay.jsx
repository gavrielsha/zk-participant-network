import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BenchmarkDisplay = ({ benchmarks }) => {
  const formatMemory = (memory) => {
    if (memory < 1024) {
      return `${memory.toFixed(2)} KB`;
    } else {
      return `${(memory / 1024).toFixed(2)} MB`;
    }
  };

  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Benchmarks</AlertTitle>
      <AlertDescription>
        <div>Gas Used: {benchmarks.gas} kgas</div>
        <div>Proof Generation Time: {benchmarks.proofTime} seconds</div>
        <div>Memory Usage: {formatMemory(benchmarks.memoryUsage)}</div>
      </AlertDescription>
    </Alert>
  );
};

export default BenchmarkDisplay;
