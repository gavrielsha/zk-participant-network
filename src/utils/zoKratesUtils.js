import { initialize } from 'zokrates-js';

export const measureZoKratesPerformance = async () => {
  const zokrates = await initialize();
  
  const source = `
    def main(private field a, field b) -> field {
      return a * b;
    }
  `;

  const artifacts = zokrates.compile(source);

  const { witness, output } = zokrates.computeWitness(artifacts, ["2", "3"]);

  const startTime = performance.now();
  const proof = zokrates.generateProof(artifacts.program, witness, artifacts.provingKey);
  const endTime = performance.now();

  const proofTime = (endTime - startTime) / 1000; // Convert to seconds

  // Estimate gas usage (this is a placeholder, replace with actual measurement)
  const estimatedGas = 2000000; // Example value, replace with actual measurement

  // Measure memory usage (this is a placeholder, replace with actual measurement)
  const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize / 1024 : 0;

  return {
    gas: estimatedGas,
    proofTime: proofTime,
    memoryUsage: memoryUsage
  };
};