const Promise = require('bluebird');

const JNTPayableService = global.artifacts.require('JNTPayableServiceERC20.sol');


/**
 * Events
 */

export const getJNTPriceTransferChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableService.at(contractAddress).JNTPriceTransferChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTPriceTransferFromChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableService.at(contractAddress).JNTPriceTransferFromChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTPriceApproveChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableService.at(contractAddress).JNTPriceApproveChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
