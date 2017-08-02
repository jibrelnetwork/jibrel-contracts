import { SubmitTxAndWaitConfirmation } from './utils/SubmitTx';

const Manageable = global.artifacts.require('Manageable.sol');


export const enableManager = async (contractAddress, owner, manager) => {
  global.console.log('\tEnable manager of a contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await SubmitTxAndWaitConfirmation(
    Manageable
      .at(contractAddress)
      .enableManager
      .sendTransaction,
    [manager, { from: owner }]);
  global.console.log('\tManager successfully enabled');
};

export const grantManagerPermissions = async (contractAddress, owner, manager, permissionsList) => {
  global.console.log('\tGrant manager permissions:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tpermissions - ${JSON.stringify(permissionsList)}`);
  await Promise.all(
    permissionsList.map((permissionName) =>
                          SubmitTxAndWaitConfirmation(
                            Manageable
                              .at(contractAddress)
                              .grantManagerPermission
                              .sendTransaction,
                            [manager, permissionName, { from: owner }])));
  global.console.log('\tPermissions to the manager successfully granted');
};

export const isManagerEnabled = (contractAddress, manager) => {
  global.console.log('\tGet whether manager is enabled');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  return Manageable
    .at(contractAddress)
    .isManagerEnabled
    .call(manager)
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};

export const isPermissionGranted = (contractAddress, manager, permissionName) => {
  global.console.log('\tGet whether manager is granted with permission');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tpermissionName - ${permissionName}`);
  return Manageable
    .at(contractAddress)
    .isPermissionGranted
    .call(manager, permissionName)
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};

export const isManagerAllowed = (contractAddress, manager, permissionName) => {
  global.console.log('\tGet whether manager is allowed to make an action');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tpermissionName - ${permissionName}`);
  return Manageable
    .at(contractAddress)
    .isManagerAllowed
    .call(manager, permissionName)
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};
