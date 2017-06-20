/* eslint-disable no-console */


const InvestorRepository = artifacts.require('InvestorRepository.sol');
const jUSD               = artifacts.require('jUSD.sol');
const jEUR               = artifacts.require('jEUR.sol');
const jTBill             = artifacts.require('jTBill.sol');


module.exports = (deployer, network, accounts) => {
  const manager    = accounts[1];
  const investor01 = accounts[2];
  const investor02 = accounts[3];

  const deploymentController = require('./deployment_controller');
  deploymentController.getAddress(network, 'investorsRepoAddress');
  deploymentController.getAddress(network, 'jTBillTokenAddress');

  let bondsLicenseName;


  /* Generators of promises */

  const fetchLicensesNames          = () => {
    console.log('  Fetch license name for the bonds');
    const jTBillToken = jTBill.at(deploymentController.getAddress(network, 'jTBillTokenAddress'));
    return jTBillToken.getLicenseName.call();
  };
  const processFetchedLicensesNames = (value) => {
    bondsLicenseName = value;
    console.log(`  Name of bonds license: '${bondsLicenseName}'`);
  };

  const grantBondsLicenses = () => {
    console.log('  Grant bonds license to the investors ...');
    const investorsRepo = InvestorRepository.at(deploymentController.getAddress(network, 'investorsRepoAddress'));
    return Promise.all(
      [
        investorsRepo.admitInvestor.sendTransaction(investor01,
                                                    { from: manager, gas: 500000 }),
        investorsRepo.grantInvestorLicense.sendTransaction(investor01, bondsLicenseName,
                                                           { from: manager, gas: 500000 }),
        investorsRepo.admitInvestor.sendTransaction(investor02, { from: manager, gas: 500000 }),
        investorsRepo.grantInvestorLicense.sendTransaction(investor02, bondsLicenseName,
                                                           { from: manager, gas: 500000 }),
      ]);
  };

  const mintTokens = () => {
    console.log('  Mint tokens ...');
    const jUSDToken   = jUSD.at(deploymentController.getAddress(network, 'jUSDTokenAddress'));
    const jEURToken   = jEUR.at(deploymentController.getAddress(network, 'jEURTokenAddress'));
    const jTBillToken = jTBill.at(deploymentController.getAddress(network, 'jTBillTokenAddress'));
    return Promise.all(
      [
        jUSDToken.mint.sendTransaction(investor01, 1000 * (10 ** 18),
                                       { from: manager, gas: 500000 }),
        jEURToken.mint.sendTransaction(investor01, 1000 * (10 ** 18),
                                       { from: manager, gas: 500000 }),
        jTBillToken.mint.sendTransaction(investor01, 1000 * (10 ** 18),
                                         { from: manager, gas: 500000 }),
      ]);
  };


  /* Start migration */

  // throw Error("Use this only for development !!!");

  console.log('  Start migration');
  deployer.then(() => fetchLicensesNames())
    .then((values) => {
      processFetchedLicensesNames(values);
      return grantBondsLicenses();
    })
    .then(() => mintTokens())
    .then(() => {
      deploymentController.logStorage(network);
    });
};
