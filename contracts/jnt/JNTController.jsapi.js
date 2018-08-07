import * as ManageableInterfaceJSAPI from '../lifecycle/Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../lifecycle/Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (jntControllerAddress, ownerAddress, jntPayableServiceAddress) => {
  global.console.log('\tConfiguring manager permissions for JNT controller ...');
  global.console.log(`\t\tjntControllerAddress - ${jntControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);

  const managerPermissions = [
    'jnt_payable_service',
  ];

  await ManageableJSAPI.grantManagerPermissions(jntControllerAddress,
                                                ownerAddress,
                                                jntPayableServiceAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of JNT controller granted');
  return null;
};

export const verifyManagerPermissions = async (contractAddress, managerAddress) =>
  ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'jnt_payable_service');
