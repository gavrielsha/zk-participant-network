import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BenchmarkDisplay = ({ benchmarks }) => {
  return (
    <Alert>
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