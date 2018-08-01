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
      gas:        8000000,
    },
    development_hd: {
      provider:   new HDWalletProvider(Settings.mnemonic, 'http://localhost:8560', 0, 20),
      network_id: '*', // Match any network id
      gas:        8000000,
    },
    ropsten: {
      host:       'localhost',
      port:       8550,
      network_id: 3, // official id of the ropsten network
      gas:        6600000,
      gasPrice:   1000000000, // 1 Gwei
    },
    ropsten_hd: {
      provider:   new HDWalletProvider(Settings.mnemonic, 'http://localhost:8550', 0, 20),
      network_id: 3, // official id of the ropsten network
      gas:        6600000,
      gasPrice:   1000000000, // 1 Gwei
    },
    main: {
      host:       'localhost',
      port:       8545,
      network_id: 1, // official id of the main network
      gas:        8000000,
      gasPrice:   1000000000, // 1 Gwei
    },
    main_hd: {
      provider:   new HDWalletProvider(Settings.mnemonic, 'http://localhost:8545', 0, 20),
      network_id: 1, // official id of the main network
      gas:        8000000,
      gasPrice:   1000000000, // 1 Gwei
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
};
