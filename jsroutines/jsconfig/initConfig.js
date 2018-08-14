import * as TxConfig from './TxConfig';
import * as SubmitTx from '../util/SubmitTx';

module.exports = function initConfig(_web3, _deployer, _network, _accounts) {
  global.console.log(`  Network:  ${_network}`);
  global.console.log(`  Accounts: ${_accounts.join('\n            ')}`);

  TxConfig.setWeb3(_web3);
  TxConfig.setNetworkType(_network);

  if (_network === 'development' || _network === 'coverage') {
    TxConfig.disableNonceTracker();
  } else {
    SubmitTx.resetNonceTracker();
    TxConfig.enableNonceTracker();
  }

  TxConfig.setDeployer(_deployer);
  TxConfig.setEthAccounts(_accounts);
};
