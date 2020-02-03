import * as ManageableInterfaceJSAPI from '../../../lifecycle/Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_crydr_storage',
    'set_crydr_view',
    'remove_crydr_view',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of crydr controller granted');
  return null;
};

export const verifyManagerPermissions = async (contractAddress, managerAddress) => {
  const isAllowed01 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'set_crydr_storage');
  const isAllowed02 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'set_crydr_view');
  const isAllowed03 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'remove_crydr_view');
  return (isAllowed01 === true
    && isAllowed02 === true
    && isAllowed03 === true);
};
