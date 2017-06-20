/* eslint-disable no-console */


const InvestorRepository = artifacts.require('InvestorRepository.sol');
const CryDRRepository    = artifacts.require('CryDRRepository.sol');
const jUSD               = artifacts.require('jUSD.sol');
const jEUR               = artifacts.require('jEUR.sol');
const jTBill             = artifacts.require('jTBill.sol');
const JibrelAPI          = artifacts.require('JibrelAPI.sol');


module.exports = (deployer, network, accounts) => {
  const owner   = accounts[0];
  const manager = accounts[1];

  const deploymentController = require('./deployment_controller');


  /* Generators of promises */

  const deployInvestorsRepositoryContract              = () => {
    console.log('  Deploying InvestorsRepository ...');
    return InvestorRepository.new({ from: owner, gas: 4500000 });
  };
  const processDeploymentOfInvestorsRepositoryContract = (value) => {
    console.log(`  InvestorRepository successfully deployed: ${value.address}`);
    deploymentController.setAddress(network, 'investorsRepoAddress', value.address);
  };

  const deployCrydrRepositoryContract              = () => {
    console.log('  Deploying CryDRRepository ...');
    return CryDRRepository.new({ from: owner, gas: 4500000 });
  };
  const processDeploymentOfCrydrRepositoryContract = (value) => {
    console.log(`  CryDRRepository successfully deployed: ${value.address}`);
    deploymentController.setAddress(network, 'crydrRepoAddress', value.address);
  };

  const deployJibrelAPIContract              = () => {
    console.log('  Deploying JibrelAPI ...');
    return JibrelAPI.new(owner,
                         owner,
                         deploymentController.getAddress(network, 'investorsRepoAddress'),
                         deploymentController.getAddress(network, 'crydrRepoAddress'),
                         { from: owner, gas: 4500000 });
  };
  const processDeploymentOfJibrelAPIContract = (value) => {
    console.log(`  JibrelAPI successfully deployed: ${value.address}`);
    deploymentController.setAddress(network, 'jibrelAPIAddress', value.address);
  };

  const grantInvestorRepoPermissionsToManager = () => {
    console.log('  Grant permissions to manager from Investors repo ...');
    const investorsRepo = InvestorRepository.at(deploymentController.getAddress(network, 'investorsRepoAddress'));
    return Promise.all(
      [
        investorsRepo.enableManager.sendTransaction(manager, { from: owner, gas: 500000 }),
        investorsRepo.grantManagerPermission.sendTransaction(manager, 'enable_investor', { from: owner, gas: 500000 }),
        investorsRepo.grantManagerPermission.sendTransaction(manager, 'disable_investor', { from: owner, gas: 500000 }),
        investorsRepo.grantManagerPermission.sendTransaction(manager, 'grant_license', { from: owner, gas: 500000 }),
        investorsRepo.grantManagerPermission.sendTransaction(manager, 'cancel_license', { from: owner, gas: 500000 }),
      ]);
  };
  const grantCrydrRepoPermissionsToManager    = () => {
    console.log('  Grant permissions to manager from CryDRs repo ...');
    console.log(deploymentController.getAddress(network, 'crydrRepoAddress'));
    const crydrRepo = CryDRRepository.at(deploymentController.getAddress(network, 'crydrRepoAddress'));
    return Promise.all(
      [
        crydrRepo.enableManager.sendTransaction(manager, { from: owner, gas: 500000 }),
        crydrRepo.grantManagerPermission.sendTransaction(manager, 'add_crydr', { from: owner, gas: 500000 }),
        crydrRepo.grantManagerPermission.sendTransaction(manager, 'remove_crydr', { from: owner, gas: 500000 }),
      ]);
  };


  /* Start migration */

  console.log('  Start migration');
  deployer.then(() => deployInvestorsRepositoryContract())
    .then((value) => {
      processDeploymentOfInvestorsRepositoryContract(value);
      return deployCrydrRepositoryContract();
    })
    .then((value) => {
      processDeploymentOfCrydrRepositoryContract(value);
      return deployJibrelAPIContract();
    })
    .then((value) => {
      processDeploymentOfJibrelAPIContract(value);
      return grantInvestorRepoPermissionsToManager();
    })
    .then(() => grantCrydrRepoPermissionsToManager())
    .then(() => {
      deploymentController.logStorage(network);
    });
};
