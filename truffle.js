require('babel-register');
require('babel-polyfill');


module.exports = {
  networks: {
    development: {
      host:       'localhost',
      port:       8560,
      network_id: '*', // Match any network id
      gas:        6600000,
    },
    ropsten: {
      host:       'localhost',
      port:       8550,
      network_id: 3, // official id of the ropsten network
      gas:        4600000,
      gasPrice:   1000000000000,
    },
    main: {
      host:       'localhost',
      port:       8545,
      network_id: 1, // official id of the main network
      gas:        6600000,
      gasPrice:   35000000000,
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
