import { submitTxAndWaitConfirmation } from '../../util/SubmitTx';

const Promise = require('bluebird');

const JcashRegistrar = global.artifacts.require('JcashRegistrar.sol');

const ManageableJSAPI = require('../../jsapi/lifecycle/Manageable');


/**
 * Getters
 */

export const balanceEth = async (contractAddress) => JcashRegistrar.at(contractAddress).balanceEth.call();

export const balanceToken = async (contractAddress, tokenAddress) => JcashRegistrar.at(contractAddress).balanceToken.call(tokenAddress);

export const isProcessedTx = async (contractAddress, txHash) => JcashRegistrar.at(contractAddress).isProcessedTx.call(txHash);


/**
 * Manage contract
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
    JcashRegistrar
      .at(contractAddress)
      .withdrawToken
      .sendTransaction,
    [tokenAddress, value, { from: replenisherAddress }]
  );
  global.console.log('\tSuccessfully withdraw');
  return txHash;
};


/**
 * Manage exchange
 */

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
    JcashRegistrar
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
    JcashRegistrar
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
    JcashRegistrar
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


/**
 * Permissions
 */

export const grantReplenisherPermissions = async (contractAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring replenisher permissions for JcashRegistrar contract ...');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'replenish_eth',
    'replenish_token',
  ];

  await ManageableJSAPI.grantManagerPermissions(contractAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to replenisher of JcashRegistrar contract granted');
  return null;
};

export const grantExchangeManagerPermissions = async (contractAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring exchange manager permissions for JcashRegistrar contract ...');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'refund_eth',
    'refund_token',
    'transfer_eth',
    'transfer_token',
  ];

  await ManageableJSAPI.grantManagerPermissions(contractAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to exchange manager of JcashRegistrar contract granted');
  return null;
};
