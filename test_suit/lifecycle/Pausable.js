import { submitTxAndWaitConfirmation } from '../../jsapi/misc/SubmitTx';

// const Pausable = global.artifacts.require('Pausable.sol');

const ManageableJSAPI = require('../../jsapi/lifecycle/Manageable');
const PausableJSAPI   = require('../../jsapi/lifecycle/Pausable');

const GlobalConfig = require('../../migrations/init/GlobalConfig');

const CheckExceptions = require('../../test_util/CheckExceptions');


export const testContractIsPausable = async (contractArtifact, constructorArgs) => {
  global.console.log('\tTest that contract is pausable and unpausable');

  const { owner, managerPause, testInvestor1 } = GlobalConfig.getAccounts();

  const pausableInstance = await contractArtifact.new(...constructorArgs, { from: owner });
  const pausableInstanceAddress = pausableInstance.address;

  await PausableJSAPI.grantManagerPermissions(pausableInstanceAddress, owner, managerPause);
  await ManageableJSAPI.enableManager(pausableInstanceAddress, owner, managerPause);


  let isPaused = await PausableJSAPI.getPaused(pausableInstanceAddress);
  global.assert.strictEqual(isPaused, true, 'New deployed contract should be paused');


  await CheckExceptions.checkContractThrows(PausableJSAPI.unpauseContract,
                                            [pausableInstanceAddress, owner],
                                            'Only allowed manager should be able to unpause contract');
  await CheckExceptions.checkContractThrows(PausableJSAPI.unpauseContract,
                                            [pausableInstanceAddress, testInvestor1],
                                            'Only allowed manager should be able to unpause contract');

  await CheckExceptions.checkContractThrows(PausableJSAPI.pauseContract,
                                            [pausableInstanceAddress, managerPause],
                                            'Contract can not be paused again');


  let blockNumber = global.web3.eth.blockNumber;
  await PausableJSAPI.unpauseContract(pausableInstanceAddress, managerPause);
  let pastEvents = await PausableJSAPI.getUnpauseEvents(pausableInstanceAddress,
                                                        {},
                                                        {
                                                          fromBlock: blockNumber + 1,
                                                          toBlock:   blockNumber + 1,
                                                          address:   managerPause,
                                                        });
  global.assert.strictEqual(pastEvents.length, 1);


  isPaused = await PausableJSAPI.getPaused(pausableInstanceAddress);
  global.assert.strictEqual(isPaused, false, 'Manager should be able to unpause contract');


  await CheckExceptions.checkContractThrows(PausableJSAPI.pauseContract,
                                            [pausableInstanceAddress, owner],
                                            'Only allowed manager should be able to pause contract');
  await CheckExceptions.checkContractThrows(PausableJSAPI.pauseContract,
                                            [pausableInstanceAddress, testInvestor1],
                                            'Only allowed manager should be able to pause contract');

  await CheckExceptions.checkContractThrows(PausableJSAPI.unpauseContract,
                                            [pausableInstanceAddress, managerPause],
                                            'Contract can not be unpaused again');


  blockNumber = global.web3.eth.blockNumber;
  await PausableJSAPI.pauseContract(pausableInstanceAddress, managerPause);
  pastEvents = await PausableJSAPI.getPauseEvents(pausableInstanceAddress,
                                                  {},
                                                  {
                                                    fromBlock: blockNumber + 1,
                                                    toBlock:   blockNumber + 1,
                                                    address:   managerPause,
                                                  });
  global.assert.strictEqual(pastEvents.length, 1);


  isPaused = await PausableJSAPI.getPaused(pausableInstanceAddress);
  global.assert.strictEqual(isPaused, true, 'Manager should be able to pause contract');
};

export const assertWhenContractPaused =
  async (pausableContractAddress, managerPause, testedContractFunction, functionArgs = []) => {
    global.console.log('\tTest that function works when contract is paused and throws when contract is unpaused');

    // get initial state and unpause if needed
    let isPaused = await PausableJSAPI.getPaused(pausableContractAddress);
    if (isPaused) {
      await PausableJSAPI.unpauseContract(pausableContractAddress, managerPause);
    }


    global.console.log('\t\tTest that function throws when contract is unpaused');
    await CheckExceptions.checkContractThrows(testedContractFunction, functionArgs,
                                              'Function must throw when contract is unpaused');

    await PausableJSAPI.pauseContract(pausableContractAddress, managerPause);
    isPaused = await PausableJSAPI.getPaused(pausableContractAddress);
    global.assert.strictEqual(isPaused, true);


    global.console.log('\tTest that function works when contract is paused');
    await submitTxAndWaitConfirmation(testedContractFunction, functionArgs);


    // restore state
    if (isPaused === false) {
      await PausableJSAPI.unpauseContract(pausableContractAddress, managerPause);
    }
  };

export const assertWhenContractNotPaused = async (
  pausableContractAddress, managerPause, testedContractFunction, functionArgs = []) => {
  global.console.log('\tTest that function works when contract is unpaused and throws when contract is paused');


  // get initial state and pause if needed
  let isPaused = await PausableJSAPI.getPaused(pausableContractAddress);
  if (isPaused === false) {
    await PausableJSAPI.pauseContract(pausableContractAddress, managerPause);
  }


  global.console.log('\tTest that function throws when contract is paused');
  await CheckExceptions.checkContractThrows(testedContractFunction, functionArgs,
                                            'Function must throw when contract is paused');

  await PausableJSAPI.unpauseContract(pausableContractAddress, managerPause);
  isPaused = await PausableJSAPI.getPaused(pausableContractAddress);
  global.assert.strictEqual(isPaused, false);


  global.console.log('\tTest that function works when contract is unpaused');
  await submitTxAndWaitConfirmation(testedContractFunction, functionArgs);


  // restore state
  if (isPaused === false) {
    await PausableJSAPI.pauseContract(pausableContractAddress, managerPause);
  }
};
