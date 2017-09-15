import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise              = require('bluebird');

const ERC20Interface = global.artifacts.require('ERC20Interface.sol');


/**
 * Events
 */

export const getTransferEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = ERC20Interface
    .at(contractAddress)
    .Transfer(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getApprovalEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = ERC20Interface
    .at(contractAddress)
    .Approval(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
