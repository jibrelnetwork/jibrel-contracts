import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageAllowanceInterfaceArtifact = global.artifacts.require('CrydrStorageAllowanceInterface.sol');


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
    CrydrStorageAllowanceInterfaceArtifact
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
    CrydrStorageAllowanceInterfaceArtifact
      .at(crydrStorageAddress)
      .decreaseAllowance
      .sendTransaction,
    [ownerAddress, spenderAddress, valueWei, { from: crydrControllerAddress }]);
  global.console.log('\tBalance successfully increased');
};

export const getAllowance = async (crydrStorageAddress, ownerAddress, spenderAddress) =>
  CrydrStorageAllowanceInterfaceArtifact.at(crydrStorageAddress).getAllowance.call(ownerAddress, spenderAddress);


/**
 * Events
 */

export const getAccountAllowanceIncreasedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageAllowanceInterfaceArtifact
    .at(contractAddress)
    .AccountAllowanceIncreasedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountAllowanceDecreasedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageAllowanceInterfaceArtifact
    .at(contractAddress)
    .AccountAllowanceDecreasedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
