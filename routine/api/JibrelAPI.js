const JibrelAPI        = global.artifacts.require('JibrelAPI.sol');
const InvestorRegistry = global.artifacts.require('InvestorRegistry.sol');
const CryDRRegistry    = global.artifacts.require('CryDRRegistry.sol');

const ManageableRoutines   = require('../lifecycle/Manageable');


/* Migration promises */

export const deployJibrelAPIContract = async (deployer, owner) => {
  global.console.log('  Deploying JibrelAPI ...');
  global.console.log(`\t\towner - ${owner}`);

  const investorRegistryInstance = await InvestorRegistry.deployed();
  const crydrRegistryInstance = await CryDRRegistry.deployed();

  await deployer.deploy(JibrelAPI,
                        owner, // todo change it to BODC address
                        owner, // todo change it to JibrelDAO address
                        investorRegistryInstance.address,
                        crydrRegistryInstance.address,
                        { from: owner });
  return null;
};

export const enableManager = (contractAddress, owner, manager) => {
  global.console.log('\tEnable manager of JibrelAPI ...');
  return ManageableRoutines.enableManager(contractAddress, owner, manager);
};

export const grantManagerPermissions = (contractAddress, owner, manager) => {
  global.console.log('\tGrant permissions to manager of JibrelAPI ...');
  const permissions = [
    'set_bodc',
    'set_jibrel_dao',
    'set_investor_repo',
    'set_crydr_repo'];
  return ManageableRoutines.grantManagerPermissions(contractAddress, owner, manager, permissions);
};
