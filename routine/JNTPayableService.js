import { submitTxAndWaitConfirmation } from './utils/SubmitTx';

const Promise = require('bluebird');

const JNTPayableService = global.artifacts.require('JNTPayableService.sol');


/**
 * Events
 */

export const getJNTControllerChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableService.at(contractAddress).JNTControllerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTBeneficiaryChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableService.at(contractAddress).JNTBeneficiaryChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTChargedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableService.at(contractAddress).JNTChargedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
