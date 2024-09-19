# zkDKG: Zero-Knowledge Distributed Key Generation

This project implements a Zero-Knowledge Distributed Key Generation (zkDKG) protocol using zk-SNARKs and smart contracts.

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
