import {config as dotEnvConfig} from "dotenv";

dotEnvConfig();
import {HardhatUserConfig} from "hardhat/types";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-truffle5";
import "@nomiclabs/hardhat-etherscan";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

import {HardhatNetworkAccountsUserConfig} from "hardhat/types/config";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const MNEMONIC = process.env.MNEMONIC;
const accounts: HardhatNetworkAccountsUserConfig = {
    mnemonic: MNEMONIC ?? "test test test test test test test test test test test junk"
};
const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [
            {
                version: "0.5.16", settings: {
                    optimizer: {
                        enabled: true,
                        runs: 999999
                    }
                }
            },
            {
                version: "0.6.12", settings: {
                    optimizer: {
                        enabled: true,
                        runs: 999999
                    }
                }
            },
            {
                version: "0.7.6", settings: {
                    optimizer: {
                        enabled: true,
                        runs: 999999
                    }
                }
            },
            {
                version: "0.8.11", settings: {
                    optimizer: {
                        enabled: true,
                        runs: 999999
                    }
                }
            }
        ],
        overrides: {
        }
    },

    networks: {
        hardhat: {
            tags: process.env.DEFAULT_TAG ? process.env.DEFAULT_TAG.split(",") : ["local"],
            live: false,
            saveDeployments: false,
            allowUnlimitedContractSize: true,
            chainId: 1,
            accounts
        },
        localhost: {
            tags: ["local"],
            live: false,
            saveDeployments: false,
            url: "http://localhost:8545",
            accounts,
            timeout: 60000
        },
        bsctestnet: {
            tags: ["local", "staging"],
            live: true,
            saveDeployments: true,
            accounts,
            loggingEnabled: true,
            url: `https://data-seed-prebsc-1-s2.binance.org:8545`
        },
        ganache: {
            tags: ["local"],
            live: true,
            saveDeployments: false,
            accounts,
            url: "http://127.0.0.1:8555" // Coverage launches its own ganache-cli client
        },
        coverage: {
            tags: ["local"],
            live: false,
            saveDeployments: false,
            accounts,
            url: "http://127.0.0.1:8555" // Coverage launches its own ganache-cli client
        }
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY
      },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5"
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    external: {},
    mocha: {
        timeout: 200000
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false
    }
};

export default config;