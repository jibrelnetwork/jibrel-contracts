import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageBalanceInterfaceArtifact = global.artifacts.require('CrydrStorageBalanceInterface.sol');


/**
 * Low-level change of balance
 */

export const increaseBalance = async (crydrStorageAddress, crydrControllerAddress,
                                      accountAddress, valueWei) => {
  global.console.log('\tIncrease balance of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBalanceInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .increaseBalance
  //     .sendTransaction,
  //   [accountAddress, valueWei],
  //   { from: crydrControllerAddress }
  // );
  const instance = await CrydrStorageBalanceInterfaceArtifact.at(crydrStorageAddress);
  await instance.increaseBalance(accountAddress, '0x' + valueWei.toString(16), { from: crydrControllerAddress });
  global.console.log('\tBalance successfully increased');
};

export const decreaseBalance = async (crydrStorageAddress, crydrControllerAddress,
                                      accountAddress, valueWei) => {
  global.console.log('\tDecrease balance of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBalanceInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .decreaseBalance
  //     .sendTransaction,
  //   [accountAddress, valueWei],
  //   { from: crydrControllerAddress }
  // );
  const instance = await CrydrStorageBalanceInterfaceArtifact.at(crydrStorageAddress);
  await instance.decreaseBalance(accountAddress, '0x' + valueWei.toString(16), { from: crydrControllerAddress });
  global.console.log('\tBalance successfully decreased');
};

export const getBalance = async (crydrStorageAddress, accountAddress) => {
  const i = await CrydrStorageBalanceInterfaceArtifact.at(crydrStorageAddress);
  return await i.getBalance(accountAddress);
}


export const getTotalSupply = async (crydrStorageAddress) =>{
  const i = await CrydrStorageBalanceInterfaceArtifact.at(crydrStorageAddress);
  return await i.getTotalSupply(accountAddress);
}

/**
 * Events
 */


export const getAccountBalanceIncreasedEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = CrydrStorageBalanceInterfaceArtifact
  //   .at(contractAddress)
  //   .AccountBalanceIncreasedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrStorageBalanceInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('AccountBalanceIncreasedEvent', filter);
  return events;
};

export const getAccountBalanceDecreasedEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = CrydrStorageBalanceInterfaceArtifact
  //   .at(contractAddress)
  //   .AccountBalanceDecreasedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrStorageBalanceInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('AccountBalanceDecreasedEvent', filter);
  return events;
};
