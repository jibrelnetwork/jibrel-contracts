import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const CrydrControllerBlockableInterfaceArtifact = global.artifacts.require('CrydrControllerBlockableInterface.sol');


/* Configuration */

export const blockAccount = async (crydrControllerAddress, managerAddress,
                                   accountAddress) => {
  global.console.log('\tBlock account via CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBlockableInterfaceArtifact
      .at(crydrControllerAddress)
      .blockAccount
      .sendTransaction,
    [accountAddress, { from: managerAddress }]);
  global.console.log('\tAccount successfully blocked via CryDR controller');
  return null;
};

export const unblockAccount = async (crydrControllerAddress, managerAddress,
                                     accountAddress) => {
  global.console.log('\tUnblock account via CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanager - ${managerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBlockableInterfaceArtifact
      .at(crydrControllerAddress)
      .unblockAccount
      .sendTransaction,
    [accountAddress, { from: managerAddress }]);
  global.console.log('\tAccount successfully unblocked via CryDR controller');
  return null;
};


export const blockAccountFunds = async (crydrControllerAddress, managerAddress,
                                        accountAddress, blockedValue) => {
  global.console.log('\tBlock account funds via CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tblockedValue - ${blockedValue}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBlockableInterfaceArtifact
      .at(crydrControllerAddress)
      .blockAccount
      .sendTransaction,
    [accountAddress, blockedValue, { from: managerAddress }]);
  global.console.log('\tAccount funds successfully blocked via CryDR controller');
  return null;
};

export const unblockAccountFunds = async (crydrControllerAddress, managerAddress,
                                          accountAddress, blockedValue) => {
  global.console.log('\tUnblock account funds via CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tblockedValue - ${blockedValue}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBlockableInterfaceArtifact
      .at(crydrControllerAddress)
      .unblockAccountFunds
      .sendTransaction,
    [accountAddress, blockedValue, { from: managerAddress }]);
  global.console.log('\tAccount funds successfully unblocked via CryDR controller');
  return null;
};
