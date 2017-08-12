import { submitTxAndWaitConfirmation } from '../misc/SubmitTx';

const Promise = require('bluebird');

const Pausable = global.artifacts.require('Pausable.sol');


/**
 * Setters
 */

export const unpauseContract = async (contractAddress, manager) => {
  global.console.log('\tUnpause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await submitTxAndWaitConfirmation(
    Pausable
      .at(contractAddress)
      .unpause
      .sendTransaction,
    [{ from: manager }],
  );
  global.console.log('\t\tContract successfully unpaused');
};

export const pauseContract = async (contractAddress, manager) => {
  global.console.log('\tUnpause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await submitTxAndWaitConfirmation(
    Pausable
      .at(contractAddress)
      .pause
      .sendTransaction,
    [{ from: manager }],
  );
  global.console.log('\t\tContract successfully unpaused');
};


/**
 * Events
 */

export const getPauseEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = Pausable.at(contractAddress).PauseEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUnpauseEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = Pausable.at(contractAddress).UnpauseEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
