import { submitTxAndWaitConfirmation } from '../../util/SubmitTx';

const Promise = require('bluebird');

const JcashRegistrar = global.artifacts.require('JcashRegistrar.sol');


/**
 * Configuration
 */

export const changeOwner = async (contractAddress, contractOwner, newcontractOwner) => {
  global.console.log('\tChange Owner address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tcontractOwner - ${contractOwner}`);
  global.console.log(`\t\tnewcontractOwner - ${newcontractOwner}`);
  await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .changeOwner
      .sendTransaction,
    [newcontractOwner, { from: contractOwner }]);
  global.console.log('\tOwner of JcashRegistrar successfully changed');
};

export const changeManager = async (contractAddress, contractOwner, newManagerAddress) => {
  global.console.log('\tChange Manager address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tcontractOwner - ${contractOwner}`);
  global.console.log(`\t\tnewManagerAddress - ${newManagerAddress}`);
  await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .changeManager
      .sendTransaction,
    [newManagerAddress, { from: contractOwner }]);
  global.console.log('\tManger of JcashRegistrar successfully changed');
};

export const enableReplenisher = async (contractAddress, managerAddress, newReplenisherAddress) => {
  global.console.log('\tEnable Replenisher address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tnewReplenisherAddress - ${newReplenisherAddress}`);
  await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .enableReplenisher
      .sendTransaction,
    [newReplenisherAddress, { from: managerAddress }]);
  global.console.log('\tReplenisher of JcashRegistrar successfully enabled');
};

export const disableReplenisher = async (contractAddress, managerAddress, replenisherAddress) => {
  global.console.log('\tDisable Replenisher address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\treplenisherAddress - ${replenisherAddress}`);
  await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .disableReplenisher
      .sendTransaction,
    [replenisherAddress, { from: managerAddress }]);
  global.console.log('\tReplenisher of JcashRegistrar successfully disabled');
};

export const pause = async (contractAddress, contractOwner) => {
  global.console.log('\tPause JcashRegistrar:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tcontractOwner - ${contractOwner}`);
  await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .pause
      .sendTransaction,
    [{ from: contractOwner }]);
  global.console.log('\tJcashRegistrar successfully paused');
};

export const unpause = async (contractAddress, contractOwner) => {
  global.console.log('\tUnpause JcashRegistrar:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tcontractOwner - ${contractOwner}`);
  await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .unpause
      .sendTransaction,
    [{ from: contractOwner }]);
  global.console.log('\tJcashRegistrar successfully unpaused');
};


/**
 * Getters
 */

export const balance = async (contractAddress) =>
  JcashRegistrar.at(contractAddress).balance.call();

export const isReplenisher = async (contractAddress, address) =>
  JcashRegistrar.at(contractAddress).isReplenisher.call(address);

export const getPaused = async (contractAddress) =>
  JcashRegistrar.at(contractAddress).getPaused.call();

export const getManager = async (contractAddress) =>
  JcashRegistrar.at(contractAddress).getManager.call();

export const getOwner = async (contractAddress) =>
  JcashRegistrar.at(contractAddress).getOwner.call();


/**
 * Actions
 */

export const withdrawEth = async (contractAddress, replenisherAddress, value) => {
  global.console.log('\tWithdraw ETH to address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\treplenisherAddress - ${replenisherAddress}`);
  global.console.log(`\t\tvalue - ${value}`);
  const txHash = await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .withdrawEth
      .sendTransaction,
    [value, { from: replenisherAddress }]);
  global.console.log('\tSuccessfully withdraw');
  return txHash;
};

export const withdrawToken = async (contractAddress, replenisherAddress, tokenAddress, value) => {
  global.console.log('\tWithdraw token to address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\treplenisherAddress - ${replenisherAddress}`);
  global.console.log(`\t\ttokenAddress - ${tokenAddress}`);
  global.console.log(`\t\tvalue - ${value}`);
  const txHash = await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .withdrawToken
      .sendTransaction,
    [tokenAddress, value, { from: replenisherAddress }]);
  global.console.log('\tSuccessfully withdraw');
  return txHash;
};

export const refundEth = async (contractAddress, managerAddress, refundedTxHash, destinationAddress, value) => {
  global.console.log('\tRefund ETH to address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\trefundedTxHash - ${refundedTxHash}`);
  global.console.log(`\t\tdestinationAddress - ${destinationAddress}`);
  global.console.log(`\t\tvalue - ${value}`);
  const txHash = await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .refundEth
      .sendTransaction,
    [refundedTxHash, destinationAddress, value, { from: managerAddress }]);
  global.console.log('\tSuccessfully refund');
  return txHash;
};

export const refundToken = async (contractAddress, managerAddress, refundedTxHash, tokenAddress, destinationAddress, value) => {
  global.console.log('\tRefund ETH to address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\trefundedTxHash - ${refundedTxHash}`);
  global.console.log(`\t\ttokenAddress - ${tokenAddress}`);
  global.console.log(`\t\tdestinationAddress - ${destinationAddress}`);
  global.console.log(`\t\tvalue - ${value}`);
  const txHash = await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .refundToken
      .sendTransaction,
    [refundedTxHash, tokenAddress, destinationAddress, value, { from: managerAddress }]);
  global.console.log('\tSuccessfully refund');
  return txHash;
};

export const transferEth = async (contractAddress, managerAddress, processedTxHash, destinationAddress, value) => {
  global.console.log('\tTransfer ETH to address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tdestinationAddress - ${destinationAddress}`);
  global.console.log(`\t\tvalue - ${value}`);
  const txHash = await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .transferEth
      .sendTransaction,
    [processedTxHash, destinationAddress, value, { from: managerAddress }]);
  global.console.log('\tSuccessfully transfer');
  return txHash;
};

export const transferToken = async (contractAddress, managerAddress, processedTxHash, tokenAddress, destinationAddress, value) => {
  global.console.log('\tTransfer ETH to address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\ttokenAddress - ${tokenAddress}`);
  global.console.log(`\t\tdestinationAddress - ${destinationAddress}`);
  global.console.log(`\t\tvalue - ${value}`);
  const txHash = await submitTxAndWaitConfirmation(
    JcashRegistrar
      .at(contractAddress)
      .transferToken
      .sendTransaction,
    [processedTxHash, tokenAddress, destinationAddress, value, { from: managerAddress }]);
  global.console.log('\tSuccessfully transfer');
  return txHash;
};


/**
 * Events
 */

export const getReceiveEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).ReceiveEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getRefundEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).RefundEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getTransferEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).TransferEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getRefundTokenEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).RefundTokenEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getTransferTokenEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).TransferTokenEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getReplenisherEnabledEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).ReplenisherEnabledEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getReplenisherDisabledEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).ReplenisherDisabledEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getReplenishEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).ReplenishEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getWithdrawEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).WithdrawEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getWithdrawTokenEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).WithdrawTokenEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getManagerChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).ManagerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getPauseEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).PauseEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getUnpauseEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrar.at(contractAddress).UnpauseEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
