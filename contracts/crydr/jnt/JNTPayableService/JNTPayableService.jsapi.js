import * as ManageableInterfaceJSAPI from '../../../lifecycle/Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (jntPayableServiceAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for JNT payable service ...');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_jnt_controller',
    'set_jnt_beneficiary',
    'set_action_price',
  ];

  await ManageableJSAPI.grantManagerPermissions(jntPayableServiceAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of JNT payable service granted');
  return null;
};

export const verifyManagerPermissions = async (contractAddress, managerAddress) => {
  const isAllowed01 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'set_jnt_controller');
  const isAllowed02 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'set_jnt_beneficiary');
  const isAllowed03 = await ManageableInterfaceJSAPI.isManagerAllowed(contractAddress, managerAddress, 'set_action_price');

  return (isAllowed01 === true
    && isAllowed02 === true
    && isAllowed03 === true);
};
