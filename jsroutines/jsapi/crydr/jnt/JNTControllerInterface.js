import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const ManageableJSAPI   = require('../../lifecycle/Manageable');

const JNTControllerInterface = global.artifacts.require('JNTControllerInterface.sol');


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
    JNTControllerInterface
      .at(crydrControllerAddress)
      .chargeJNT
      .sendTransaction,
    [fromAccount, toAccount, valueToCharge, { from: managerAddress }]);
  global.console.log('\tJNT successfully charged');
  return null;
};


/**
 * Events
 */

export const getJNTChargedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = JNTControllerInterface
    .at(contractAddress)
    .JNTChargedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (jntControllerAddress, ownerAddress, jntPayableServiceAddress) => {
  global.console.log('\tConfiguring manager permissions for JNT controller ...');
  global.console.log(`\t\tjntControllerAddress - ${jntControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);

  const managerPermissions = [
    'jnt_payable_service',
  ];

  await ManageableJSAPI.grantManagerPermissions(jntControllerAddress,
                                                ownerAddress,
                                                jntPayableServiceAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of JNT controller granted');
  return null;
};
