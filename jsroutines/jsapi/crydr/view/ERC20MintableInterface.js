import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const CrydrViewERC20MintableInterface = global.artifacts.require('CrydrViewERC20MintableInterface.sol');


export const emitMintEvent = async (crydrViewAddress, managerAddress,
                                    _owner, _value) => {
  global.console.log('\tEmit MintEvent:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\t_owner - ${_owner}`);
  global.console.log(`\t\t_value - ${_value}`);
  await submitTxAndWaitConfirmation(
    CrydrViewERC20MintableInterface
      .at(crydrViewAddress)
      .emitMintEvent
      .sendTransaction,
    [_owner, _value, { from: managerAddress }]);
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
  await submitTxAndWaitConfirmation(
    CrydrViewERC20MintableInterface
      .at(crydrViewAddress)
      .emitBurnEvent
      .sendTransaction,
    [_owner, _value, { from: managerAddress }]);
  global.console.log('\tBurnEvent successfully emitted');
  return null;
};
