import { submitTxAndWaitConfirmation } from '../../util/SubmitTx';

const Promise = require('bluebird');

const JNTControllerStub = global.artifacts.require('JNTControllerStub.sol');


/**
 * setters
 */

export const chargeJNT = async (contractAddress, senderAddress, fromAddress, toAddress, valueWei) => {
  global.console.log('\tCharge JNT:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tsenderAddress - ${senderAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  const txHash = await submitTxAndWaitConfirmation(
    JNTControllerStub
      .at(contractAddress)
      .chargeJNT
      .sendTransaction,
    [fromAddress, toAddress, valueWei, { from: senderAddress }]
  );
  global.console.log('\tJNT successfully charged');
  return txHash;
};


/**
 * Getters
 */

export const counter = async (contractAddress) => JNTControllerStub.at(contractAddress).counter.call();


/**
 * Events
 */

export const getJNTChargedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JNTControllerStub.at(contractAddress).JNTChargedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
