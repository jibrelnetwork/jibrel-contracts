import { submitTxAndWaitConfirmation } from '../../../util/SubmitTx';

const CrydrControllerBlockableInterface = global.artifacts.require('CrydrControllerBlockableInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


/* Configuration */

export const blockAccount = async (crydrControllerAddress, managerAddress,
                                   accountAddress) => {
  global.console.log('\tBlock account via CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBlockableInterface
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
    CrydrControllerBlockableInterface
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
    CrydrControllerBlockableInterface
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
    CrydrControllerBlockableInterface
      .at(crydrControllerAddress)
      .unblockAccountFunds
      .sendTransaction,
    [accountAddress, blockedValue, { from: managerAddress }]);
  global.console.log('\tAccount funds successfully unblocked via CryDR controller');
  return null;
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanager - ${managerAddress}`);

  const managerPermissions = [
    'block_account',
    'unblock_account',
    'block_account_funds',
    'unblock_account_funds',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of crydr controller granted');
  return null;
};
