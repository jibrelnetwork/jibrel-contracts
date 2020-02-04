import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const CrydrViewERC20LoggableInterfaceArtifact = global.artifacts.require('CrydrViewERC20LoggableInterface.sol');


export const emitTransferEvent = async (crydrViewAddress, managerAddress,
                                        fromAddress, toAddress, valueTransferred) => {
  global.console.log('\tEmit event Transfer:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueTransferred - ${valueTransferred}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrViewERC20LoggableInterfaceArtifact
  //     .at(crydrViewAddress)
  //     .emitTransferEvent
  //     .sendTransaction,
  //   [fromAddress, toAddress, valueTransferred],
  //   { from: managerAddress }
  // );
  const instance = await CrydrViewERC20LoggableInterfaceArtifact.at(crydrViewAddress);
  await instance.emitTransferEvent(fromAddress, toAddress, valueTransferred, { from: managerAddress });
  global.console.log('\tEvent Transfer successfully emitted');
  return null;
};

export const emitApprovalEvent = async (crydrViewAddress, managerAddress,
                                        ownerAddress, spenderAddress, valueTransferred) => {
  global.console.log('\tEmit event Approval:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tspenderAddress - ${spenderAddress}`);
  global.console.log(`\t\tvalueTransferred - ${valueTransferred}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrViewERC20LoggableInterfaceArtifact
  //     .at(crydrViewAddress)
  //     .emitApprovalEvent
  //     .sendTransaction,
  //   [ownerAddress, spenderAddress, valueTransferred],
  //   { from: managerAddress }
  // );
  const instance = await CrydrViewERC20LoggableInterfaceArtifact.at(crydrViewAddress);
  await instance.emitApprovalEvent(fromAddress, toAddress, valueTransferred, { from: managerAddress });
  global.console.log('\tEvent Approval successfully emitted');
  return null;
};
