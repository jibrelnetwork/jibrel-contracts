import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const JNTPayableServiceERC20FeesInterface = global.artifacts.require('JNTPayableServiceERC20FeesInterface.sol');

const ManageableJSAPI   = require('../../lifecycle/Manageable');


/**
 * Configuration
 */

export const setJntPrice = async (crydrControllerAddress, managerAddress,
                                  jntPriceTransfer, jntPriceTransferFrom, jntPriceApprove) => {
  global.console.log('\tSet JNT price:');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tjntPriceTransfer - ${jntPriceTransfer}`);
  global.console.log(`\t\tjntPriceTransferFrom - ${jntPriceTransferFrom}`);
  global.console.log(`\t\tjntPriceApprove - ${jntPriceApprove}`);
  await submitTxAndWaitConfirmation(
    JNTPayableServiceERC20FeesInterface
      .at(crydrControllerAddress)
      .setJntPrice
      .sendTransaction,
    [jntPriceTransfer, jntPriceTransferFrom, jntPriceApprove, { from: managerAddress }]);
  global.console.log('\tJNT price of JNT payable service successfully set');
  return null;
};

export const getJntPriceForTransfer = async (contractAddress) =>
  JNTPayableServiceERC20FeesInterface.at(contractAddress).getJntPriceForTransfer.call();

export const getJntPriceForTransferFrom = async (contractAddress) =>
  JNTPayableServiceERC20FeesInterface.at(contractAddress).getJntPriceForTransferFrom.call();

export const getJntPriceForApprove = async (contractAddress) =>
  JNTPayableServiceERC20FeesInterface.at(contractAddress).getJntPriceForApprove.call();


/**
 * Events
 */

export const getJNTPriceTransferChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceERC20FeesInterface
    .at(contractAddress)
    .JNTPriceTransferChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTPriceTransferFromChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceERC20FeesInterface
    .at(contractAddress)
    .JNTPriceTransferFromChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getJNTPriceApproveChangedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = JNTPayableServiceERC20FeesInterface
    .at(contractAddress)
    .JNTPriceApproveChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (jntControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for JNT payable service ...');
  global.console.log(`\t\tjntControllerAddress - ${jntControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_jnt_price',
  ];

  await ManageableJSAPI.grantManagerPermissions(jntControllerAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of JNT payable service granted');
  return null;
};
