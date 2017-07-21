const InvestorRegistry                    = global.artifacts.require('InvestorRegistry.sol');
const InvestorRegistryManagementInterface = global.artifacts.require('InvestorRegistryManagementInterface.sol');

const deploymentController = require('../deployment_controller');

const ManageableRoutines = require('./Manageable');


/* Migration promises */

export const deployInvestorRegistryContract = (network, owner) => {
  global.console.log('\tDeploying InvestorRegistry ...');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\towner - ${owner}`);
  return InvestorRegistry.new({ from: owner })
    .then((value) => {
      global.console.log(`\tInvestorRegistry successfully deployed: ${value.address}`);
      deploymentController.setInvestorRegistryAddress(network, value.address);
      return null;
    });
};

export const enableManager = (network, owner, manager) => {
  global.console.log('\tEnable manager of InvestorRegistry');
  return ManageableRoutines
    .enableManager(owner, manager, deploymentController.getInvestorRegistryAddress(network));
};

export const grantManagerPermissions = (network, owner, manager) => {
  global.console.log('\tGrant permissions to manager of InvestorRegistry');
  const permissions = [
    'admit_investor',
    'deny_investor',
    'grant_license',
    'renew_license',
    'cancel_license'];
  return ManageableRoutines
    .grantManagerPermissions(owner, manager,
                             deploymentController.getInvestorRegistryAddress(network),
                             permissions);
};

export const admitInvestor = (network, manager, investorAddress) => {
  global.console.log('\tAdmit investor:');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tinvestorAddress - ${investorAddress}`);
  return InvestorRegistryManagementInterface
    .at(deploymentController.getInvestorRegistryAddress(network))
    .admitInvestor
    .sendTransaction(investorAddress, { from: manager })
    .then(() => {
      global.console.log('\tInvestor successfully admitted');
      return null;
    });
};

export const grantInvestorLicenses = (network, manager, investorAddress, licenseName, expireTimestamp) => {
  global.console.log('\tGrant license to investor:');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tinvestorAddress - ${investorAddress}`);
  global.console.log(`\t\tlicenseName - ${licenseName}`);
  global.console.log(`\t\texpireTimestamp - ${expireTimestamp}`);
  return InvestorRegistryManagementInterface
    .at(deploymentController.getInvestorRegistryAddress(network))
    .grantInvestorLicense
    .sendTransaction(investorAddress, licenseName, expireTimestamp, { from: manager })
    .then(() => {
      global.console.log('\tInvestor successfully granted');
      return null;
    });
};

export const registerInvestor = (network, manager, investorAddress, licensesNames, expireTimestamp) => {
  global.console.log(`\tRegister investor - admit him and grant ${licensesNames.length} licenses`);
  return admitInvestor(network, manager, investorAddress)
    .then(() => Promise.all(
      licensesNames.map(
        (licenseName) => grantInvestorLicenses(network, manager, investorAddress, licenseName, expireTimestamp))))
    .then(() => {
      global.console.log('\tInvestor successfully registered');
      return null;
    });
};

export const verifyRegistryManager = (network, manager) => {
  global.console.log('\tVerify InvestorRegistry manager');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\tmanager - ${manager}`);
  return ManageableRoutines.isManagerEnabled(manager, deploymentController.getInvestorRegistryAddress(network))
    .then((value) => {
      if (value !== true) { throw new Error('Expected that manager is enabled'); }
      return null;
    })
    .then(() => ManageableRoutines
      .isPermissionGranted(manager, deploymentController.getInvestorRegistryAddress(network), 'admit_investor'))
    .then((value) => {
      if (value !== true) { throw new Error('Expected that manager is granted with permission "admit_investor"'); }
      return null;
    })
    .then(() => ManageableRoutines
      .isPermissionGranted(manager, deploymentController.getInvestorRegistryAddress(network), 'deny_investor'))
    .then((value) => {
      if (value !== true) { throw new Error('Expected that manager is granted with permission "deny_investor"'); }
      return null;
    })
    .then(() => ManageableRoutines
      .isPermissionGranted(manager, deploymentController.getInvestorRegistryAddress(network), 'grant_license'))
    .then((value) => {
      if (value !== true) { throw new Error('Expected that manager is granted with permission "grant_license"'); }
      return null;
    })
    .then(() => ManageableRoutines
      .isPermissionGranted(manager, deploymentController.getInvestorRegistryAddress(network), 'renew_license'))
    .then((value) => {
      if (value !== true) { throw new Error('Expected that manager is granted with permission "renew_license"'); }
      return null;
    })
    .then(() => ManageableRoutines
      .isPermissionGranted(manager, deploymentController.getInvestorRegistryAddress(network), 'cancel_license'))
    .then((value) => {
      if (value !== true) { throw new Error('Expected that manager is granted with permission "cancel_license"'); }
      return null;
    })
    .then(() => {
      global.console.log('\tManager of InvestorRegistry successfully verified');
      return null;
    });
};
