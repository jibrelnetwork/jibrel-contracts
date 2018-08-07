import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (contractAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for the contract that is able to store metadata ...');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_metadata',
  ];

  await ManageableJSAPI.grantManagerPermissions(contractAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of a contract that is able to store metadata granted');
  return null;
};
