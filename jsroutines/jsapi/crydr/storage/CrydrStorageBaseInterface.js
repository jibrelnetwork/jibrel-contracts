import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageBaseInterface = global.artifacts.require('CrydrStorageBaseInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


/**
 * Configuration
 */

export const setCrydrController = async (crydrStorageAddress, managerAddress,
                                         crydrControllerAddress) => {
  global.console.log('\tSet controller of CryDR storage:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .setCrydrController
      .sendTransaction,
    [crydrControllerAddress, { from: managerAddress }]);
  global.console.log('\tController of CryDR storage successfully set');
};

export const getCrydrController = async (crydrStorageAddress) =>
  CrydrStorageBaseInterface.at(crydrStorageAddress).getCrydrController.call();


/**
 * Low-level change of balance
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

export const getBalance = async (crydrStorageAddress, accountAddress) =>
  CrydrStorageBaseInterface.at(crydrStorageAddress).getBalance.call(accountAddress);

export const getTotalSupply = async (crydrStorageAddress) =>
  CrydrStorageBaseInterface.at(crydrStorageAddress).getTotalSupply.call();


/* Low-level change of allowance */

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

export const getAllowance = async (crydrStorageAddress, ownerAddress, spenderAddress) =>
  CrydrStorageBaseInterface.at(crydrStorageAddress).getAllowance.call(ownerAddress, spenderAddress);


/* Low-level change of blocks */

export const blockAccount = async (crydrStorageAddress, crydrControllerAddress,
                                   accountAddress) => {
  global.console.log('\tBlock account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .blockAccount
      .sendTransaction,
    [accountAddress, { from: crydrControllerAddress }]);
  global.console.log('\tAccount successfully blocked');
};

export const unblockAccount = async (crydrStorageAddress, crydrControllerAddress,
                                     accountAddress) => {
  global.console.log('\tUnlock account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .unblockAccount
      .sendTransaction,
    [accountAddress, { from: crydrControllerAddress }]);
  global.console.log('\tAccount successfully unlocked');
};

export const getAccountBlocks = async (crydrStorageAddress, accountAddress) =>
  CrydrStorageBaseInterface.at(crydrStorageAddress).getAccountBlocks.call(accountAddress);


export const blockAccountFunds = async (crydrStorageAddress, crydrControllerAddress,
                                        accountAddress, valueWei) => {
  global.console.log('\tBlock funds of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .blockAccountFunds
      .sendTransaction,
    [accountAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tFunds successfully blocked');
};

export const unblockAccountFunds = async (crydrStorageAddress, crydrControllerAddress,
                                          accountAddress, valueWei) => {
  global.console.log('\tUnlock funds of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .unblockAccountFunds
      .sendTransaction,
    [accountAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tFunds successfully unlocked');
};

export const getAccountBlockedFunds = async (crydrStorageAddress, accountAddress) =>
  CrydrStorageBaseInterface.at(crydrStorageAddress).getAccountBlockedFunds.call(accountAddress);


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

export const getAccountBlockedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountBlockedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountUnblockedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountUnblockedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountFundsBlockedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountFundsBlockedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountFundsUnblockedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .AccountFundsUnblockedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr storage ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanager - ${managerAddress}`);

  const managerPermissions = [
    'set_crydr_controller',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of crydr storage granted');
  return null;
};

