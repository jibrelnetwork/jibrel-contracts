import { submitTxAndWaitConfirmation } from '../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const Erc20MockArtifact = global.artifacts.require('Erc20Mock.sol');


/**
 * setters
 */

export const transfer = async (contractAddress, senderAddress, toAddress, valueWei) => {
  global.console.log('\tTransfer tokens:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tsenderAddress - ${senderAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  // const txHash = await submitTxAndWaitConfirmation(
  //   Erc20MockArtifact
  //     .at(contractAddress)
  //     .transfer
  //     .sendTransaction,
  //   [toAddress, valueWei],
  //   { from: senderAddress }
  // );
  const instance = await Erc20MockArtifact.at(contractAddress);
  const txHash = await instance.transfer(toAddress, valueWei, { from: senderAddress });
  global.console.log('\tTokens successfully transferred');
  return txHash.tx;
};

export const mint = async (contractAddress, contractOwner, toAddress, valueWei) => {
  global.console.log('\tMint tokens:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tcontractOwner - ${contractOwner}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  // const txHash = await submitTxAndWaitConfirmation(
  //   Erc20MockArtifact
  //     .at(contractAddress)
  //     .mint
  //     .sendTransaction,
  //   [toAddress, valueWei],
  //   { from: contractOwner }
  // );
  const instance = await Erc20MockArtifact.at(contractAddress);
  const txHash = await instance.mint(toAddress, valueWei, { from: contractOwner });
  global.console.log('\tTokens successfully minted');
  return txHash.tx;
};


/**
 * Getters
 */

export const totalSupply = async (contractAddress) => {
  const i = await Erc20MockArtifact.at(contractAddress);
  return await i.totalSupply(userAddress);
}


export const balanceOf = async (contractAddress, userAddress) =>{
  const i = await Erc20MockArtifact.at(contractAddress);
  return await i.balanceOf(userAddress);
}



/**
 * Events
 */

export const getTransferEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = Erc20MockArtifact.at(contractAddress).Transfer(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await Erc20MockArtifact.at(contractAddress);
  const events = await i.getPastEvents('Transfer', filter);
  return events;
};

export const getMintEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = Erc20MockArtifact.at(contractAddress).MintEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await Erc20MockArtifact.at(contractAddress);
  const events = await i.getPastEvents('MintEvent', filter);
  return events;
};
