import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BenchmarkDisplay = ({ benchmarks }) => {
  return (
    <Alert className="bg-transparent border border-[#B5FF81] text-[#B5FF81]">
      <AlertTitle>Benchmarks</AlertTitle>
      <AlertDescription>
        <div>Gas Used: {benchmarks.gas} kgas</div>
        <div>Proof Generation Time: {benchmarks.proofTime} seconds</div>
        <div>Memory Usage: {benchmarks.memoryUsage} MB</div>
      </AlertDescription>
    </Alert>
  );
};

export default BenchmarkDisplay;
