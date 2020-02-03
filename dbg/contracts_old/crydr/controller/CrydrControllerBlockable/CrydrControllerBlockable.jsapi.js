import * as ManageableInterfaceJSAPI from '../../../lifecycle/Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';


export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanager - ${managerAddress}`);

  const managerPermissions = [
    'block_account',
    'unblock_account',
    'block_account_funds',
    'unblock_account_funds',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of crydr controller granted');
  return null;
};

export const verifyManagerPermissions = async (contractAddress, managerAddress) => {
  const isAllowed01 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'block_account');
  const isAllowed02 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'unblock_account');
  const isAllowed03 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'block_account_funds');
  const isAllowed04 = await ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'unblock_account_funds');
  return (isAllowed01 === true
    && isAllowed02 === true
    && isAllowed03 === true
    && isAllowed04 === true);
};
