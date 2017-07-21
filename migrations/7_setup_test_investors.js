global.artifacts = artifacts; // eslint-disable-line no-undef

const InvestorRegistryRoutines        = require('../routine/InvestorRegistry');
const CrydrControllerMintableRoutines = require('../routine/CrydrControllerMintableInterface');


// todo verify migration


/* Migration */

module.exports = (deployer, network, accounts) => {
  const manager    = accounts[2];
  const investor01 = accounts[3];
  const investor02 = accounts[4];
  const investor03 = accounts[5];
  const investor04 = accounts[6];
  const investor05 = accounts[7];

  const licensesNames   = ['gdr_license', 'treasury_bill_license'];  // todo grant licenses
  const expireTimestamp = 1510000000;

  // eslint-disable-next-line no-restricted-properties
  const amountToMint = 1000 * Math.pow(10, 18);

  global.console.log('  Start migration');
  deployer
    .then(() => InvestorRegistryRoutines.registerInvestor(network, manager, investor01, licensesNames, expireTimestamp))
    .then(() => InvestorRegistryRoutines.registerInvestor(network, manager, investor02, licensesNames, expireTimestamp))
    .then(() => InvestorRegistryRoutines.registerInvestor(network, manager, investor03, licensesNames, expireTimestamp))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'JNT', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor02, 'JNT', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor03, 'JNT', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor04, 'JNT', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor05, 'JNT', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'jUSD', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'jEUR', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'jGBP', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'jAED', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'jRUB', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'jCNY', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'jTBill', amountToMint))
    .then(() => CrydrControllerMintableRoutines.mintTokens(network, manager, investor01, 'jGDR', amountToMint));
};
