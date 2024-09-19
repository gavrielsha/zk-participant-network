import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ZoKratesRunner = () => {
  const [output, setOutput] = useState('');

  const runCommand = (command) => {
    setOutput(prev => prev + `\n$ ${command}\nRunning command...\n`);
    // In a real application, you would execute the command here and update the output
    setTimeout(() => {
      setOutput(prev => prev + 'Command completed successfully.\n');
    }, 1000);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>ZoKrates Command Runner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button onClick={() => runCommand('zokrates compile -i your_circuit.zok')}>
            Compile Circuit
          </Button>
          <Button onClick={() => runCommand('zokrates setup')}>
            Setup
          </Button>
          <Button onClick={() => runCommand('zokrates compute-witness -a <args>')}>
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
      </CardContent>
    </Card>
  );
};

export default ZoKratesRunner;