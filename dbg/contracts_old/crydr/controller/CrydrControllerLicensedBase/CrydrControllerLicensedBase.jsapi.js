import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';
import * as ManageableInterfaceJSAPI from '../../../lifecycle/Manageable/ManageableInterface.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for licensed crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_license_registry',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of licensed crydr controller granted');
  return null;
};

export const verifyManagerPermissions = async (contractAddress, managerAddress) =>
  ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'set_license_registry');
