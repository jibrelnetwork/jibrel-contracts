// @flow

let deployer;
let accounts;


export function setDeployer(deployerObj) {
  deployer = deployerObj;
}

export function getDeployer() {
  return deployer;
}


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
