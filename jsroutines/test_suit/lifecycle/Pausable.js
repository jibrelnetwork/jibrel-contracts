import { submitTxAndWaitConfirmation } from '../../util/SubmitTx';


import * as ManageableJSAPI from '../../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableInterfaceJSAPI   from '../../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as PausableJSAPI   from '../../../contracts/lifecycle/Pausable/Pausable.jsapi';

import * as DeployConfig from '../../jsconfig/DeployConfig';

import * as CheckExceptions from '../../util/CheckExceptions';


export const testContractIsPausable = async (contractArtifact, constructorArgs) => {
  global.console.log('\tTest that contract is pausable and unpausable');

  const { owner, managerPause, testInvestor1 } = DeployConfig.getAccounts();

  const pausableInstance = await contractArtifact.new(...constructorArgs, { from: owner });
  const pausableInstanceAddress = pausableInstance.address;

  await PausableJSAPI.grantManagerPermissions(pausableInstanceAddress, owner, managerPause);
  await ManageableJSAPI.enableManager(pausableInstanceAddress, owner, managerPause);


  let isPaused = await PausableInterfaceJSAPI.getPaused(pausableInstanceAddress);
  global.assert.strictEqual(isPaused, true, 'New deployed contract should be paused');


  let isThrows = await CheckExceptions.isContractThrows(PausableInterfaceJSAPI.unpauseContract,
                                                        [pausableInstanceAddress, owner]);
  global.assert.strictEqual(isThrows, true, 'Only allowed manager should be able to unpause contract');

  isThrows = await CheckExceptions.isContractThrows(PausableInterfaceJSAPI.unpauseContract,
                                                    [pausableInstanceAddress, testInvestor1]);
  global.assert.strictEqual(isThrows, true, 'Only allowed manager should be able to unpause contract');

  isThrows = await CheckExceptions.isContractThrows(PausableInterfaceJSAPI.pauseContract,
                                                    [pausableInstanceAddress, managerPause]);
  global.assert.strictEqual(isThrows, true, 'Contract can not be paused again');


  let blockNumber = global.web3.eth.blockNumber;
  await PausableInterfaceJSAPI.unpauseContract(pausableInstanceAddress, managerPause);
  let pastEvents = await PausableInterfaceJSAPI.getUnpauseEvents(pausableInstanceAddress,
                                                                 {},
                                                                 {
                                                                   fromBlock: blockNumber + 1,
                                                                   toBlock:   blockNumber + 1,
                                                                   address:   managerPause,
                                                                 });
  global.assert.strictEqual(pastEvents.length, 1);


  isPaused = await PausableInterfaceJSAPI.getPaused(pausableInstanceAddress);
  global.assert.strictEqual(isPaused, false, 'Manager should be able to unpause contract');


  isThrows = await CheckExceptions.isContractThrows(PausableInterfaceJSAPI.pauseContract,
                                                    [pausableInstanceAddress, owner]);
  global.assert.strictEqual(isThrows, true, 'Only allowed manager should be able to pause contract');
  isThrows = await CheckExceptions.isContractThrows(PausableInterfaceJSAPI.pauseContract,
                                                    [pausableInstanceAddress, testInvestor1]);
  global.assert.strictEqual(isThrows, true, 'Only allowed manager should be able to pause contract');
  isThrows = await CheckExceptions.isContractThrows(PausableInterfaceJSAPI.unpauseContract,
                                                    [pausableInstanceAddress, managerPause]);
  global.assert.strictEqual(isThrows, true, 'Contract can not be unpaused again');


  blockNumber = global.web3.eth.blockNumber;
  await PausableInterfaceJSAPI.pauseContract(pausableInstanceAddress, managerPause);
  pastEvents = await PausableInterfaceJSAPI.getPauseEvents(pausableInstanceAddress,
                                                           {},
                                                           {
                                                             fromBlock: blockNumber + 1,
                                                             toBlock:   blockNumber + 1,
                                                             address:   managerPause,
                                                           });
  global.assert.strictEqual(pastEvents.length, 1);


  isPaused = await PausableInterfaceJSAPI.getPaused(pausableInstanceAddress);
  global.assert.strictEqual(isPaused, true, 'Manager should be able to pause contract');
};

export const assertWhenContractPaused =
  async (pausableContractAddress, managerPause, testedContractFunction, functionArgs = []) => {
    global.console.log('\tTest that function works when contract is paused and throws when contract is unpaused');

    // get initial state and unpause if needed
    let isPaused = await PausableInterfaceJSAPI.getPaused(pausableContractAddress);
    if (isPaused) {
      await PausableInterfaceJSAPI.unpauseContract(pausableContractAddress, managerPause);
    }


    global.console.log('\t\tTest that function throws when contract is unpaused');
    const isThrows = await CheckExceptions.isContractThrows(testedContractFunction, functionArgs);
    global.assert.strictEqual(isThrows, true, 'Function must throw when contract is unpaused');

    await PausableInterfaceJSAPI.pauseContract(pausableContractAddress, managerPause);
    isPaused = await PausableInterfaceJSAPI.getPaused(pausableContractAddress);
    global.assert.strictEqual(isPaused, true);


    global.console.log('\tTest that function works when contract is paused');
    await submitTxAndWaitConfirmation(testedContractFunction, functionArgs);


    // restore state
    if (isPaused === false) {
      await PausableInterfaceJSAPI.unpauseContract(pausableContractAddress, managerPause);
    }
  };

export const assertWhenContractNotPaused = async (
  pausableContractAddress, managerPause, testedContractFunction, functionArgs = []) => {
  global.console.log('\tTest that function works when contract is unpaused and throws when contract is paused');


  // get initial state and pause if needed
  let isPaused = await PausableInterfaceJSAPI.getPaused(pausableContractAddress);
  if (isPaused === false) {
    await PausableInterfaceJSAPI.pauseContract(pausableContractAddress, managerPause);
  }


  global.console.log('\tTest that function throws when contract is paused');
  const isThrows = await CheckExceptions.isContractThrows(testedContractFunction, functionArgs);
  global.assert.strictEqual(isThrows, true, 'Function must throw when contract is paused');

  await PausableInterfaceJSAPI.unpauseContract(pausableContractAddress, managerPause);
  isPaused = await PausableInterfaceJSAPI.getPaused(pausableContractAddress);
  global.assert.strictEqual(isPaused, false);


  global.console.log('\tTest that function works when contract is unpaused');
  await submitTxAndWaitConfirmation(testedContractFunction, functionArgs);


  // restore state
  if (isPaused === false) {
    await PausableInterfaceJSAPI.pauseContract(pausableContractAddress, managerPause);
  }
};
