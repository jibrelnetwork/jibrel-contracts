import { submitTxAndWaitConfirmation } from '../../jsapi/misc/SubmitTx';

// const Pausable = global.artifacts.require('Pausable.sol');

const ManageableJSAPI = require('../../jsapi/lifecycle/Manageable');
const PausableJSAPI   = require('../../jsapi/lifecycle/Pausable');

const CheckExceptions = require('../../test_util/CheckExceptions');


export const testContractIsPausable = async (contractArtifact, constructorArgs, accounts) => {
  global.console.log('\tTest that contract is pausable and unpausable');

  const ownerAddress     = accounts[0];
  const managerAddress01 = accounts[1];
  const managerAddress02 = accounts[2];
  const miscAddress = accounts[3];


  const pausableContract = await contractArtifact.new(...constructorArgs, { from: ownerAddress });

  await ManageableJSAPI.grantManagerPermissions(pausableContract.address, ownerAddress, managerAddress01,
                                                ['pause_contract']);
  await ManageableJSAPI.grantManagerPermissions(pausableContract.address, ownerAddress, managerAddress02,
                                                ['unpause_contract']);
  await ManageableJSAPI.enableManager(pausableContract.address, ownerAddress, managerAddress01);
  await ManageableJSAPI.enableManager(pausableContract.address, ownerAddress, managerAddress02);


  let isPaused = await PausableJSAPI.getPaused(pausableContract.address);
  global.assert.strictEqual(isPaused, true, 'New deployed contract should be paused');

  await CheckExceptions.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                            [{ from: ownerAddress }],
                                            'Only allowed manager should be able to unpause contract');
  await CheckExceptions.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                            [{ from: managerAddress01 }],
                                            'Only allowed manager should be able to unpause contract');
  await CheckExceptions.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                            [{ from: miscAddress }],
                                            'Only allowed manager should be able to unpause contract');
  await CheckExceptions.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                            [{ from: managerAddress01 }],
                                            'Contract can not be paused again');


  let blockNumber = global.web3.eth.blockNumber;

  await PausableJSAPI.unpauseContract(pausableContract.address, managerAddress02);

  let pastEvents = await PausableJSAPI.getUnpauseEvents(pausableContract.address,
                                                        {},
                                                        {
                                                          fromBlock: blockNumber + 1,
                                                          toBlock:   blockNumber + 1,
                                                          address:   managerAddress02,
                                                        });
  global.assert.strictEqual(pastEvents.length, 1);


  isPaused = await PausableJSAPI.getPaused(pausableContract.address);
  global.assert.strictEqual(isPaused, false, 'Manager should be able to unpause contract');

  await CheckExceptions.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                            [{ from: ownerAddress }],
                                            'Only allowed manager should be able to pause contract');
  await CheckExceptions.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                            [{ from: managerAddress02 }],
                                            'Only allowed manager should be able to pause contract');
  await CheckExceptions.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                            [{ from: miscAddress }],
                                            'Only allowed manager should be able to pause contract');
  await CheckExceptions.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                            [{ from: managerAddress02 }],
                                            'Contract can not be unpaused again');


  blockNumber = global.web3.eth.blockNumber;

  await PausableJSAPI.pauseContract(pausableContract.address, managerAddress01);

  pastEvents = await PausableJSAPI.getPauseEvents(pausableContract.address,
                                                  {},
                                                  {
                                                    fromBlock: blockNumber + 1,
                                                    toBlock:   blockNumber + 1,
                                                    address:   managerAddress01,
                                                  });
  global.assert.strictEqual(pastEvents.length, 1);


  isPaused = await PausableJSAPI.getPaused(pausableContract.address);
  global.assert.strictEqual(isPaused, true, 'Manager should be able to pause contract');
};

export const assertWhenContractPaused = async (
  pausableContractAddress, managerPause, testedContractFunction, functionArgs = []) => {
  global.console.log('\tTest that function works when contract is paused and throws when contract is unpaused');

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
