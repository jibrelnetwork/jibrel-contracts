import { submitTxAndWaitConfirmation } from '../../routine/misc/SubmitTx';

const PausableTest = global.artifacts.require('PausableTest.sol');

const UtilsTestRoutines  = require('../../routine/misc/UtilsTest');
const ManageableRoutines = require('../../routine/lifecycle/Manageable');
const PausableRoutines   = require('../../routine/lifecycle/Pausable');


global.contract('Pausable', (accounts) => {
  let pausableContract;

  const owner     = accounts[0];
  const manager01 = accounts[1];
  const manager02 = accounts[2];

  global.beforeEach(async () => {
    pausableContract = await PausableTest.new({ from: owner });

    await ManageableRoutines.grantManagerPermissions(pausableContract.address, owner, manager01,
                                                     ['pause_contract']);
    await ManageableRoutines.grantManagerPermissions(pausableContract.address, owner, manager02,
                                                     ['unpause_contract']);
    await ManageableRoutines.enableManager(pausableContract.address, owner, manager01);
    await ManageableRoutines.enableManager(pausableContract.address, owner, manager02);
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log(`\tpausableContract: ${pausableContract.address}`);
    global.assert.notEqual(pausableContract.address, 0x0);

    let isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, true, 'Just deployed pausable contract must be paused');
    let contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 0);

    await submitTxAndWaitConfirmation(pausableContract.workswhenContractPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 1);

    await PausableRoutines.unpauseContract(pausableContract.address, manager02);
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, false, 'Expected that contract is unpaused');

    await submitTxAndWaitConfirmation(pausableContract.workswhenContractNotPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 2);

    await PausableRoutines.pauseContract(pausableContract.address, manager01);
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, true, 'Expected that contract is unpaused');

    await submitTxAndWaitConfirmation(pausableContract.workswhenContractPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 3);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    global.console.log(`\tpausableContract: ${pausableContract.address}`);
    global.assert.notEqual(pausableContract.address, 0x0);

    let isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, true, 'Just deployed pausable contract must be paused');

    await UtilsTestRoutines.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                                [{ from: manager01 }],
                                                'Only manager should be able to unpause contract');
    await UtilsTestRoutines.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                                [{ from: manager02 }],
                                                'It should not be possible to pause already paused contract');

    await PausableRoutines.unpauseContract(pausableContract.address, manager02);
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, false, 'Expected that contract is unpaused');

    await UtilsTestRoutines.checkContractThrows(pausableContract.pauseContract.sendTransaction,
                                                [{ from: manager02 }],
                                                'Only manager should be able to pause contract');
    await UtilsTestRoutines.checkContractThrows(pausableContract.unpauseContract.sendTransaction,
                                                [{ from: manager01 }],
                                                'It should not be possible to unpause already unpaused contract');
  });

  global.it('should test that modifiers works correctly', async () => {
    global.console.log(`\tpausableContract: ${pausableContract.address}`);
    global.assert.notEqual(pausableContract.address, 0x0);

    let isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, true, 'Just deployed pausable contract must be paused');
    let contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 0);

    await submitTxAndWaitConfirmation(pausableContract.workswhenContractPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 1);

    await UtilsTestRoutines.checkContractThrows(pausableContract.workswhenContractNotPaused.sendTransaction, [],
                                                'Modifiers should prohibit method when contract is paused');
    contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 1);

    await PausableRoutines.unpauseContract(pausableContract.address, manager02);
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, false, 'Expected that contract is unpaused');

    await submitTxAndWaitConfirmation(pausableContract.workswhenContractNotPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 2);
    await UtilsTestRoutines.checkContractThrows(pausableContract.workswhenContractPaused.sendTransaction, [],
                                                'Modifiers should prohibit method when contract is unpaused');
    contractCounter = await pausableContract.counter.call();
    global.assert.equal(contractCounter, 2);
  });

  global.it('should test that functions fire events', async () => {
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
  });
});
