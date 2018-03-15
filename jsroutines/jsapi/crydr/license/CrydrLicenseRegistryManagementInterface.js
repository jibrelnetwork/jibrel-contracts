import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const CrydrLicenseRegistryManagementInterface = global.artifacts.require('CrydrLicenseRegistryManagementInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


/**
 * Configuration
 */

export const admitUser = async (licenseRegistryAddress, managerAddress,
                                userAddress) => {
  global.console.log('\tAdmit user:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrLicenseRegistryManagementInterface
      .at(licenseRegistryAddress)
      .admitUser
      .sendTransaction,
    [userAddress, { from: managerAddress }]);
  global.console.log('\tUser successfully admitted');
};

export const denyUser = async (licenseRegistryAddress, managerAddress,
                               userAddress) => {
  global.console.log('\tDeny user:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrLicenseRegistryManagementInterface
      .at(licenseRegistryAddress)
      .denyUser
      .sendTransaction,
    [userAddress, { from: managerAddress }]);
  global.console.log('\tUser successfully denied');
};

export const grantUserLicense = async (licenseRegistryAddress, managerAddress,
                                       userAddress, licenseName, expirationTimestamp) => {
  global.console.log('\tGrant user license:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  global.console.log(`\t\tlicenseName - ${licenseName}`);
  global.console.log(`\t\texpirationTimestamp - ${expirationTimestamp}`);
  await submitTxAndWaitConfirmation(
    CrydrLicenseRegistryManagementInterface
      .at(licenseRegistryAddress)
      .grantUserLicense
      .sendTransaction,
    [userAddress, licenseName, expirationTimestamp, { from: managerAddress }]);
  global.console.log('\tUser license successfully granted');
};

export const renewUserLicense = async (licenseRegistryAddress, managerAddress,
                                       userAddress, licenseName, expirationTimestamp) => {
  global.console.log('\tRenew user license:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  global.console.log(`\t\tlicenseName - ${licenseName}`);
  global.console.log(`\t\texpirationTimestamp - ${expirationTimestamp}`);
  await submitTxAndWaitConfirmation(
    CrydrLicenseRegistryManagementInterface
      .at(licenseRegistryAddress)
      .renewUserLicense
      .sendTransaction,
    [userAddress, licenseName, expirationTimestamp, { from: managerAddress }]);
  global.console.log('\tUser license successfully renewed');
};

export const revokeUserLicense = async (licenseRegistryAddress, managerAddress,
                                       userAddress, licenseName) => {
  global.console.log('\tRevoke user license:');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tuserAddress - ${userAddress}`);
  global.console.log(`\t\tlicenseName - ${licenseName}`);
  await submitTxAndWaitConfirmation(
    CrydrLicenseRegistryManagementInterface
      .at(licenseRegistryAddress)
      .revokeUserLicense
      .sendTransaction,
    [userAddress, licenseName, { from: managerAddress }]);
  global.console.log('\tUser license successfully revoked');
};


/**
 * Events
 */

export const getUserAdmittedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterface
    .at(contractAddress)
    .UserAdmittedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUserDeniedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterface
    .at(contractAddress)
    .UserDeniedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUserLicenseGrantedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterface
    .at(contractAddress)
    .UserLicenseGrantedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUserLicenseRenewedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterface
    .at(contractAddress)
    .UserLicenseRenewedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUserLicenseRevokedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrLicenseRegistryManagementInterface
    .at(contractAddress)
    .UserLicenseRevokedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for license registry ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanager - ${managerAddress}`);

  const managerPermissions = [
    'admit_user',
    'deny_user',
    'grant_license',
    'renew_license',
    'revoke_license',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of license registry granted');
  return null;
};

