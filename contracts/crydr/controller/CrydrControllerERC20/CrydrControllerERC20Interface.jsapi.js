import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const CrydrControllerERC20InterfaceArtifact = global.artifacts.require('CrydrControllerERC20Interface.sol');


/* Configuration */

export const transfer = async (crydrControllerAddress, callerAddress,
                               msgsenderAddress, toAddress, valueToTransfer) => {
  global.console.log('\tTransfer funds via CryDR Controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tcallerAddress - ${callerAddress}`);
  global.console.log(`\t\tmsgsenderAddress - ${msgsenderAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueToTransfer - ${valueToTransfer}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerERC20InterfaceArtifact
      .at(crydrControllerAddress)
      .transfer
      .sendTransaction,
    [msgsenderAddress, toAddress, valueToTransfer, { from: callerAddress }]);
  global.console.log('\tFunds successfully transferred via CryDR Controller');
  return null;
};

export const getTotalSupply = async (contractAddress) =>
  CrydrControllerERC20InterfaceArtifact.at(contractAddress).getTotalSupply.call();

export const getBalance = async (contractAddress, targetAccount) =>
  CrydrControllerERC20InterfaceArtifact.at(contractAddress).getBalance.call(targetAccount);


export const approve = async (crydrControllerAddress, callerAddress,
                              msgsenderAddress, spenderAddress, valueToApprove) => {
  global.console.log('\tApprove spending funds via CryDR Controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tcallerAddress - ${callerAddress}`);
  global.console.log(`\t\tmsgsenderAddress - ${msgsenderAddress}`);
  global.console.log(`\t\tspenderAddress - ${spenderAddress}`);
  global.console.log(`\t\tvalueToApprove - ${valueToApprove}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerERC20InterfaceArtifact
      .at(crydrControllerAddress)
      .approve
      .sendTransaction,
    [msgsenderAddress, spenderAddress, valueToApprove, { from: callerAddress }]);
  global.console.log('\tSpending successfully approved via CryDR Controller');
  return null;
};

export const transferFrom = async (crydrControllerAddress, callerAddress,
                                   msgsenderAddress, fromAddress, toAddress, valueToTransfer) => {
  global.console.log('\tTransfer From via CryDR Controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tcallerAddress - ${callerAddress}`);
  global.console.log(`\t\tmsgsenderAddress - ${msgsenderAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueToTransfer - ${valueToTransfer}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerERC20InterfaceArtifact
      .at(crydrControllerAddress)
      .transferFrom
      .sendTransaction,
    [msgsenderAddress, fromAddress, toAddress, valueToTransfer, { from: callerAddress }]);
  global.console.log('\tTransfer From successfully executed via CryDR Controller');
  return null;
};

export const getAllowance = async (contractAddress, ownerAccount, spenderAccount) =>
  CrydrControllerERC20InterfaceArtifact.at(contractAddress).getAllowance.call(ownerAccount, spenderAccount);
