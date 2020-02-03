import * as ManageableInterfaceJSAPI from '../Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (contractAddress, ownerAddress, managerPauseAddress) => {
  global.console.log('\tConfiguring manager permissions for pausable contract ...');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerPauseAddress - ${managerPauseAddress}`);

  const managerPermissions = [
    'pause_contract',
    'unpause_contract',
  ];

  await ManageableJSAPI.grantManagerPermissions(contractAddress,
                                                ownerAddress,
                                                managerPauseAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of pausable contract granted');
  return null;
};

export const verifyManagerPermissions = async (contractAddress, managerAddress) => {
  const isAllowed01 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'pause_contract');
  const isAllowed02 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'unpause_contract');
  return (isAllowed01 === true
    && isAllowed02 === true);
};
