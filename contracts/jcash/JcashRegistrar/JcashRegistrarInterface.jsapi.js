import { submitTxAndWaitConfirmation } from '../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const JcashRegistrarArtifact = global.artifacts.require('JcashRegistrar.sol');

/**
 * Getters
 */

export const isProcessedTx = async (contractAddress, txHash) => JcashRegistrarArtifact.at(contractAddress).isProcessedTx.call(txHash);


/**
 * Replenisher actions
 */

export const withdrawEth = async (contractAddress, replenisherAddress, value) => {
  global.console.log('\tWithdraw ETH to address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\treplenisherAddress - ${replenisherAddress}`);
  global.console.log(`\t\tvalue - ${value}`);
  const txHash = await submitTxAndWaitConfirmation(
    JcashRegistrarArtifact
      .at(contractAddress)
      .withdrawEth
      .sendTransaction,
    [value, { from: replenisherAddress }]
  );
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
    JcashRegistrarArtifact
      .at(contractAddress)
      .withdrawToken
      .sendTransaction,
    [tokenAddress, value, { from: replenisherAddress }]
  );
  global.console.log('\tSuccessfully withdraw');
  return txHash;
};


/**
 * Processing of exchange operations
 */

export const refundEth = async (contractAddress, managerAddress, refundedTxHash, destinationAddress, value) => {
  global.console.log('\tRefund ETH to address:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\trefundedTxHash - ${refundedTxHash}`);
  global.console.log(`\t\tdestinationAddress - ${destinationAddress}`);
  global.console.log(`\t\tvalue - ${value}`);
  const txHash = await submitTxAndWaitConfirmation(
    JcashRegistrarArtifact
      .at(contractAddress)
      .refundEth
      .sendTransaction,
    [refundedTxHash, destinationAddress, value, { from: managerAddress }]
  );
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
    JcashRegistrarArtifact
      .at(contractAddress)
      .refundToken
      .sendTransaction,
    [refundedTxHash, tokenAddress, destinationAddress, value, { from: managerAddress }]
  );
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
    JcashRegistrarArtifact
      .at(contractAddress)
      .transferEth
      .sendTransaction,
    [processedTxHash, destinationAddress, value, { from: managerAddress }]
  );
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
    JcashRegistrarArtifact
      .at(contractAddress)
      .transferToken
      .sendTransaction,
    [processedTxHash, tokenAddress, destinationAddress, value, { from: managerAddress }]
  );
  global.console.log('\tSuccessfully transfer');
  return txHash;
};


/**
 * Events
 */

export const getReceiveEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrarArtifact.at(contractAddress).ReceiveEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getRefundEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrarArtifact.at(contractAddress).RefundEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getTransferEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrarArtifact.at(contractAddress).TransferEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getRefundTokenEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrarArtifact.at(contractAddress).RefundTokenEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getTransferTokenEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrarArtifact.at(contractAddress).TransferTokenEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getReplenishEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrarArtifact.at(contractAddress).ReplenishEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getWithdrawEthEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrarArtifact.at(contractAddress).WithdrawEthEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getWithdrawTokenEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JcashRegistrarArtifact.at(contractAddress).WithdrawTokenEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
