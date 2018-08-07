import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const JNTPayableServiceInterfaceArtifact = global.artifacts.require('JNTPayableServiceInterface.sol');


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
    JNTPayableServiceInterfaceArtifact
      .at(jntPayableServiceAddress)
      .setJntController
      .sendTransaction,
    [jntControllerAddress, { from: managerAddress }]);
  global.console.log('\tJNT controller of JNT payable service successfully set');
  return null;
};

export const getJntController = async (contractAddress) =>
  JNTPayableServiceInterfaceArtifact.at(contractAddress).getJntController.call();


export const setJntBeneficiary = async (jntPayableServiceAddress, managerAddress,
                                        jntBeneficiaryAddress) => {
  global.console.log('\tSet JNT beneficiary of JNT payable service:');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tjntBeneficiaryAddress - ${jntBeneficiaryAddress}`);
  await submitTxAndWaitConfirmation(
    JNTPayableServiceInterfaceArtifact
      .at(jntPayableServiceAddress)
      .setJntBeneficiary
      .sendTransaction,
    [jntBeneficiaryAddress, { from: managerAddress }]);
  global.console.log('\tJNT beneficiary of JNT payable service successfully set');
  return null;
};

export const getJntBeneficiary = async (contractAddress) =>
  JNTPayableServiceInterfaceArtifact.at(contractAddress).getJntBeneficiary.call();



export const setActionPrice = async (jntPayableServiceAddress, managerAddress,
                                     actionName, jntPriceWei) => {
  global.console.log('\tSet JNT beneficiary of JNT payable service:');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tactionName - ${actionName}`);
  global.console.log(`\t\tjntPriceWei - ${jntPriceWei}`);
  await submitTxAndWaitConfirmation(
    JNTPayableServiceInterfaceArtifact
      .at(jntPayableServiceAddress)
      .setActionPrice
      .sendTransaction,
    [actionName, jntPriceWei, { from: managerAddress }]);
  global.console.log('\tJNT beneficiary of JNT payable service successfully set');
  return null;
};

export const getActionPrice = async (contractAddress, actionName) =>
  JNTPayableServiceInterfaceArtifact.at(contractAddress).getActionPrice.call(actionName);


/**
 * Events
 */

export const getJNTControllerChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceInterfaceArtifact
    .at(contractAddress)
    .JNTControllerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTBeneficiaryChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceInterfaceArtifact
    .at(contractAddress)
    .JNTBeneficiaryChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTChargedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceInterfaceArtifact
    .at(contractAddress)
    .JNTChargedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
