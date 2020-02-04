import { submitTxAndWaitConfirmation } from '../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const JNTPaymentGatewayStubArtifact = global.artifacts.require('JNTPaymentGatewayStub.sol');


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
  // const txHash = await submitTxAndWaitConfirmation(
  //   JNTPaymentGatewayStubArtifact
  //     .at(contractAddress)
  //     .chargeJNT
  //     .sendTransaction,
  //   [fromAddress, toAddress, valueWei],
  //   { from: senderAddress }
  // );
  const instance = await JNTPaymentGatewayStubArtifact.at(contractAddress);
  const txHash = await instance.mint(fromAddress, toAddress, valueWei, { from: senderAddress });
  global.console.log('\tJNT successfully charged');
  return txHash;
};


/**
 * Getters
 */

export const counter = async (contractAddress) => JNTPaymentGatewayStubArtifact.at(contractAddress).counter();


/**
 * Events
 */

export const getJNTChargedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JNTPaymentGatewayStubArtifact.at(contractAddress).JNTChargedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
