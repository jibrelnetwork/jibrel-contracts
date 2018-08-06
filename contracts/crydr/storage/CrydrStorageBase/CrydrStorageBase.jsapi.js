import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';


export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr storage ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanager - ${managerAddress}`);

  const managerPermissions = [
    'set_crydr_controller',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of crydr storage granted');
  return null;
};

