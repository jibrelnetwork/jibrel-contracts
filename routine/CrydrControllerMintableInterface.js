const CrydrControllerMintableInterface = global.artifacts.require('CrydrControllerMintableInterface.sol');

const deploymentController = require('../deployment_controller');


// eslint-disable-next-line import/prefer-default-export
export const mintTokens = (network, manager, investorAddress, crydrSymbol, amount) => {
  global.console.log('\tMint tokens for investor:');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tinvestorAddress - ${investorAddress}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);
  global.console.log(`\t\tamount - ${amount}`);
  return CrydrControllerMintableInterface
    .at(deploymentController.getCrydrControllerAddress(network, crydrSymbol))
    .mint
    .sendTransaction(investorAddress, amount, { from: manager })
    .then(() => {
      global.console.log('\tTokens successfully minted');
      return null;
    });
};
