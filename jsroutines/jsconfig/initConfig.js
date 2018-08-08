import * as TxConfig from './TxConfig';
import * as DeployConfig from './DeployConfig';

module.exports = function initConfig(web3, deployer, network, accounts) {
  global.console.log(`  Network:  ${network}`);
  global.console.log(`  Accounts: ${accounts.join('\n            ')}`);

  TxConfig.setWeb3(web3);
  TxConfig.setNetworkType(network);

  DeployConfig.setDeployer(deployer);
  DeployConfig.setEthAccounts(accounts);
};
