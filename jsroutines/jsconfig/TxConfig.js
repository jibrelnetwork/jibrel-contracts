/* Web3 instance */

let web3Instance;

export function setWeb3(_web3InstanceParam) {
  web3Instance = _web3InstanceParam;
}

export function getWeb3() {
  return web3Instance;
}


/* Params of TX submission */

const txSubmitParamsProd = {
  minConfirmations:   1,
  pollingInterval:    10 * 1000,
  maxTimeoutMillisec: 15 * 60 * 1000,
  maxTimeoutBlocks:   50,
  gasPrice:           100 * 1000000000, // 100 gwei
  gasLimit:           200000,
};

const txSubmitParamsTestNetwork = {
  minConfirmations:   0,
  pollingInterval:    50,
  maxTimeoutMillisec: 60 * 1000,
  maxTimeoutBlocks:   5,
  gasPrice:           100 * 1000000000, // 100 gwei
  gasLimit:           200000,
};

let txSubmitParams = null;

export function setNetworkType(_networkType) {
  if (_networkType === 'development' || _networkType === 'coverage') {
    txSubmitParams = txSubmitParamsTestNetwork;
  } else {
    txSubmitParams = txSubmitParamsProd;
  }
}

export function getTxSubmitParams() {
  return txSubmitParams;
}


/* Deployer */

let deployer;

export function setDeployer(_deployer) {
  deployer = _deployer;
}

export function getDeployer() {
  return deployer;
}


/* Ethereum accounts */

let accounts;

export class EthereumAccounts {
  constructor(accountsList) {
    // owner - the main address that controls all contracts
    this.owner = accountsList[0];

    // managers - addresses that granted some admin privileges
    this.managerPause = accountsList[1];
    this.managerGeneral = accountsList[2];
    this.managerBlock = accountsList[3];
    this.managerMint = accountsList[4];
    this.managerJNT = accountsList[5];
    this.managerLicense = accountsList[6];
    this.managerForcedTransfer = accountsList[7];
    this.managerJcashReplenisher = accountsList[8];
    this.managerJcashExchange = accountsList[9];

    // addresses that store smth
    this.jntBeneficiary = accountsList[20];

    // testinvestors needed only for the unit tests
    this.testInvestor1 = accountsList[30];
    this.testInvestor2 = accountsList[31];
    this.testInvestor3 = accountsList[32];
  }

  toString() {
    return `owner - "${this.owner}"\n`
      + `managerPause - "${this.managerPause}"`
      + `managerGeneral - "${this.managerGeneral}"`
      + `managerBlock - "${this.managerBlock}"`
      + `managerMint - "${this.managerMint}"`
      + `managerJNT - "${this.managerJNT}"`
      + `managerLicense - "${this.managerLicense}"`
      + `managerForcedTransfer - "${this.managerForcedTransfer}"`
      + `managerJcashReplenisher - "${this.managerJcashReplenisher}"`
      + `managerJcashExchange - "${this.managerJcashExchange}"`
      + `jntBeneficiary - "${this.jntBeneficiary}"`
      + `testInvestor1 - "${this.testInvestor1}"`
      + `testInvestor2 - "${this.testInvestor2}"`
      + `testInvestor3 - "${this.testInvestor3}"`;
  }
}

export function setEthAccounts(accountsList) {
  accounts = new EthereumAccounts(accountsList);
}

export function getEthAccounts(): EthereumAccounts {
  return accounts;
}


/* Nonce tracker - used for the nodes behind the balancer */

let nonceTrackerEnabled = false;

export function isNonceTrackerEnabled() {
  return nonceTrackerEnabled;
}

export function enableNonceTracker() {
  nonceTrackerEnabled = true;
}

export function disableNonceTracker() {
  nonceTrackerEnabled = false;
}
