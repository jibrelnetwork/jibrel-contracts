require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Settings = require('./settings');


module.exports = {
  networks: {
    development: {
      host:       'localhost',
      port:       8560,
      network_id: '*', // Match any network id
      gas:        16450000,
      gasPrice:   100000000000,
    },
    development_hd: {
      provider:   new HDWalletProvider(Settings.mnemonic, 'http://localhost:8560', 0, 50),
      network_id: '*', // Match any network id
      gas:        6450000,
    },
    ropsten: {
      host:       'localhost',
      port:       8550,
      network_id: 3, // official id of the ropsten network
      gas:        6450000,
      gasPrice:   100000000000, // 100 Gwei
    },
    ropsten_hd: {
      provider:   new HDWalletProvider(Settings.mnemonic, 'http://localhost:8550', 0, 50),
      network_id: 3, // official id of the ropsten network
      gas:        6450000,
      gasPrice:   100000000000, // 100 Gwei
    },
    main: {
      host:       'localhost',
      port:       8545,
      network_id: 1, // official id of the main network
      gas:        6450000,
      gasPrice:   100000000000, // 100 Gwei
    },
    main_hd: {
      provider:   new HDWalletProvider(Settings.mnemonic, 'http://localhost:8545', 0, 50),
      network_id: 1, // official id of the main network
      gas:        6450000,
      gasPrice:   100000000000, // 100 Gwei
    },
    coverage: {
      host:       'localhost',
      network_id: '*',
      port:       8570,
      gas:        0xfffffffffff,
      gasPrice:   0x01,
    },
  },
  // uncomment if you want to deploy contracts to the ropsten
  //
  // solc: {
  //   optimizer: {
  //     enabled: true,
  //     runs: 200,
  //   },
  // },
  compilers: {
    solc: {
      version: '^0.5.12', // A version or constraint - Ex. "^0.5.0"
      // Can also be set to "native" to use a native solc
      // docker: <boolean>, // Use a version obtained through docker
      // parser: "solcjs",  // Leverages solc-js purely for speedy parsing
      // settings: {
      //   optimizer: {
      //     enabled: <boolean>,
      //     runs: <number>   // Optimize for how many times you intend to run the code
      //   },
      //   evmVersion: <string> // Default: "petersburg"
      // }
    },
  },
};
