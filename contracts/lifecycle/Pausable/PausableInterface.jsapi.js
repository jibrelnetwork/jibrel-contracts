import { submitTxAndWaitConfirmation } from '../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const PausableInterfaceArtifact = global.artifacts.require('PausableInterface.sol');


/**
 * Setters
 */

export const unpauseContract = async (contractAddress, managerAddress) => {
  global.console.log('\tUnpause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  // await submitTxAndWaitConfirmation(
  //   PausableInterfaceArtifact
  //     .at(contractAddress)
  //     .unpauseContract
  //     .sendTransaction,
  //   [],
  //   { from: managerAddress }
  // );
  const instance = await PausableInterfaceArtifact.at(contractAddress);
  await instance.unpauseContract({ from: managerAddress });
  global.console.log('\t\tContract successfully unpaused');
};

export const pauseContract = async (contractAddress, managerAddress) => {
  global.console.log('\tPause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  // await submitTxAndWaitConfirmation(
  //   PausableInterfaceArtifact
  //     .at(contractAddress)
  //     .pauseContract
  //     .sendTransaction,
  //   [],
  //   { from: managerAddress }
  // );
  const instance = await PausableInterfaceArtifact.at(contractAddress);
  instance.pauseContract({ from: managerAddress });
  global.console.log('\t\tContract successfully paused');
};


/**
 * Getters
 */

export const getPaused = async (contractAddress) => {
  global.console.log('\tFetch whether contract is paused or not');
  const isPaused = await PausableInterfaceArtifact.at(contractAddress).getPaused.call();
  global.console.log(`\t\tContracts is paused: ${isPaused}`);
  return isPaused;
};


/**
 * Events
 */

export const getPauseEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = PausableInterfaceArtifact.at(contractAddress).PauseEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUnpauseEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = PausableInterfaceArtifact.at(contractAddress).UnpauseEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
