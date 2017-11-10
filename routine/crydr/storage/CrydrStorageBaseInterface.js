import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageBaseInterface = global.artifacts.require('CrydrStorageBaseInterface.sol');


/**
 * Configuration
 */

export const setCrydrController = async (crydrStorageAddress, manager, crydrControllerAddress) => {
  global.console.log('\tSet controller of CryDR storage:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .setCrydrController
      .sendTransaction,
    [crydrControllerAddress, { from: manager }]);
  global.console.log('\tController of CryDR storage successfully set');
};


/**
 * Low-level setters
 */

export const increaseBalance = async (crydrStorageAddress, crydrControllerAddress,
                                      accountAddress, valueWei) => {
  global.console.log('\tIncrease balance of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .increaseBalance
      .sendTransaction,
    [accountAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tBalance successfully increased');
};

export const decreaseBalance = async (crydrStorageAddress, crydrControllerAddress,
                                      accountAddress, valueWei) => {
  global.console.log('\tDecrease balance of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .decreaseBalance
      .sendTransaction,
    [accountAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tBalance successfully decreased');
};

export const increaseAllowance = async (crydrStorageAddress, crydrControllerAddress,
                                        ownerAddress, spenderAddress, valueWei) => {
  global.console.log('\tDecrease allowance of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tspenderAddress - ${spenderAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .increaseAllowance
      .sendTransaction,
    [ownerAddress, spenderAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tBalance successfully increased');
};

export const decreaseAllowance = async (crydrStorageAddress, crydrControllerAddress,
                                        ownerAddress, spenderAddress, valueWei) => {
  global.console.log('\tDecrease allowance of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tspenderAddress - ${spenderAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .decreaseAllowance
      .sendTransaction,
    [ownerAddress, spenderAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tBalance successfully increased');
};

export const blockAccount = async (crydrStorageAddress, crydrControllerAddress,
                                   ownerAddress, accountAddress) => {
  global.console.log('\tBlock account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .blockAccount
      .sendTransaction,
    [ownerAddress, accountAddress, { from: crydrControllerAddress }]);
  global.console.log('\tAccount successfully blocked');
};

export const unlockAccount = async (crydrStorageAddress, crydrControllerAddress,
                                    ownerAddress, accountAddress) => {
  global.console.log('\tUnlock account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .unlockAccount
      .sendTransaction,
    [ownerAddress, accountAddress, { from: crydrControllerAddress }]);
  global.console.log('\tAccount successfully unlocked');
};

export const blockFunds = async (crydrStorageAddress, crydrControllerAddress,
                                 ownerAddress, accountAddress, valueWei) => {
  global.console.log('\tBlock funds of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .blockFunds
      .sendTransaction,
    [ownerAddress, accountAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tFunds successfully blocked');
};

export const unlockFunds = async (crydrStorageAddress, crydrControllerAddress,
                                 ownerAddress, accountAddress, valueWei) => {
  global.console.log('\tUnlock funds of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .unlockFunds
      .sendTransaction,
    [ownerAddress, accountAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tFunds successfully unlocked');
};


/**
 * Events
 */

export const getCrydrControllerChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .CrydrControllerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountBalanceIncreasedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountBalanceIncreasedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountBalanceDecreasedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountBalanceDecreasedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountAllowanceIncreasedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountAllowanceIncreasedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountAllowanceDecreasedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountAllowanceDecreasedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountBlockEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountBlockEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountUnlockEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountUnlockEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountBlockFundsEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountBlockFundsEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountUnlockFundsEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountUnlockFundsEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
