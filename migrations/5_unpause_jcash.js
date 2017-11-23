require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef


const SubmitTx = require('../jsapi/misc/SubmitTx');

const jUSDViewERC20  = global.artifacts.require('jUSDViewERC20.sol');
const jKRWViewERC20  = global.artifacts.require('jKRWViewERC20.sol');

const GlobalConfig = require('./init/GlobalConfig');
const CrydrInit = require('./init/CrydrInit');


/* Migration actions */

const executeMigration = async () => {
  await CrydrInit.upauseCrydrView(jUSDViewERC20);
  await CrydrInit.upauseCrydrView(jKRWViewERC20);
};

const verifyMigration = async () => {
  // todo verify migration, make integration tests
};


/* Migration */

module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migration');
  global.console.log(`  Accounts: ${accounts}`);
  global.console.log(`  Network:  ${network}`);

  SubmitTx.setWeb3(web3); // eslint-disable-line no-undef
  if (network === 'development' || network === 'coverage') {
    SubmitTx.setDefaultWaitParamsForTestNetwork();
  }

  GlobalConfig.setDeployer(deployer);
  GlobalConfig.setAccounts(accounts);

  deployer.then(() => executeMigration())
          .then(() => verifyMigration())
          .then(() => global.console.log('  Migration finished'));
};
