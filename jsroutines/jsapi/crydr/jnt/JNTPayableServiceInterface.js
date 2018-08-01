import { submitTxAndWaitConfirmation } from '../../../util/SubmitTx';

const Promise = require('bluebird');

const JNTPayableServiceInterface = global.artifacts.require('JNTPayableServiceInterface.sol');

const ManageableJSAPI   = require('../../lifecycle/Manageable');


/**
 * Configuration
 */

export const setJntController = async (jntPayableServiceAddress, managerAddress,
                                       jntControllerAddress) => {
  global.console.log('\tSet JNT controller of JNT payable service:');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tjntControllerAddress - ${jntControllerAddress}`);
  await submitTxAndWaitConfirmation(
    JNTPayableServiceInterface
      .at(jntPayableServiceAddress)
      .setJntController
      .sendTransaction,
    [jntControllerAddress, { from: managerAddress }]);
  global.console.log('\tJNT controller of JNT payable service successfully set');
  return null;
};

export const getJntController = async (contractAddress) =>
  JNTPayableServiceInterface.at(contractAddress).getJntController.call();


export const setJntBeneficiary = async (jntPayableServiceAddress, managerAddress,
                                        jntBeneficiaryAddress) => {
  global.console.log('\tSet JNT beneficiary of JNT payable service:');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tjntBeneficiaryAddress - ${jntBeneficiaryAddress}`);
  await submitTxAndWaitConfirmation(
    JNTPayableServiceInterface
      .at(jntPayableServiceAddress)
      .setJntBeneficiary
      .sendTransaction,
    [jntBeneficiaryAddress, { from: managerAddress }]);
  global.console.log('\tJNT beneficiary of JNT payable service successfully set');
  return null;
};

export const getJntBeneficiary = async (contractAddress) =>
  JNTPayableServiceInterface.at(contractAddress).getJntBeneficiary.call();


/**
 * Events
 */

export const getJNTControllerChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceInterface
    .at(contractAddress)
    .JNTControllerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTBeneficiaryChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceInterface
    .at(contractAddress)
    .JNTBeneficiaryChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTChargedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceInterface
    .at(contractAddress)
    .JNTChargedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (jntPayableServiceAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for JNT payable service ...');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_jnt_controller',
    'set_jnt_beneficiary',
    'withdraw_jnt',
  ];

  await ManageableJSAPI.grantManagerPermissions(jntPayableServiceAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of JNT payable service granted');
  return null;
};
