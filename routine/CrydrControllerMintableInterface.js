import { submitTxAndWaitConfirmation } from './utils/SubmitTx';

const CrydrControllerMintableInterface = global.artifacts.require('CrydrControllerMintableInterface.sol');


// eslint-disable-next-line import/prefer-default-export
export const mintTokens = async (crydrControllerAddress, manager, investorAddress, amount) => {
  global.console.log('\tMint tokens for investor:');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tinvestorAddress - ${investorAddress}`);
  global.console.log(`\t\tamount - ${amount}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerMintableInterface
      .at(crydrControllerAddress)
      .mint
      .sendTransaction,
    [investorAddress, amount, { from: manager }]);
  global.console.log('\tTokens successfully minted');
  return null;
};
