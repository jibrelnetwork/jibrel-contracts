let deployer;
let accounts;

export function setDeployer(newDeployer) {
  deployer = newDeployer;
}

export function getDeployer() {
  return deployer;
}

export function setAccounts(newAccounts) {
  accounts = {
    owner:          newAccounts[0],
    managerPause:   newAccounts[1],
    managerGeneral: newAccounts[2],
    managerBlock:   newAccounts[3],
    managerMint:    newAccounts[4],
    managerJNT:     newAccounts[5], // allowed to configure jntBeneficiary of crydr controllers
    jntBeneficiary: newAccounts[6],
    testInvestor1:  newAccounts[7],
    testInvestor2:  newAccounts[8],
    testInvestor3:  newAccounts[9],
  };
}

export function getAccounts(newAccounts) {
  if (newAccounts) {
    setAccounts(newAccounts);
  }

  return accounts;
}
