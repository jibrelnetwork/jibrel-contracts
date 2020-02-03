import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (jntViewAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr view ...');
  global.console.log(`\t\tjntViewAddress - ${jntViewAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_crydr_controller',
  ];

  await ManageableJSAPI.grantManagerPermissions(jntViewAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of crydr view granted');
  return null;
};
