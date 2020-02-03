import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const ERC20InterfaceArtifact = global.artifacts.require('CrydrViewERC20Interface.sol');


/**
 * ERC20
 */

export const name = async (contractAddress) =>
  ERC20InterfaceArtifact.at(contractAddress).name.call();

export const symbol = async (contractAddress) =>
  ERC20InterfaceArtifact.at(contractAddress).symbol.call();

export const decimals = async (contractAddress) =>
  ERC20InterfaceArtifact.at(contractAddress).decimals.call();


export const transfer = async (crydrViewAddress, spenderAddress,
                               toAddress, valueTransferred) => {
  global.console.log('\tTransfer tokens:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tspenderAddress - ${spenderAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueTransferred - ${valueTransferred}`);
  // const txHash = await submitTxAndWaitConfirmation(
  //   ERC20InterfaceArtifact
  //     .at(crydrViewAddress)
  //     .transfer
  //     .sendTransaction,
  //   [toAddress, valueTransferred],
  //   { from: spenderAddress }
  // );
  let instance = await ERC20InterfaceArtifact.at(crydrViewAddress);
  await instance.transfer(toAddress, valueTransferred, { from: spenderAddress });
  global.console.log(`\tTokens successfully transferred: ${txHash}`);
  return txHash;
};

export const totalSupply = async (contractAddress) =>
  ERC20InterfaceArtifact.at(contractAddress).totalSupply.call();

export const balanceOf = async (contractAddress, ownerAddress) =>
  ERC20InterfaceArtifact.at(contractAddress).balanceOf.call(ownerAddress);


export const approve = async (crydrViewAddress, approverAddress,
                              spenderAddress, valueApproved) => {
  global.console.log('\tApprove transfers of tokens:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tapproverAddress - ${approverAddress}`);
  global.console.log(`\t\tspenderAddress - ${spenderAddress}`);
  global.console.log(`\t\tvalueApproved - ${valueApproved}`);
  // const txHash = await submitTxAndWaitConfirmation(
  //   ERC20InterfaceArtifact
  //     .at(crydrViewAddress)
  //     .approve
  //     .sendTransaction,
  //   [spenderAddress, valueApproved],
  //   { from: approverAddress }
  // );
  let instance = await ERC20InterfaceArtifact.at(crydrViewAddress);
  await instance.approve(spenderAddress, valueApproved, { from: approverAddress });
  global.console.log(`\tSpending of tokens successfully approved: ${txHash}`);
  return txHash;
};

export const transferFrom = async (crydrViewAddress, spenderAddress,
                                   fromAddress, toAddress, valueTransferred) => {
  global.console.log('\tTransferFrom tokens:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tspenderAddress - ${spenderAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueTransferred - ${valueTransferred}`);
  // const txHash = await submitTxAndWaitConfirmation(
  //   ERC20InterfaceArtifact
  //     .at(crydrViewAddress)
  //     .transferFrom
  //     .sendTransaction,
  //   [fromAddress, toAddress, valueTransferred],
  //   { from: spenderAddress }
  // );
  let instance = await ERC20InterfaceArtifact.at(crydrViewAddress);
  await instance.transferFrom(fromAddress, toAddress, valueTransferred, { from: spenderAddress });
  global.console.log(`\tTokens successfully transferred From: ${txHash}`);
  return txHash;
};

export const allowance = async (contractAddress, ownerAddress, spenderAddress) =>
  ERC20InterfaceArtifact.at(contractAddress).allowance.call(ownerAddress, spenderAddress);


/**
 * Events
 */

export const getTransferEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = ERC20InterfaceArtifact
    .at(contractAddress)
    .Transfer(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getApprovalEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = ERC20InterfaceArtifact
    .at(contractAddress)
    .Approval(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
