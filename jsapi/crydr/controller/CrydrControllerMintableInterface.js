import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const CrydrControllerMintableInterface = global.artifacts.require('CrydrControllerMintableInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


export const mint = async (crydrControllerAddress, managerAddress,
                           receiverAddress, amount) => {
  global.console.log('\tMint tokens:');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\treceiverAddress - ${receiverAddress}`);
  global.console.log(`\t\tamount - ${amount}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerMintableInterface
      .at(crydrControllerAddress)
      .mint
      .sendTransaction,
    [receiverAddress, amount, { from: managerAddress }]);
  global.console.log('\tTokens successfully minted');
  return null;
};

export const burn = async (crydrControllerAddress, managerAddress,
                           loserAddress, amount) => {
  global.console.log('\tBurn tokens:');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tloserAddress - ${loserAddress}`);
  global.console.log(`\t\tamount - ${amount}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerMintableInterface
      .at(crydrControllerAddress)
      .burn
      .sendTransaction,
    [loserAddress, amount, { from: managerAddress }]);
  global.console.log('\tTokens successfully burned');
  return null;
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for mintable crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanager - ${managerAddress}`);

  const managerPermissions = [
    'mint_crydr',
    'burn_crydr',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of mintable crydr controller granted');
  return null;
};
