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
  // await submitTxAndWaitConfirmation(
  //   JNTPayableServiceInterfaceArtifact
  //     .at(jntPayableServiceAddress)
  //     .setJntController
  //     .sendTransaction,
  //   [jntControllerAddress],
  //   { from: managerAddress }
  // );

  const instance = await JNTPayableServiceInterfaceArtifact.at(jntPayableServiceAddress);
  let res = await instance.setJntController(jntControllerAddress,  {from: managerAddress });
  global.console.log('\tJNT controller of JNT payable service successfully set', res.tx);
  return null;
};

export const getJntController = async (contractAddress) => {
  const instance = await JNTPayableServiceInterfaceArtifact.at(contractAddress);
  return await instance.getJntController();
}


export const setJntBeneficiary = async (jntPayableServiceAddress, managerAddress,
                                        jntBeneficiaryAddress) => {
  global.console.log('\tSet JNT beneficiary of JNT payable service:');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tjntBeneficiaryAddress - ${jntBeneficiaryAddress}`);
  // await submitTxAndWaitConfirmation(
  //   JNTPayableServiceInterfaceArtifact
  //     .at(jntPayableServiceAddress)
  //     .setJntBeneficiary
  //     .sendTransaction,
  //   [jntBeneficiaryAddress],
  //   { from: managerAddress }
  // );
  const instance = await JNTPayableServiceInterfaceArtifact.at(jntPayableServiceAddress);
  await instance.setJntBeneficiary(jntBeneficiaryAddress, {from: managerAddress});
  global.console.log('\tJNT beneficiary of JNT payable service successfully set');
  return null;
};

export const getJntBeneficiary = async (contractAddress) => {
  const instance = await JNTPayableServiceInterfaceArtifact.at(contractAddress);
  return await instance.getJntBeneficiary();
}


export const setActionPrice = async (jntPayableServiceAddress, managerAddress,
                                     actionName, jntPriceWei) => {
  global.console.log('\tSet action price of JNT payable service:');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tactionName - ${actionName}`);
  global.console.log(`\t\tjntPriceWei - ${jntPriceWei}`);
  // await submitTxAndWaitConfirmation(
  //   JNTPayableServiceInterfaceArtifact
  //     .at(jntPayableServiceAddress)
  //     .setActionPrice
  //     .sendTransaction,
  //   [actionName, jntPriceWei],
  //   { from: managerAddress }
  // );
  const instance = await JNTPayableServiceInterfaceArtifact.at(jntPayableServiceAddress);
  await instance.setActionPrice(actionName, '0x' + jntPriceWei.toString(16),  {from: managerAddress });
  global.console.log('\tAction price of JNT payable service successfully set');
  return null;
};


export const getActionPrice = async (contractAddress, actionName) => {
  const instance = await JNTPayableServiceInterfaceArtifact.at(contractAddress);
  return await instance.getActionPrice(actionName);
}


/**
 * Events
 */

export const getJNTControllerChangedEvents = async (contractAddress, eventDataFilter, commonFilter) => {
  // const eventObj = JNTPayableServiceInterfaceArtifact
  //   .at(contractAddress)
  //   .JNTControllerChangedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await JNTPayableServiceInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('JNTControllerChangedEvent', filter);
  return events;
};

export const getJNTBeneficiaryChangedEvents = async (contractAddress, eventDataFilter, commonFilter) => {
  // const eventObj = JNTPayableServiceInterfaceArtifact
  //   .at(contractAddress)
  //   .JNTBeneficiaryChangedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await JNTPayableServiceInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('JNTBeneficiaryChangedEvent', filter);
  return events;
};

export const getJNTChargedEvents = async (contractAddress, eventDataFilter, commonFilter) => {
  // const eventObj = JNTPayableServiceInterfaceArtifact
  //   .at(contractAddress)
  //   .JNTChargedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await JNTPayableServiceInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('JNTChargedEvent', filter);
  return events;
};
