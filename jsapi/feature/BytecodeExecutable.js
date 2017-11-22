import { submitTxAndWaitConfirmation } from '../misc/SubmitTx';

const Promise = require('bluebird');

const BytecodeExecutable = global.artifacts.require('BytecodeExecutable.sol');


/**
 * Setters
 */

export const executeBytecode = async (contractAddress, managerAddress,
                                      targetAddress, ethValue, transactionBytecode) => {
  global.console.log('\tExecute bytecode:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\ttargetAddress - ${targetAddress}`);
  global.console.log(`\t\tethValue - ${ethValue}`);
  await submitTxAndWaitConfirmation(
    BytecodeExecutable
      .at(contractAddress)
      .executeBytecode
      .sendTransaction,
    [targetAddress, ethValue, transactionBytecode, { from: managerAddress }],
  );
  global.console.log('\t\tBytecode successfully executed');
};


/**
 * Events
 */

export const getBytecodeExecutedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = BytecodeExecutable.at(contractAddress).BytecodeExecutedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
