import * as TxConfig from './TxConfig';
import * as DeployConfig from './DeployConfig';
import * as SubmitTx from '../util/SubmitTx';


module.exports = function initConfig(web3, deployer, network, accounts) {
  global.console.log(`  Network:  ${network}`);
  global.console.log(`  Accounts: ${accounts.join('\n            ')}`);

  TxConfig.setWeb3(web3);
  TxConfig.setNetworkType(network);

  if (network === 'development' || network === 'coverage') {
    SubmitTx.disableNonceTracker();
  } else {
    SubmitTx.resetNonceTracker();
    SubmitTx.enableNonceTracker();
  }

  DeployConfig.setDeployer(deployer);
  DeployConfig.setEthAccounts(accounts);
};
