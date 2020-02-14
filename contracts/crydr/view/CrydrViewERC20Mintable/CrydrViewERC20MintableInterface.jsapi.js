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
  const instance = await CrydrViewERC20MintableInterfaceArtifact.at(crydrViewAddress);
  await instance.emitMintEvent(_owner, '0x'+ _value.toString(16), {from: managerAddress });
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
  const instance = await CrydrViewERC20MintableInterfaceArtifact.at(crydrViewAddress);
  await instance.emitBurnEvent(_owner, '0x'+ _value.toString(16)  , {from: managerAddress });
  global.console.log('\tBurnEvent successfully emitted');
  return null;
};


/**
 * Events
 */

export const getMintEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrViewERC20MintableInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('MintEvent', filter);
  return events;
};

export const getBurnEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrViewERC20MintableInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('BurnEvent', filter);
  return events;
};
