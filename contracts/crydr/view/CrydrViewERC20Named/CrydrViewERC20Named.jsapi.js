import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrViewAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for named crydr view...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrViewAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_crydr_name',
    'set_crydr_symbol',
    'set_crydr_decimals',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrViewAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of named crydr view granted');
  return null;
};
