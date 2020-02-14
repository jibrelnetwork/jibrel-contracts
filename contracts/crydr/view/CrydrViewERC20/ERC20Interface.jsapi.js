import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const ERC20InterfaceArtifact = global.artifacts.require('CrydrViewERC20Interface.sol');


/**
 * ERC20
 */

export const name = async (contractAddress) =>
  await ERC20InterfaceArtifact.at(contractAddress).name();

export const symbol = async (contractAddress) =>
  await ERC20InterfaceArtifact.at(contractAddress).symbol();

export const decimals = async (contractAddress) =>
  await ERC20InterfaceArtifact.at(contractAddress).decimals();


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
  const instance = await ERC20InterfaceArtifact.at(crydrViewAddress);
  const txHash = await instance.transfer(toAddress, '0x' + valueTransferred.toString(16), { from: spenderAddress });
  global.console.log(`\tTokens successfully transferred: ${txHash}`);
  return txHash.tx;
};

export const totalSupply = async (contractAddress) => {
  const inst = await ERC20InterfaceArtifact.at(contractAddress);
  return inst.totalSupply();
}

export const balanceOf = async (contractAddress, ownerAddress) => {
  const inst = await ERC20InterfaceArtifact.at(contractAddress);
  return inst.balanceOf(ownerAddress);
}


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
  const instance = await ERC20InterfaceArtifact.at(crydrViewAddress);
  const txHash = await instance.approve(spenderAddress, '0x' + valueApproved.toString(16), { from: approverAddress });
  global.console.log(`\tSpending of tokens successfully approved: ${txHash}`);
  return txHash.tx;
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
  const instance = await ERC20InterfaceArtifact.at(crydrViewAddress);
  const txHash = await instance.transferFrom(fromAddress, toAddress, '0x' + valueTransferred.toString(16), { from: spenderAddress });
  global.console.log(`\tTokens successfully transferred From: ${txHash}`);
  return txHash.tx;
};


export const allowance = async (contractAddress, ownerAddress, spenderAddress) => {
   const i = await ERC20InterfaceArtifact.at(contractAddress);
   return await i.allowance(ownerAddress, spenderAddress);
}


/**
 * Events
 */

export const getTransferEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = ERC20InterfaceArtifact
  //   .at(contractAddress)
  //   .Transfer(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await ERC20InterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('Transfer', filter);
  return events;
};

export const getApprovalEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = ERC20InterfaceArtifact
  //   .at(contractAddress)
  //   .Approval(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await ERC20InterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('Approval', filter);
  return events;
};
