import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrViewERC20MintableInterfaceArtifact = global.artifacts.require('CrydrViewERC20MintableInterface.sol');


export const emitMintEvent = async (crydrViewAddress, managerAddress,
                                    _owner, _value) => {
  global.console.log('\tEmit MintEvent:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\t_owner - ${_owner}`);
  global.console.log(`\t\t_value - ${_value}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrViewERC20MintableInterfaceArtifact
  //     .at(crydrViewAddress)
  //     .emitMintEvent
  //     .sendTransaction,
  //   [_owner, _value],
  //   { from: managerAddress }
  // );
  let instance = await CrydrViewERC20MintableInterfaceArtifact.at(crydrViewAddress);
  await instance.emitMintEvent(_owner, _value, {from: managerAddress });
  global.console.log('\tMintEvent successfully emitted');
  return null;
};

export const emitBurnEvent = async (crydrViewAddress, managerAddress,
                                    _owner, _value) => {
  global.console.log('\tEmit BurnEvent:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\t_owner - ${_owner}`);
  global.console.log(`\t\t_value - ${_value}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrViewERC20MintableInterfaceArtifact
  //     .at(crydrViewAddress)
  //     .emitBurnEvent
  //     .sendTransaction,
  //   [_owner, _value],
  //   { from: managerAddress }
  // );
  let instance = await CrydrViewERC20MintableInterfaceArtifact.at(crydrViewAddress);
  await instance.emitBurnEvent(_owner, _value, {from: managerAddress });
  global.console.log('\tBurnEvent successfully emitted');
  return null;
};


/**
 * Events
 */

export const getMintEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrViewERC20MintableInterfaceArtifact
    .at(contractAddress)
    .MintEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getBurnEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrViewERC20MintableInterfaceArtifact
    .at(contractAddress)
    .BurnEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
