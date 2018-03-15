const CrydrLicenseRegistryManagementInterfaceJSAPI = require('../../crydr/license/CrydrLicenseRegistryManagementInterface');


/**
 * User licenses
 */

// eslint-disable-next-line
export const licenseUser = async (licenseRegistryAddress, managerAddress,
                                  userAddress, expirationTimestamp) => {
  global.console.log('\tAdmit and grant all ERC20 licenses to an user:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  global.console.log(`\t\texpirationTimestamp - ${expirationTimestamp}`);

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
                                             userAddress, licenseName, expirationTimestamp));
  promisesList.push(
    CrydrLicenseRegistryManagementInterfaceJSAPI
      .admitUser(licenseRegistryAddress, managerAddress, userAddress));
  await Promise.all(promisesList);

  global.console.log('\tUser successfully admitted and all ERC20 licenses are granted');
};
