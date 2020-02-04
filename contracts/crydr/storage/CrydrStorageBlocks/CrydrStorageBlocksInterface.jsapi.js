import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageBlocksInterfaceArtifact = global.artifacts.require('CrydrStorageBlocksInterface.sol');


/* Low-level change of blocks */

export const blockAccount = async (crydrStorageAddress, crydrControllerAddress,
                                   accountAddress) => {
  global.console.log('\tBlock account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBlocksInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .blockAccount
  //     .sendTransaction,
  //   [accountAddress],
  //   { from: crydrControllerAddress }
  // );
  const instance = await CrydrStorageBlocksInterfaceArtifact.at(crydrStorageAddress);
  await instance.blockAccount(accountAddress, { from: crydrControllerAddress });
  global.console.log('\tAccount successfully blocked');
};

export const unblockAccount = async (crydrStorageAddress, crydrControllerAddress,
                                     accountAddress) => {
  global.console.log('\tUnlock account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBlocksInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .unblockAccount
  //     .sendTransaction,
  //   [accountAddress],
  //   { from: crydrControllerAddress }
  // );
  const instance = await CrydrStorageBlocksInterfaceArtifact.at(crydrStorageAddress);
  await instance.unblockAccount(accountAddress, { from: crydrControllerAddress });
  global.console.log('\tAccount successfully unlocked');
};

export const getAccountBlocks = async (crydrStorageAddress, accountAddress) =>
  CrydrStorageBlocksInterfaceArtifact.at(crydrStorageAddress).getAccountBlocks.call(accountAddress);


export const blockAccountFunds = async (crydrStorageAddress, crydrControllerAddress,
                                        accountAddress, valueWei) => {
  global.console.log('\tBlock funds of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBlocksInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .blockAccountFunds
  //     .sendTransaction,
  //   [accountAddress, valueWei],
  //   { from: crydrControllerAddress }
  // );
  const instance = await CrydrStorageBlocksInterfaceArtifact.at(crydrStorageAddress);
  await instance.blockAccountFunds(accountAddress, valueWei, { from: crydrControllerAddress });
  global.console.log('\tFunds successfully blocked');
};

export const unblockAccountFunds = async (crydrStorageAddress, crydrControllerAddress,
                                          accountAddress, valueWei) => {
  global.console.log('\tUnlock funds of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBlocksInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .unblockAccountFunds
  //     .sendTransaction,
  //   [accountAddress, valueWei],
  //   { from: crydrControllerAddress }
  // );
  const instance = await CrydrStorageBlocksInterfaceArtifact.at(crydrStorageAddress);
  await instance.unblockAccountFunds(accountAddress, valueWei, { from: crydrControllerAddress });
  global.console.log('\tFunds successfully unlocked');
};

export const getAccountBlockedFunds = async (crydrStorageAddress, accountAddress) =>
  CrydrStorageBlocksInterfaceArtifact.at(crydrStorageAddress).getAccountBlockedFunds.call(accountAddress);


/**
 * Events
 */

export const getAccountBlockedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBlocksInterfaceArtifact
    .at(contractAddress)
    .AccountBlockedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountUnblockedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBlocksInterfaceArtifact
    .at(contractAddress)
    .AccountUnblockedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountFundsBlockedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBlocksInterfaceArtifact
    .at(contractAddress)
    .AccountFundsBlockedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountFundsUnblockedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBlocksInterfaceArtifact
    .at(contractAddress)
    .AccountFundsUnblockedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
