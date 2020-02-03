import { submitTxAndWaitConfirmation } from '../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrLicenseRegistryManagementInterfaceArtifact = global.artifacts.require('CrydrLicenseRegistryManagementInterface.sol');


/**
 * Configuration
 */

export const admitUser = async (licenseRegistryAddress, managerAddress,
                                userAddress) => {
  global.console.log('\tAdmit user:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrLicenseRegistryManagementInterfaceArtifact
  //     .at(licenseRegistryAddress)
  //     .admitUser
  //     .sendTransaction,
  //   [userAddress],
  //   { from: managerAddress }
  // );
  let instance = await CrydrLicenseRegistryManagementInterfaceArtifact.at(licenseRegistryAddress);
  await instance.admitUser(userAddress,  {from: managerAddress });
  global.console.log('\tUser successfully admitted');
};

export const denyUser = async (licenseRegistryAddress, managerAddress,
                               userAddress) => {
  global.console.log('\tDeny user:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrLicenseRegistryManagementInterfaceArtifact
  //     .at(licenseRegistryAddress)
  //     .denyUser
  //     .sendTransaction,
  //   [userAddress],
  //   { from: managerAddress }
  // );
  let instance = await CrydrLicenseRegistryManagementInterfaceArtifact.at(licenseRegistryAddress);
  await instance.admitUser(userAddress,  {from: managerAddress });
  global.console.log('\tUser successfully denied');
};

export const isUserAdmitted = async (contractAddress, userAddress) => {
  global.console.log('\tFetch whether user is admitted to a crydr contracts or not');
  const result = await CrydrLicenseRegistryManagementInterfaceArtifact.at(contractAddress).isUserAdmitted.call(userAddress);
  global.console.log(`\t\tResult: ${result}`);
  return result;
};


export const grantUserLicense = async (licenseRegistryAddress, managerAddress,
                                       userAddress, licenseName) => {
  global.console.log('\tGrant user license:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  global.console.log(`\t\tlicenseName - ${licenseName}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrLicenseRegistryManagementInterfaceArtifact
  //     .at(licenseRegistryAddress)
  //     .grantUserLicense
  //     .sendTransaction,
  //   [userAddress, licenseName],
  //   { from: managerAddress }
  // );
  let instance = await CrydrLicenseRegistryManagementInterfaceArtifact.at(licenseRegistryAddress);
  await instance.grantUserLicense(userAddress, licenseName, {from: managerAddress });
  global.console.log('\tUser license successfully granted');
};

export const revokeUserLicense = async (licenseRegistryAddress, managerAddress,
                                       userAddress, licenseName) => {
  global.console.log('\tRevoke user license:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  global.console.log(`\t\tlicenseName - ${licenseName}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrLicenseRegistryManagementInterfaceArtifact
  //     .at(licenseRegistryAddress)
  //     .revokeUserLicense
  //     .sendTransaction,
  //   [userAddress, licenseName],
  //   { from: managerAddress }
  // );
  let instance = await CrydrLicenseRegistryManagementInterfaceArtifact.at(licenseRegistryAddress);
  await instance.revokeUserLicense(userAddress, licenseName, {from: managerAddress });
  global.console.log('\tUser license successfully revoked');
};

export const isUserGranted = async (contractAddress, userAddress, licenseName) => {
  global.console.log('\tFetch whether user is granted permission for a given action to a crydr contracts or not');
  const result = await CrydrLicenseRegistryManagementInterfaceArtifact.at(contractAddress).isUserGranted.call(userAddress, licenseName);
  global.console.log(`\t\tResult: ${result}`);
  return result;
};


/**
 * Events
 */

export const getUserAdmittedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterfaceArtifact
    .at(contractAddress)
    .UserAdmittedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUserDeniedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterfaceArtifact
    .at(contractAddress)
    .UserDeniedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUserLicenseGrantedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterfaceArtifact
    .at(contractAddress)
    .UserLicenseGrantedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUserLicenseRenewedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterfaceArtifact
    .at(contractAddress)
    .UserLicenseRenewedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUserLicenseRevokedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterfaceArtifact
    .at(contractAddress)
    .UserLicenseRevokedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
