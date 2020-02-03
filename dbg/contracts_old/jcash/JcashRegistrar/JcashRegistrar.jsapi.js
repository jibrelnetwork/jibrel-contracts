import * as ManageableInterfaceJSAPI from '../../lifecycle/Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../../lifecycle/Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantReplenisherPermissions = async (contractAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring replenisher permissions for JcashRegistrarArtifact contract ...');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'replenish_eth',
    'replenish_token',
  ];

  await ManageableJSAPI.grantManagerPermissions(contractAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to replenisher of JcashRegistrarArtifact contract granted');
  return null;
};

export const verifyReplenisherPermissions = async (contractAddress, managerAddress) => {
  const isAllowed01 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'replenish_eth');
  const isAllowed02 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'replenish_token');
  return (isAllowed01 === true
    && isAllowed02 === true);
};


export const grantExchangeManagerPermissions = async (contractAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring exchange manager permissions for JcashRegistrarArtifact contract ...');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'refund_eth',
    'refund_token',
    'transfer_eth',
    'transfer_token',
  ];

  await ManageableJSAPI.grantManagerPermissions(contractAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to exchange manager of JcashRegistrarArtifact contract granted');
  return null;
};

export const verifyExchangeManagerPermissions = async (contractAddress, managerAddress) => {
  const isAllowed01 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'refund_eth');
  const isAllowed02 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'refund_token');
  const isAllowed03 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'transfer_eth');
  const isAllowed04 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'transfer_token');
  return (isAllowed01 === true
    && isAllowed02 === true
    && isAllowed03 === true
    && isAllowed04 === true);
};
