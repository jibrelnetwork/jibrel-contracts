import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const CrydrControllerMintableInterfaceArtifact = global.artifacts.require('CrydrControllerMintableInterface.sol');


export const mint = async (crydrControllerAddress, managerAddress,
                           receiverAddress, amount) => {
  global.console.log('\tMint tokens:');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\treceiverAddress - ${receiverAddress}`);
  global.console.log(`\t\tamount - ${amount}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrControllerMintableInterfaceArtifact
  //     .at(crydrControllerAddress)
  //     .mint
  //     .sendTransaction,
  //   [receiverAddress, amount],
  //   { from: managerAddress }
  // );
  const instance = await CrydrControllerMintableInterfaceArtifact.at(crydrControllerAddress);
  await instance.mint(receiverAddress, '0x' + amount.toString(16), { from: managerAddress });
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
  // await submitTxAndWaitConfirmation(
  //   CrydrControllerMintableInterfaceArtifact
  //     .at(crydrControllerAddress)
  //     .burn
  //     .sendTransaction,
  //   [loserAddress, amount],
  //   { from: managerAddress }
  // );
  const instance = await CrydrControllerMintableInterfaceArtifact.at(crydrControllerAddress);
  await instance.burn(loserAddress, '0x' + amount.toString(16), { from: managerAddress });
  global.console.log('\tTokens successfully burned');
  return null;
};
