import { submitTxAndWaitConfirmation } from '../../routine/misc/SubmitTx';

// const Pausable = global.artifacts.require('Pausable.sol');

const UtilsTestRoutines  = require('../../routine/misc/UtilsTest');
const ManageableRoutines = require('../../routine/lifecycle/Manageable');
const PausableRoutines   = require('../../routine/lifecycle/Pausable');


export const testContractIsPausable = async (contractArtifact, constructorArgs, accounts) => {
  global.console.log('\tTest that contract is pausable and unpausable');

  const owner       = accounts[0];
  const manager01   = accounts[1];
  const manager02   = accounts[2];
  const miscAddress = accounts[3];


  const pausableContract = await contractArtifact.new(...constructorArgs, { from: owner });

  await ManageableRoutines.grantManagerPermissions(pausableContract.address, owner, manager01,
                                                   ['pause_contract']);
  await ManageableRoutines.grantManagerPermissions(pausableContract.address, owner, manager02,
                                                   ['unpause_contract']);
  await ManageableRoutines.enableManager(pausableContract.address, owner, manager01);
  await ManageableRoutines.enableManager(pausableContract.address, owner, manager02);


  let isPaused = await PausableRoutines.getPaused(pausableContract.address);
  global.assert.equal(isPaused, true, 'New deployed contract should be paused');

  await UtilsTestRoutines.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                              [{ from: owner }],
                                              'Only allowed manager should be able to unpause contract');
  await UtilsTestRoutines.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                              [{ from: manager01 }],
                                              'Only allowed manager should be able to unpause contract');
  await UtilsTestRoutines.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                              [{ from: miscAddress }],
                                              'Only allowed manager should be able to unpause contract');
  await UtilsTestRoutines.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                              [{ from: manager01 }],
                                              'Contract can not be paused again');


  let blockNumber = global.web3.eth.blockNumber;

  await PausableRoutines.unpauseContract(pausableContract.address, manager02);

  let pastEvents = await PausableRoutines.getUnpauseEvents(pausableContract.address,
                                                           {},
                                                           {
                                                             fromBlock: blockNumber + 1,
                                                             toBlock:   blockNumber + 1,
                                                             address:   manager02,
                                                           });
  global.assert.equal(pastEvents.length, 1);


  isPaused = await PausableRoutines.getPaused(pausableContract.address);
  global.assert.equal(isPaused, false, 'Manager should be able to unpause contract');

  await UtilsTestRoutines.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                              [{ from: owner }],
                                              'Only allowed manager should be able to pause contract');
  await UtilsTestRoutines.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                              [{ from: manager02 }],
                                              'Only allowed manager should be able to pause contract');
  await UtilsTestRoutines.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                              [{ from: miscAddress }],
                                              'Only allowed manager should be able to pause contract');
  await UtilsTestRoutines.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                              [{ from: manager02 }],
                                              'Contract can not be unpaused again');


  blockNumber = global.web3.eth.blockNumber;

  await PausableRoutines.pauseContract(pausableContract.address, manager01);

  pastEvents = await PausableRoutines.getPauseEvents(pausableContract.address,
                                                     {},
                                                     {
                                                       fromBlock: blockNumber + 1,
                                                       toBlock:   blockNumber + 1,
                                                       address:   manager01,
                                                     });
  global.assert.equal(pastEvents.length, 1);


  isPaused = await PausableRoutines.getPaused(pausableContract.address);
  global.assert.equal(isPaused, true, 'Manager should be able to pause contract');
};

export const assertWhenContractPaused = async (
  contractAddress, manager, contractFunction, functionArgs = []) => {
  global.console.log('\tTest that function works when contract is paused and throws when contract is unpaused');

  let isPaused = await PausableRoutines.getPaused(contractAddress);
  if (isPaused) {
    await PausableRoutines.unpauseContract(contractAddress, manager);
  }


  global.console.log('\t\tTest that function throws when contract is unpaused');
  await UtilsTestRoutines.checkContractThrows(contractFunction, functionArgs,
                                              'Function must throw when contract is unpaused');

  await PausableRoutines.pauseContract(contractAddress, manager);
  isPaused = await PausableRoutines.getPaused(contractAddress);
  global.assert.equal(isPaused, true);


  global.console.log('\tTest that function works when contract is paused');
  await submitTxAndWaitConfirmation(contractFunction, functionArgs);


  // restore state
  if (isPaused === false) {
    await PausableRoutines.unpauseContract(contractAddress, manager);
  }
};

export const assertWhenContractNotPaused = async (
  contractAddress, manager, contractFunction, functionArgs = []) => {
  global.console.log('\tTest that function works when contract is unpaused and throws when contract is paused');

  let isPaused = await PausableRoutines.getPaused(contractAddress);
  if (isPaused === false) {
    await PausableRoutines.pauseContract(contractAddress, manager);
  }


  global.console.log('\tTest that function throws when contract is paused');
  await UtilsTestRoutines.checkContractThrows(contractFunction, functionArgs,
                                              'Function must throw when contract is paused');

  await PausableRoutines.unpauseContract(contractAddress, manager);
  isPaused = await PausableRoutines.getPaused(contractAddress);
  global.assert.equal(isPaused, false);


  global.console.log('\tTest that function works when contract is unpaused');
  await submitTxAndWaitConfirmation(contractFunction, functionArgs);


  // restore state
  if (isPaused === false) {
    await PausableRoutines.pauseContract(contractAddress, manager);
  }
};
