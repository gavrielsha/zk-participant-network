import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BenchmarkDisplay = ({ benchmarks }) => {
  const formatTime = (time) => {
    return (time / 1000).toFixed(2);
  };

  const formatMemory = (memory) => {
    return (memory / (1024 * 1024)).toFixed(2);
  };

  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Benchmarks</AlertTitle>
      <AlertDescription>
        <div>Gas Used: {benchmarks.gas} kgas</div>
        <div>Proof Generation Time: {formatTime(benchmarks.proofTime)} seconds</div>
        <div>Estimated Memory Usage: {formatMemory(benchmarks.memoryUsage)} MB</div>
      </AlertDescription>
    </Alert>
  );
};

export default BenchmarkDisplay;
