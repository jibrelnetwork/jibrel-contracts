import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const JNTControllerInterfaceArtifact = global.artifacts.require('JNTControllerInterface.sol');


/**
 * Setters
 */

export const chargeJNT = async (crydrControllerAddress, managerAddress,
                                fromAccount, toAccount, valueToCharge) => {
  global.console.log('\tCharge JNT:');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tfromAccount - ${fromAccount}`);
  global.console.log(`\t\ttoAccount - ${toAccount}`);
  global.console.log(`\t\tvalueToCharge - ${valueToCharge}`);
  await submitTxAndWaitConfirmation(
    JNTControllerInterfaceArtifact
      .at(crydrControllerAddress)
      .chargeJNT
      .sendTransaction,
    [fromAccount, toAccount, valueToCharge],
    { from: managerAddress }
  );
  global.console.log('\tJNT successfully charged');
  return null;
};


/**
 * Events
 */

export const getJNTChargedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JNTControllerInterfaceArtifact
    .at(contractAddress)
    .JNTChargedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
