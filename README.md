# zkDKG: Zero-Knowledge Distributed Key Generation

This project implements a Zero-Knowledge Distributed Key Generation (zkDKG) protocol using zk-SNARKs and smart contracts.

## Table of Contents
1. [Setting Up Your Development Environment](#step-1-setting-up-your-development-environment)
2. [Cloning the Project Code](#step-2-cloning-the-project-code)
3. [Creating the Dataset](#step-3-creating-the-dataset)
4. [Modify the Go Client Code](#step-4-modify-the-go-client-code)
5. [Compile the Solidity Smart Contract](#step-5-compile-the-solidity-smart-contract)
6. [Deploy the Smart Contract Locally](#step-6-deploy-the-smart-contract-locally)
7. [Tracking Gas, Proof Time, and Memory Usage](#step-7-tracking-gas-proof-time-and-memory-usage)
8. [Testing and Verifying Results](#step-8-testing-and-verifying-results)
9. [Presentation and Hosting](#step-9-presentation-and-hosting)

## Step 1: Setting Up Your Development Environment

1. **Install Necessary Software**:
   - **Node.js & npm**:
     - Download Node.js from [here](https://nodejs.org/en/download/).
     - Verify installation by running:
       ```bash
       node -v
       npm -v
       ```

   - **Hardhat**:
     - Install Hardhat globally:
       ```bash
       npm install --save-dev hardhat
       ```

   - **ZoKrates** (for zk-SNARK generation):
     - Install ZoKrates:
       ```bash
       curl -LSfs get.zokrates.dev | sh
       ```

   - **Go Language**:
     - Download and install Go from [here](https://golang.org/dl/).
     - Verify installation:
       ```bash
       go version
       ```

## Step 2: Cloning the Project Code

1. **Download the Code**:
   - Open the terminal and run:
     ```bash
     git clone https://github.com/soberm/zkDKG.git
     cd zkDKG
     ```

## Step 3: Creating the Dataset

1. **Create a New Dataset**:
   - Create a file named `dataset.json` in the `zkDKG/data/` folder.
   - Add the following content:

     ```json
     [
         {
             "id": 1,
             "name": "Participant_1",
             "publicKey": "0x123abc...",
             "privateKey": "0x789xyz..."
         },
         {
             "id": 2,
             "name": "Participant_2",
             "publicKey": "0x456def...",
             "privateKey": "0x012uvw..."
         },
         {
             "id": 3,
             "name": "Participant_3",
             "publicKey": "0x789ghi...",
             "privateKey": "0x345rst..."
         },
         {
             "id": 4,
             "name": "Participant_4",
             "publicKey": "0xabc123...",
             "privateKey": "0xrst789..."
         }
     ]
     ```

## Step 4: Modify the Go Client Code

1. **Modify the Go Client**:
   - Create a `main.go` file in the `zkDKG/` folder with the following code:

     ```go
     package main

     import (
         "encoding/json"
         "fmt"
         "io/ioutil"
         "os"
     )

     type Participant struct {
         ID         int    `json:"id"`
         Name       string `json:"name"`
         PublicKey  string `json:"publicKey"`
         PrivateKey string `json:"privateKey"`
     }

     func loadDataset() ([]Participant, error) {
         file, err := os.Open("data/dataset.json")
         if err != nil {
             return nil, err
         }
         defer file.Close()

         byteValue, _ := ioutil.ReadAll(file)
         var participants []Participant
         json.Unmarshal(byteValue, &participants)

         return participants, nil
     }

     func main() {
         participants, err := loadDataset()
         if err != nil {
             fmt.Println("Error loading dataset:", err)
             return
         }

         fmt.Println("Loaded Participants:", participants)
         fmt.Println("Running Distributed Key Generation protocol...")
     }
     ```

## Step 5: Compile the Solidity Smart Contract

1. **Compile the Smart Contracts**:
   - From the **zkDKG** project folder, run:
     ```bash
     npx hardhat compile
     ```

   This compiles the Solidity contracts into bytecode for deployment.

## Step 6: Deploy the Smart Contract Locally

1. **Deploy the Contract**:
   - Create a deployment script in the **scripts/** folder called `deploy.js`.

   - Add the following code to deploy the contract:

     ```javascript
     async function main() {
         const zkDKG = await ethers.getContractFactory("ZkDKG");
         const zkDKGContract = await zkDKG.deploy();
         await zkDKGContract.deployed();

         console.log("Contract deployed to:", zkDKGContract.address);
     }

     main()
       .then(() => process.exit(0))
       .catch(error => {
         console.error(error);
         process.exit(1);
       });
     ```

   - Run this command to deploy the contract locally:
     ```bash
     npx hardhat run --network localhost scripts/deploy.js
     ```

   - You'll see the contract address in the terminal if deployment is successful.

## Step 7: Tracking Gas, Proof Time, and Memory Usage

1. **Tracking Gas Consumption** (using Hardhat):
   - Create a test file (`/test/trackGas.js`) to track gas consumption:
     ```javascript
     const { expect } = require("chai");

     describe("Gas Tracking", function () {
         it("Tracks gas for a function", async function () {
             const tx = await contract.yourFunction();
             const receipt = await tx.wait();
             console.log("Gas Used: ", receipt.gasUsed.toString());
         });
     });
     ```

   - Run the test:
     ```bash
     npx hardhat test
     ```

2. **Proof Generation Time** (using `console.time()`):
   - In your zk-SNARK generation script, add:
     ```javascript
     console.time('proofGeneration');
     // zk-SNARK proof generation logic
     console.timeEnd('proofGeneration');
     ```

   - This will output the time taken to generate zk-SNARK proofs.

3. **Memory Usage** (using `top`):
   - To monitor memory usage during proof generation, run the `top` command in your terminal:
     ```bash
     top
     ```
   - Run the zk-SNARK process and observe memory consumption in real-time.

## Step 8: Testing and Verifying Results

1. **Run the Go Client**:
   - To simulate the protocol and verify that the system works, run the Go client:
     ```bash
     go run main.go
     ```

   - This will load the dataset and simulate the key generation and zk-SNARK proof steps.

## Step 9: Presentation and Hosting

1. **Push to GitHub**:
   - Once your project works, push it to GitHub:
     ```bash
     git init
     git add .
     git commit -m "Initial version"
     git remote add origin https://github.com/yourusername/yourproject.git
     git push -u origin master
     ```

2. **Host the Contract**:
   - Deploy the smart contract to a public Ethereum testnet (like Ropsten or Goerli) for live demonstrations.

---

This guide includes steps for setting up the development environment, creating and working with the dataset, modifying the Go client, compiling and deploying smart contracts, tracking gas consumption, proof generation time, and memory usage, as well as testing and hosting the project.
