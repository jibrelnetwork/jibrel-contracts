const Manageable = global.artifacts.require('Manageable.sol');


export const enableManager = (owner, manager, manageableContractAddress) => {
  global.console.log('\tEnable manager of a contract:');
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tmanageableContract - ${manageableContractAddress}`);
  return Manageable
    .at(manageableContractAddress)
    .enableManager
    .sendTransaction(manager, { from: owner })
    .then(() => {
      global.console.log('\tManager successfully enabled');
      return null;
    });
};

export const grantManagerPermissions = (owner, manager, manageableContractAddress, permissionsList) => {
  global.console.log('\tGrant manager permissions:');
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tmanageableContract - ${manageableContractAddress}`);
  global.console.log(`\t\tpermissions - ${JSON.stringify(permissionsList)}`);
  return Promise.all(
    permissionsList.map((permissionName) =>
                          Manageable
                            .at(manageableContractAddress)
                            .grantManagerPermission
                            .sendTransaction(manager, permissionName, { from: owner })),
    )
    .then(() => {
      global.console.log('\tPermissions to the manager successfully granted');
      return null;
    });
};

export const isManagerEnabled = (manager, manageableContractAddress) => {
  global.console.log('\tGet whether manager is enabled');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tmanageableContract - ${manageableContractAddress}`);
  return Manageable
    .at(manageableContractAddress)
    .isManagerEnabled
    .call(manager)
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};

export const isPermissionGranted = (manager, manageableContractAddress, permissionName) => {
  global.console.log('\tGet whether manager is granted with permission');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tmanageableContract - ${manageableContractAddress}`);
  global.console.log(`\t\tpermissionName - ${permissionName}`);
  return Manageable
    .at(manageableContractAddress)
    .isPermissionGranted
    .call(manager, permissionName)
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};

export const isManagerAllowed = (manager, manageableContractAddress, permissionName) => {
  global.console.log('\tGet whether manager is allowed to make an action');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tmanageableContract - ${manageableContractAddress}`);
  global.console.log(`\t\tpermissionName - ${permissionName}`);
  return Manageable
    .at(manageableContractAddress)
    .isManagerAllowed
    .call(manager, permissionName)
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};
