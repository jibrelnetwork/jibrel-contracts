require('babel-register');
require('babel-polyfill');


module.exports = {
  networks: {
    development: {
      host:       'localhost',
      port:       8560,
      network_id: '*', // Match any network id
      gas:        4500000,
      from:       '0xc1ebb17ac2b9146aeae1d1aeb13617005a67ce2b',
    },
    ropsten:     {
      host:       'localhost',
      port:       8550,
      network_id: 3, // official id of the ropsten network
      gas:        4500000,
    },
    main:        {
      host:       'localhost',
      port:       8545,
      network_id: 3, // official id of the ropsten network
      gas:        4500000,
    },
  },
};
