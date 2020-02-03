import * as CrydrLicenseRegistryInterfaceJSAPI from '../../license/CrydrLicenseRegistryInterface.jsapi';
import * as CrydrLicenseRegistryManagementInterfaceJSAPI from '../../license/CrydrLicenseRegistryManagementInterface.jsapi';


/**
 * User licenses
 */

// eslint-disable-next-line
export const grantUserLicensesAndAdmit = async (licenseRegistryAddress, managerAddress, userAddress) => {
  global.console.log('\tAdmit and grant all ERC20 licenses to an user:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);

  const licenseNamesList = [
    'transfer_funds',
    'receive_funds',
    'grant_approval',
    'get_approval',
    'spend_funds',
  ];

  const promisesList = licenseNamesList.map((licenseName) =>
                         CrydrLicenseRegistryManagementInterfaceJSAPI
                           .grantUserLicense(licenseRegistryAddress, managerAddress,
                                             userAddress, licenseName));
  promisesList.push(
    CrydrLicenseRegistryManagementInterfaceJSAPI
      .admitUser(licenseRegistryAddress, managerAddress, userAddress));
  await Promise.all(promisesList);

  global.console.log('\tUser successfully admitted and all ERC20 licenses are granted');
};

export const verifyUserLicenses = async (contractAddress, userAddress) => {
  const isAllowed01 = await CrydrLicenseRegistryInterfaceJSAPI.verifyUserLicense(contractAddress, userAddress, 'transfer_funds');
  const isAllowed02 = await CrydrLicenseRegistryInterfaceJSAPI.verifyUserLicense(contractAddress, userAddress, 'receive_funds');
  const isAllowed03 = await CrydrLicenseRegistryInterfaceJSAPI.verifyUserLicense(contractAddress, userAddress, 'grant_approval');
  const isAllowed04 = await CrydrLicenseRegistryInterfaceJSAPI.verifyUserLicense(contractAddress, userAddress, 'get_approval');
  const isAllowed05 = await CrydrLicenseRegistryInterfaceJSAPI.verifyUserLicense(contractAddress, userAddress, 'spend_funds');
  return (isAllowed01 === true
    && isAllowed02 === true
    && isAllowed03 === true
    && isAllowed04 === true
    && isAllowed05 === true);
};
