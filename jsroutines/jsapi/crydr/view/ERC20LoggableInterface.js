import { submitTxAndWaitConfirmation } from '../../../util/SubmitTx';

const CrydrViewERC20LoggableInterface = global.artifacts.require('CrydrViewERC20LoggableInterface.sol');


export const emitTransferEvent = async (crydrViewAddress, managerAddress,
                                        fromAddress, toAddress, valueTransferred) => {
  global.console.log('\tEmit event Transfer:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueTransferred - ${valueTransferred}`);
  await submitTxAndWaitConfirmation(
    CrydrViewERC20LoggableInterface
      .at(crydrViewAddress)
      .emitTransferEvent
      .sendTransaction,
    [fromAddress, toAddress, valueTransferred, { from: managerAddress }]);
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
  await submitTxAndWaitConfirmation(
    CrydrViewERC20LoggableInterface
      .at(crydrViewAddress)
      .emitApprovalEvent
      .sendTransaction,
    [ownerAddress, spenderAddress, valueTransferred, { from: managerAddress }]);
  global.console.log('\tEvent Approval successfully emitted');
  return null;
};
