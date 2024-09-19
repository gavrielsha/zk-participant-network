# ZK Participant Network

This repository replicates and benchmarks the results of the research paper:  
**[Distributed Key Generation with Smart Contracts using zk-SNARKs](https://arxiv.org/pdf/2212.10324)** by **Michael Sober** and collaborators.

## About the Study

The research explores zero-knowledge proof systems in the context of decentralized identity management, focusing on improving efficiency and privacy. This repository is aimed at replicating their results, specifically targeting the benchmarks detailed in their experiments. The implementation in this repo follows the methodology and testing conditions set forth in the paper to ensure accurate performance benchmarking of zkDKG in multi-sig wallets.

## Quick Start

1. **Setup**: Install Node.js, Hardhat, ZoKrates, and Go.
2. **Clone**: `git clone https://github.com/soberm/zkDKG.git && cd zkDKG`
3. **Dataset**: Create `data/dataset.json` with participant data.
4. **Go Client**: Implement `main.go` for dataset handling.
5. **Compile**: Run `npx hardhat compile` for smart contracts.
6. **Deploy**: Use `npx hardhat run --network localhost scripts/deploy.js`
7. **Track**: Monitor gas, proof time, and memory usage.
8. **Test**: Run `go run main.go` to simulate the protocol.
9. **Present**: Push to GitHub and deploy to a testnet.

## Detailed Steps

For a comprehensive guide on each step, including code snippets and explanations, please refer to the [project wiki](https://github.com/yourusername/zkDKG/wiki).

## Frontend

The project includes a simple frontend to visualize ZoKrates commands. Run the application to interact with the ZoKrates Command Runner.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for more information.

### Credits and Reference

The work presented in this repository is inspired by and replicates the findings in the paper [Distributed Key Generation with Smart Contracts using zk-SNARKs](https://arxiv.org/pdf/2212.10324), authored by Michael Sober and his team. Their contribution to the field of zero-knowledge proof systems is invaluable, and this repo aims to provide further validation of their research through comprehensive benchmarking.

The original study can be found here:  
- **Title**: Distributed Key Generation with Smart Contracts using zk-SNARKs
- **Authors**: Michael Sober, Max Kobelt, Giulia Scaffino, Dominik Kaaser, Stefan Schulte, et al.  
- **Published**: [ArXiv 2212.10324](https://arxiv.org/pdf/2212.10324)
This project implements a Zero-Knowledge Distributed Key Generation (zkDKG) protocol using zk-SNARKs and smart contracts.
- **Original Code**: https://github.com/soberm/zkDKG

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
