require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");
require("@typechain/hardhat");
require("hardhat-abi-exporter");
require("solidity-coverage");
require("dotenv/config");
require("hardhat-gas-reporter");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0 // hardhat london fork error fix for coverage
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/f4dd6db18a6f4ea98151892c0fa8e074",
      chainId: 4,
      accounts: [process.env.PRIVATE_KEY_testnet]
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/f4dd6db18a6f4ea98151892c0fa8e074",
      chainId: 1,
      accounts: [process.env.PRIVATE_KEY_mainnet]
    }
  },
  paths: {
    sources: "./src/*",
    artifacts: "./build",
    tests: "./src/tests/*"
  },
  gasReporter: {
    enabled: true,
    currency: "USD"
  },
  abiExporter: {
    path: "./abi",
    clear: true,
    flat: true
  }
};
