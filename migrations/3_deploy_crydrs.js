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
  deploymentController.getAddress(network, 'investorsRepoAddress');
  deploymentController.getAddress(network, 'crydrRepoAddress');
  deploymentController.getAddress(network, 'jibrelAPIAddress');


  /* Deploy CryDR */

  const deployNoLicenseCrydr = (crydr, crydrName) => {
    console.log(`  Start to deploy CryDR "${crydrName}"`);
    return crydr.new({ from: owner, gas: 4500000 });
  };

  const deployLicensedCrydr = (crydr, crydrName) => {
    console.log(`  Start to deploy CryDR "${crydrName}"`);
    return crydr.new(deploymentController.getAddress(network, 'investorsRepoAddress'), { from: owner, gas: 4500000 });
  };

  const processCrydrDeployment = (value, crydrName, storageAddressName) => {
    console.log(`  CryDR "${crydrName}" successfully deployed: ${value.address}`);
    deploymentController.setAddress(network, storageAddressName, value.address);
  };

  const deployCryDRs = () => deployNoLicenseCrydr(jUSD, 'jUSD')
    .then((value) => {
      processCrydrDeployment(value, 'jUSD', 'jUSDTokenAddress');
      return deployNoLicenseCrydr(jEUR, 'jEUR');
    })
    .then((value) => {
      processCrydrDeployment(value, 'jEUR', 'jEURTokenAddress');
      return deployLicensedCrydr(jTBill, 'jTBill');
    })
    .then((value) => {
      processCrydrDeployment(value, 'jTBill', 'jTBillTokenAddress');
    });


  /* Register CryDR */

  const registerCrydr = (crydrName, crydrSymbol, crydrStorageAddressName) => {
    console.log(`  Register CryDR '${crydrName}' '${crydrSymbol}' `);
    const crydrRepo    = CryDRRepository.at(deploymentController.getAddress(network, 'crydrRepoAddress'));
    const crydrAddress = deploymentController.getAddress(network, crydrStorageAddressName);
    return crydrRepo.addCryDR.sendTransaction(crydrAddress, crydrName, crydrSymbol, { from: manager, gas: 500000 });
  };

  const registerCryDRs = () => {
    console.log('  Register CryDRs ...');

    return registerCrydr('USD CryDR', 'jUSD', 'jUSDTokenAddress')
      .then(() => registerCrydr('EUR CryDR', 'jEUR', 'jEURTokenAddress'))
      .then(() => registerCrydr('US Treasury CryDR', 'jTBill', 'jTBillTokenAddress'));
  };


  /* Grant manager permissions */

  const grantCryDRPermissionsToManager = (crydr, crydrStorageAddressName) => {
    console.log(`  Grant manager permission for the crydr '${crydrStorageAddressName}'`);
    const crydrAddress  = deploymentController.getAddress(network, crydrStorageAddressName);
    const crydrInstance = crydr.at(crydrAddress);
    return Promise.all(
      [
        crydrInstance.enableManager.sendTransaction(manager, { from: owner, gas: 500000 }),
        crydrInstance.grantManagerPermission.sendTransaction(manager, 'mint', { from: owner, gas: 500000 }),
        crydrInstance.grantManagerPermission.sendTransaction(manager, 'burn', { from: owner, gas: 500000 }),
      ]);
  };

  const grantCryDRsPermissionsToManager = () => {
    console.log('  Grant manager permissions to CryDRs ... ...');

    return grantCryDRPermissionsToManager(jUSD, 'jUSDTokenAddress')
      .then(() => grantCryDRPermissionsToManager(jEUR, 'jEURTokenAddress'))
      .then(() => grantCryDRPermissionsToManager(jTBill, 'jTBillTokenAddress'));
  };


  /* Start migration */

  console.log('  Start migration');
  deployer.then(() => deployCryDRs())
    .then(() => registerCryDRs())
    .then(() => grantCryDRsPermissionsToManager())
    .then(() => {
      deploymentController.logStorage(network);
    });
};
