import { initialize } from 'zokrates-js';
import { ethers } from 'ethers';

export const performZKDKG = async (contract, signer) => {
  const startTime = performance.now();

  // Initialize ZoKrates
  const zokrates = await initialize();

  // ZoKrates program for DKG (simplified version)
  const source = `
    def main(private field a, private field b) -> field {
      return a * b;
    }
  `;

  // Compile the program
  const artifacts = zokrates.compile(source);

  // Generate witness
  const { witness } = zokrates.computeWitness(artifacts, ["2", "3"]);

  // Generate proof
  const proof = zokrates.generateProof(artifacts.program, witness, artifacts.provingKey);

  // Verify the proof
  const isVerified = zokrates.verify(artifacts.verificationKey, proof);

  if (!isVerified) {
    throw new Error("Proof verification failed");
  }

  // Call the smart contract to generate the key
  const tx = await contract.generateKey();
  const receipt = await tx.wait();

  const endTime = performance.now();
  const proofTime = (endTime - startTime) / 1000; // Convert to seconds

  // Get gas used from the transaction receipt
  const gasUsed = ethers.utils.formatUnits(receipt.gasUsed, 'gwei');

  // Estimate memory usage (this is a placeholder, replace with actual measurement if possible)
  const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize / (1024 * 1024) : 0;

  return {
    gas: parseFloat(gasUsed) / 1000, // Convert to kgas
    proofTime: proofTime,
    memoryUsage: memoryUsage
  };
};
