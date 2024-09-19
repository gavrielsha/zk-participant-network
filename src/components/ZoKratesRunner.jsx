import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ZoKratesRunner = () => {
  const [output, setOutput] = useState('');
  const [benchmarks, setBenchmarks] = useState({ proofTime: 0, memory: 0 });

  const runCommand = async (command) => {
    setOutput(prev => prev + `\n$ ${command}\nRunning command...\n`);
    const startTime = performance.now();
    const startMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

    // Simulating ZoKrates command execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    const endTime = performance.now();
    const endMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;

    setBenchmarks({
      proofTime: (endTime - startTime).toFixed(2),
      memory: ((endMemory - startMemory) / (1024 * 1024)).toFixed(2)
    });

    setOutput(prev => prev + 'Command completed successfully.\n');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ZoKrates Command Runner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button onClick={() => runCommand('zokrates compile -i dkg_circuit.zok')}>
            Compile Circuit
          </Button>
          <Button onClick={() => runCommand('zokrates setup')}>
            Setup
          </Button>
          <Button onClick={() => runCommand('zokrates compute-witness -a 1 2 3')}>
            Compute Witness
          </Button>
          <Button onClick={() => runCommand('zokrates generate-proof')}>
            Generate Proof
          </Button>
          <Button onClick={() => runCommand('zokrates export-verifier')}>
            Export Verifier
          </Button>
        </div>
        <div className="mt-4 p-2 bg-gray-100 rounded-md">
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
        <Alert className="mt-4">
          <AlertTitle>ZoKrates Benchmarks</AlertTitle>
          <AlertDescription>
            <div>Proof Time: {benchmarks.proofTime} ms</div>
            <div>Memory Usage: {benchmarks.memory} MB</div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ZoKratesRunner;
