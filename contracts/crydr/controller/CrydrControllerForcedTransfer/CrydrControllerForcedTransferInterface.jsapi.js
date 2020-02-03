import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrControllerForcedTransferInterfaceArtifact = global.artifacts.require('CrydrControllerForcedTransferInterface.sol');


/**
 * Methods
 */

export const forcedTransfer = async (crydrControllerAddress, callerAddress,
                                     fromAddress, toAddress, valueToTransfer) => {
  global.console.log('\tForced transfer of funds via CryDR Controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tcallerAddress - ${callerAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueToTransfer - ${valueToTransfer}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrControllerForcedTransferInterfaceArtifact
  //     .at(crydrControllerAddress)
  //     .forcedTransfer
  //     .sendTransaction,
  //   [fromAddress, toAddress, valueToTransfer],
  //   { from: callerAddress }
  // );
  let instance = await CrydrControllerForcedTransferInterfaceArtifact.at(crydrControllerAddress);
  instance.forcedTransfer(fromAddress, toAddress, valueToTransfer, { from: callerAddress });
  global.console.log('\tFunds successfully transferred via CryDR Controller');
  return null;
};


export const forcedTransferAll = async (crydrControllerAddress, callerAddress,
                                        fromAddress, toAddress) => {
  global.console.log('\tForced transfer of all funds via CryDR Controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tcallerAddress - ${callerAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrControllerForcedTransferInterfaceArtifact
  //     .at(crydrControllerAddress)
  //     .forcedTransferAll
  //     .sendTransaction,
  //   [fromAddress, toAddress],
  //   { from: callerAddress }
  // );
  let instance = await CrydrControllerForcedTransferInterfaceArtifact.at(crydrControllerAddress);
  instance.forcedTransferAll(fromAddress, toAddress, { from: callerAddress });
  global.console.log('\tFunds successfully transferred via CryDR Controller');
  return null;
};


/**
 * Events
 */

export const getCrydrStorageChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerForcedTransferInterfaceArtifact
    .at(contractAddress)
    .ForcedTransferEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
