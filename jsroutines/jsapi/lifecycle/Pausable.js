import { submitTxAndWaitConfirmation } from '../../util/SubmitTx';

const Promise = require('bluebird');

const Pausable = global.artifacts.require('Pausable.sol');

const ManageableJSAPI = require('./Manageable');


/**
 * Setters
 */

export const unpauseContract = async (contractAddress, managerAddress) => {
  global.console.log('\tUnpause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  await submitTxAndWaitConfirmation(
    Pausable
      .at(contractAddress)
      .unpauseContract
      .sendTransaction,
    [{ from: managerAddress }],
  );
  global.console.log('\t\tContract successfully unpaused');
};

export const pauseContract = async (contractAddress, managerAddress) => {
  global.console.log('\tPause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  await submitTxAndWaitConfirmation(
    Pausable
      .at(contractAddress)
      .pauseContract
      .sendTransaction,
    [{ from: managerAddress }],
  );
  global.console.log('\t\tContract successfully paused');
};


/**
 * Getters
 */

export const getPaused = async (contractAddress) => {
  global.console.log('\tFetch whether contract is paused or not');
  const isPaused = await Pausable.at(contractAddress).getPaused.call();
  global.console.log(`\t\tContracts is paused: ${isPaused}`);
  return isPaused;
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


/**
 * Permissions
 */

export const grantManagerPermissions = async (contractAddress, ownerAddress, managerPauseAddress) => {
  global.console.log('\tConfiguring manager permissions for pausable contract ...');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerPauseAddress - ${managerPauseAddress}`);

  const managerPermissions = [
    'pause_contract',
    'unpause_contract',
  ];

  await ManageableJSAPI.grantManagerPermissions(contractAddress,
                                                ownerAddress,
                                                managerPauseAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of pausable contract granted');
  return null;
};

