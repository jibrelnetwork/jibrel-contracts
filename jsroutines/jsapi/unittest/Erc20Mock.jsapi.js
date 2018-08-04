import { submitTxAndWaitConfirmation } from '../../util/SubmitTx';

const Promise = require('bluebird');

const Erc20Mock = global.artifacts.require('Erc20Mock.sol');


/**
 * setters
 */

export const transfer = async (contractAddress, senderAddress, toAddress, valueWei) => {
  global.console.log('\tTransfer tokens:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tsenderAddress - ${senderAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  const txHash = await submitTxAndWaitConfirmation(
    Erc20Mock
      .at(contractAddress)
      .transfer
      .sendTransaction,
    [toAddress, valueWei, { from: senderAddress }]);
  global.console.log('\tTokens successfully transferred');
  return txHash;
};

export const mint = async (contractAddress, contractOwner, toAddress, valueWei) => {
  global.console.log('\tMint tokens:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tcontractOwner - ${contractOwner}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  const txHash = await submitTxAndWaitConfirmation(
    Erc20Mock
      .at(contractAddress)
      .mint
      .sendTransaction,
    [toAddress, valueWei, { from: contractOwner }]);
  global.console.log('\tTokens successfully minted');
  return txHash;
};


/**
 * Getters
 */

export const totalSupply = async (contractAddress) =>
  Erc20Mock.at(contractAddress).totalSupply.call();

export const balanceOf = async (contractAddress, userAddress) =>
  Erc20Mock.at(contractAddress).balanceOf.call(userAddress);


/**
 * Events
 */

export const getTransferEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = Erc20Mock.at(contractAddress).Transfer(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getMintEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = Erc20Mock.at(contractAddress).MintEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
