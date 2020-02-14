import { submitTxAndWaitConfirmation } from '../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const BytecodeExecutorInterfaceArtifact = global.artifacts.require('BytecodeExecutorInterface.sol');


/**
 * Setters
 */

export const executeCall = async (contractAddress, managerAddress,
                                  targetAddress, suppliedGas, ethValue, transactionBytecode) => {
  global.console.log('\tExecute "call" opcode:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\ttargetAddress - ${targetAddress}`);
  global.console.log(`\t\tsuppliedGas - ${suppliedGas}`);
  global.console.log(`\t\tethValue - ${ethValue}`);
  // await submitTxAndWaitConfirmation(
  //   BytecodeExecutorInterfaceArtifact
  //     .at(contractAddress)
  //     .executeCall
  //     .sendTransaction,
  //   [targetAddress, suppliedGas, ethValue, transactionBytecode],
  //   { from: managerAddress }
  // );
  const instance = await BytecodeExecutorInterfaceArtifact.at(contractAddress);
  await instance.executeCall(targetAddress, suppliedGas, ethValue, transactionBytecode, { from: managerAddress });
  global.console.log('\t\t"call" opcode successfully executed');
};

export const executeDelegatecall = async (contractAddress, managerAddress,
                                          targetAddress, suppliedGas, transactionBytecode) => {
  global.console.log('\tExecute "delegatecall" opcode:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\ttargetAddress - ${targetAddress}`);
  global.console.log(`\t\tsuppliedGas - ${suppliedGas}`);
  // await submitTxAndWaitConfirmation(
  //   BytecodeExecutorInterfaceArtifact
  //     .at(contractAddress)
  //     .executeDelegatecall
  //     .sendTransaction,
  //   [targetAddress, suppliedGas, transactionBytecode],
  //   { from: managerAddress },
  // );
  const instance = await BytecodeExecutorInterfaceArtifact.at(contractAddress);
  await instance.executeDelegatecall(targetAddress, suppliedGas, transactionBytecode, { from: managerAddress });
  global.console.log('\t\t"delegatecall" opcode successfully executed');
};


/**
 * Events
 */

export const getCallExecutedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = BytecodeExecutorInterfaceArtifact.at(contractAddress).CallExecutedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getDelegatecallExecutedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = BytecodeExecutorInterfaceArtifact.at(contractAddress).DelegatecallExecutedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
