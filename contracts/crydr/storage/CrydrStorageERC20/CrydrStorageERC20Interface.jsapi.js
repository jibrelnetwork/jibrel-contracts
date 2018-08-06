import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageERC20InterfaceArtifact = global.artifacts.require('CrydrStorageERC20Interface.sol');


/**
 * ERC20 setters
 */

export const transfer = async (crydrStorageAddress, crydrControllerAddress,
                               msgsenderAddress, toAddress, valueWei) => {
  global.console.log('\tTransfer tokens:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmsgsenderAddress - ${msgsenderAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageERC20InterfaceArtifact
      .at(crydrStorageAddress)
      .transfer
      .sendTransaction,
    [msgsenderAddress, toAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tBalance successfully increased');
};

export const transferFrom = async (crydrStorageAddress, crydrControllerAddress,
                                   msgsenderAddress, fromAddress, toAddress, valueWei) => {
  global.console.log('\tTransfer from tokens:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmsgsenderAddress - ${msgsenderAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageERC20InterfaceArtifact
      .at(crydrStorageAddress)
      .transferFrom
      .sendTransaction,
    [msgsenderAddress, fromAddress, toAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tBalance successfully decreased');
};

export const approve = async (crydrStorageAddress, crydrControllerAddress,
                              msgsenderAddress, spenderAddress, valueWei) => {
  global.console.log('\tApprove:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmsgsenderAddress - ${msgsenderAddress}`);
  global.console.log(`\t\tspenderAddress - ${spenderAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageERC20InterfaceArtifact
      .at(crydrStorageAddress)
      .approve
      .sendTransaction,
    [msgsenderAddress, spenderAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tBalance successfully increased');
};


/**
 * Events
 */

export const getCrydrTransferredEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageERC20InterfaceArtifact
    .at(contractAddress)
    .CrydrTransferredEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getCrydrTransferredFromEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageERC20InterfaceArtifact
    .at(contractAddress)
    .CrydrTransferredFromEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getCrydrSpendingApprovedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageERC20InterfaceArtifact
    .at(contractAddress)
    .CrydrSpendingApprovedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
