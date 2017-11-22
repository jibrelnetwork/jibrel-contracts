let deployer;
let accounts;


export function setDeployer(deployerObj) {
  deployer = deployerObj;
}

export function getDeployer() {
  return deployer;
}


export function setAccounts(accountsList) {
  accounts = {
    owner:          accountsList[0],
    managerPause:   accountsList[1],
    managerGeneral: accountsList[2],
    managerBlock:   accountsList[3],
    managerMint:    accountsList[4],
    managerJNT:     accountsList[5], // allowed to configure jntBeneficiary of crydr controllers
    jntBeneficiary: accountsList[6],
    testInvestor1:  accountsList[7],
    testInvestor2:  accountsList[8],
    testInvestor3:  accountsList[9],
  };
}

export function getAccounts() {
  return accounts;
}
