import { submitTxAndWaitConfirmation } from '../misc/SubmitTx';

const InvestorRegistry                    = global.artifacts.require('InvestorRegistry.sol');
const InvestorRegistryManagementInterface = global.artifacts.require('InvestorRegistryManagementInterface.sol');

const ManageableRoutines = require('../lifecycle/Manageable');


/* Deploy contract */

export const deployInvestorRegistryContract = async (deployer, owner) => {
  global.console.log('\tDeploying InvestorRegistry ...');
  global.console.log(`\t\towner - ${owner}`);
  await deployer.deploy(InvestorRegistry, { from: owner });
  return null;
};

export const enableManager = (investorRegistryAddress, owner, manager) => {
  global.console.log('\tEnable manager of InvestorRegistry');
  return ManageableRoutines.enableManager(investorRegistryAddress, owner, manager);
};

export const grantManagerPermissions = (investorRegistryAddress, owner, manager) => {
  global.console.log('\tGrant permissions to manager of InvestorRegistry');
  const permissions = [
    'admit_investor',
    'deny_investor',
    'grant_license',
    'renew_license',
    'cancel_license'];
  return ManageableRoutines.grantManagerPermissions(investorRegistryAddress, owner, manager, permissions);
};


/* Add investor */

export const admitInvestor = async (investorRegistryAddress, manager, investorAddress) => {
  global.console.log('\tAdmit investor:');
  global.console.log(`\t\tregistryAddress - ${investorRegistryAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tinvestorAddress - ${investorAddress}`);
  await submitTxAndWaitConfirmation(
    InvestorRegistryManagementInterface
      .at(investorRegistryAddress)
      .admitInvestor
      .sendTransaction,
    [investorAddress, { from: manager }]
  );
  global.console.log('\tInvestor successfully admitted');
  return null;
};

export const grantInvestorLicenses = async (investorRegistryAddress, manager, investorAddress, licenseName, expireTimestamp) => {
  global.console.log('\tGrant license to investor:');
  global.console.log(`\t\tinvestorRegistryAddress - ${investorRegistryAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tinvestorAddress - ${investorAddress}`);
  global.console.log(`\t\tlicenseName - ${licenseName}`);
  global.console.log(`\t\texpireTimestamp - ${expireTimestamp}`);
  await submitTxAndWaitConfirmation(
    InvestorRegistryManagementInterface
      .at(investorRegistryAddress)
      .grantInvestorLicense
      .sendTransaction,
    [investorAddress, licenseName, expireTimestamp, { from: manager }]
  );
};

export const registerInvestor = async (investorRegistryAddress, manager,
                                       investorAddress, licensesNames, expireTimestamp) => {
  global.console.log(`\tRegister investor - admit him and grant ${licensesNames.length} licenses`);
  await admitInvestor(investorRegistryAddress, manager, investorAddress);
  await Promise.all(licensesNames.map(
    (licenseName) => grantInvestorLicenses(investorRegistryAddress, manager,
                                           investorAddress, licenseName, expireTimestamp)));
  global.console.log('\tInvestor successfully registered');
  return null;
};


/* Verify deployment of contract */

export const verifyRegistryManager = async (investorRegistryAddress, manager) => {
  global.console.log('\tVerify InvestorRegistry manager');
  global.console.log(`\t\tinvestorRegistryAddress - ${investorRegistryAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);

  const isEnabled = await ManageableRoutines.isManagerEnabled(investorRegistryAddress, manager);
  if (isEnabled !== true) { throw new Error('Expected that manager is enabled'); }

  let isGranted = await ManageableRoutines
    .isPermissionGranted(investorRegistryAddress, manager, 'admit_investor');
  if (isGranted !== true) { throw new Error('Expected that manager is granted with permission "admit_investor"'); }

  isGranted = await ManageableRoutines
    .isPermissionGranted(investorRegistryAddress, manager, 'deny_investor');
  if (isGranted !== true) { throw new Error('Expected that manager is granted with permission "deny_investor"'); }

  isGranted = await ManageableRoutines
    .isPermissionGranted(investorRegistryAddress, manager, 'grant_license');
  if (isGranted !== true) { throw new Error('Expected that manager is granted with permission "grant_license"'); }

  isGranted = await ManageableRoutines
    .isPermissionGranted(investorRegistryAddress, manager, 'renew_license');
  if (isGranted !== true) { throw new Error('Expected that manager is granted with permission "renew_license"'); }

  isGranted = await ManageableRoutines
    .isPermissionGranted(investorRegistryAddress, manager, 'cancel_license');
  if (isGranted !== true) { throw new Error('Expected that manager is granted with permission "cancel_license"'); }

  global.console.log('\tManager of InvestorRegistry successfully verified');
  return null;
};
