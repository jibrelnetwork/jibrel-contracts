import { submitTxAndWaitConfirmation } from '../../../routine/misc/SubmitTx';

const JNTPayableServiceERC20 = global.artifacts.require('JNTPayableServiceERC20.sol');
const JNTController          = global.artifacts.require('JNTController.sol');

const UtilsTestRoutines              = require('../../../routine/misc/UtilsTest');
const ManageableRoutines             = require('../../../routine/lifecycle/Manageable');
const PausableRoutines               = require('../../../routine/lifecycle/Pausable');
const JNTPayableServiceERC20Routines = require('../../../routine/crydr/jnt/JNTPayableServiceERC20');


global.contract('JNTPayableServiceERC20', (accounts) => {
  let jntPayableServiceERC20Contract;
  let jntControllerContract;

  const owner       = accounts[0];
  const manager01   = accounts[1];
  const manager02   = accounts[2];
  const manager03   = accounts[3];
  const manager04   = accounts[4];
  const manager05   = accounts[5];
  const manager06   = accounts[6];
  const beneficiary = accounts[7];

  global.beforeEach(async () => {
    jntPayableServiceERC20Contract = await JNTPayableServiceERC20.new({ from: owner });
    jntControllerContract = await JNTController.new({ from: owner });

    await ManageableRoutines.grantManagerPermissions(jntPayableServiceERC20Contract.address, owner, manager01,
                                                     ['pause_contract']);
    await ManageableRoutines.grantManagerPermissions(jntPayableServiceERC20Contract.address, owner, manager02,
                                                     ['unpause_contract']);
    await ManageableRoutines.grantManagerPermissions(jntPayableServiceERC20Contract.address, owner, manager03,
                                                     ['set_jnt_controller']);
    await ManageableRoutines.grantManagerPermissions(jntPayableServiceERC20Contract.address, owner, manager04,
                                                     ['set_jnt_beneficiary']);
    await ManageableRoutines.grantManagerPermissions(jntPayableServiceERC20Contract.address, owner, manager05,
                                                     ['set_jnt_price']);
    await ManageableRoutines.grantManagerPermissions(jntPayableServiceERC20Contract.address, owner, manager06,
                                                     ['withdraw_jnt']);
    await ManageableRoutines.enableManager(jntPayableServiceERC20Contract.address, owner, manager01);
    await ManageableRoutines.enableManager(jntPayableServiceERC20Contract.address, owner, manager02);
    await ManageableRoutines.enableManager(jntPayableServiceERC20Contract.address, owner, manager03);
    await ManageableRoutines.enableManager(jntPayableServiceERC20Contract.address, owner, manager04);
    await ManageableRoutines.enableManager(jntPayableServiceERC20Contract.address, owner, manager05);
    await ManageableRoutines.enableManager(jntPayableServiceERC20Contract.address, owner, manager06);
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log(`\tjntPayableServiceERC20Contract: ${jntPayableServiceERC20Contract.address}`);
    global.assert.notStrictEqual(jntPayableServiceERC20Contract.address, '0x0000000000000000000000000000000000000000');

    global.console.log(`\tjntControllerContract: ${jntControllerContract.address}`);
    global.assert.notStrictEqual(jntControllerContract.address, '0x0000000000000000000000000000000000000000');

    let isPaused = await jntPayableServiceERC20Contract.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Just deployed jntPayableService contract must be paused');

    let controllerAddress = await jntPayableServiceERC20Contract.getJntController.call();
    global.assert.strictEqual(controllerAddress, '0x0000000000000000000000000000000000000000', 'Just deployed jntPayableService contract should have noninitialized jntController address');

    await submitTxAndWaitConfirmation(jntPayableServiceERC20Contract.setJntController.sendTransaction,
      [jntControllerContract.address, { from: manager03 }]);
    controllerAddress = await jntPayableServiceERC20Contract.getJntController.call();
    global.assert.strictEqual(controllerAddress, jntControllerContract.address, 'Expected that jntController is set');

    let beneficiaryAddress = await jntPayableServiceERC20Contract.getJntBeneficiary.call();
    global.assert.strictEqual(beneficiaryAddress, '0x0000000000000000000000000000000000000000', 'Just deployed jntPayableService contract should have noninitialized jntBeneficiary address');

    await submitTxAndWaitConfirmation(jntPayableServiceERC20Contract.setJntBeneficiary.sendTransaction,
      [beneficiary, { from: manager04 }]);
    beneficiaryAddress = await jntPayableServiceERC20Contract.getJntBeneficiary.call();
    global.assert.strictEqual(beneficiaryAddress, beneficiary, 'Expected that jntBeneficiary is set');

    let jntPriceTransfer = await jntPayableServiceERC20Contract.getJntPriceForTransfer.call();
    let jntPriceTransferFrom = await jntPayableServiceERC20Contract.getJntPriceForTransferFrom.call();
    let jntPriceApprove = await jntPayableServiceERC20Contract.getJntPriceForApprove.call();
    global.assert.strictEqual(jntPriceTransfer.toNumber() === 0 &&
      jntPriceTransferFrom.toNumber() === 0 && jntPriceApprove.toNumber() === 0, true, 'Expected that jnt prices is noninitialized');

    await submitTxAndWaitConfirmation(jntPayableServiceERC20Contract.setJntPrice.sendTransaction,
      [100 * (10 ** 18), 110 * (10 ** 18), 120 * (10 ** 18), { from: manager05 }]);
    jntPriceTransfer = await jntPayableServiceERC20Contract.getJntPriceForTransfer.call();
    jntPriceTransferFrom = await jntPayableServiceERC20Contract.getJntPriceForTransferFrom.call();
    jntPriceApprove = await jntPayableServiceERC20Contract.getJntPriceForApprove.call();
    global.assert.strictEqual(jntPriceTransfer.toNumber() === 100 * (10 ** 18) &&
      jntPriceTransferFrom.toNumber() === 110 * (10 ** 18) &&
      jntPriceApprove.toNumber() === 120 * (10 ** 18), true, 'Expected that jnt prices is initialized');

    await PausableRoutines.unpauseContract(jntPayableServiceERC20Contract.address, manager02);
    isPaused = await jntPayableServiceERC20Contract.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');

    await PausableRoutines.pauseContract(jntPayableServiceERC20Contract.address, manager01);
    isPaused = await jntPayableServiceERC20Contract.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Expected that contract is unpaused');
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    global.console.log(`\tjntPayableServiceERC20Contract: ${jntPayableServiceERC20Contract.address}`);
    global.assert.notStrictEqual(jntPayableServiceERC20Contract.address, '0x0000000000000000000000000000000000000000');

    let isPaused = await jntPayableServiceERC20Contract.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Just deployed pausable contract must be paused');

    await UtilsTestRoutines.checkContractThrows(jntPayableServiceERC20Contract.setJntPrice.sendTransaction,
                                                [100 * (10 ** 18), 110 * (10 ** 18), 120 * (10 ** 18), { from: manager01 }],
                                                'Only manager should be able to set JntController');

    await submitTxAndWaitConfirmation(jntPayableServiceERC20Contract.setJntController.sendTransaction,
      [jntControllerContract.address, { from: manager03 }]);
    await submitTxAndWaitConfirmation(jntPayableServiceERC20Contract.setJntBeneficiary.sendTransaction,
      [beneficiary, { from: manager04 }]);
    await PausableRoutines.unpauseContract(jntPayableServiceERC20Contract.address, manager02);
    isPaused = await jntPayableServiceERC20Contract.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');

    await UtilsTestRoutines.checkContractThrows(jntPayableServiceERC20Contract.setJntPrice.sendTransaction,
                                                [100 * (10 ** 18), 110 * (10 ** 18), 120 * (10 ** 18), { from: manager05 }],
                                                'It should not be possible to set jnt prices while contract is unpaused');
  });

  global.it('should test that functions fire events', async () => {
    const isPaused = await jntPayableServiceERC20Contract.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Just deployed jntPayableServiceERC20 contract must be paused');

    let blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(jntPayableServiceERC20Contract.setJntPrice.sendTransaction,
      [100 * (10 ** 18), 0, 0, { from: manager05 }]);
    let pastEvents = await JNTPayableServiceERC20Routines.getJNTPriceTransferChangedEvents(jntPayableServiceERC20Contract.address,
                                                             {},
                                                             {
                                                               fromBlock: blockNumber + 1,
                                                               toBlock:   blockNumber + 1,
                                                               address:   manager05,
                                                             });
    global.assert.strictEqual(pastEvents.length, 1, 'The JNTPriceTransferChanged event must be raised');


    blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(jntPayableServiceERC20Contract.setJntPrice.sendTransaction,
      [0, 0, 120 * (10 ** 18), { from: manager05 }]);
    pastEvents = await JNTPayableServiceERC20Routines.getJNTPriceApproveChangedEvents(jntPayableServiceERC20Contract.address,
                                                       {},
                                                       {
                                                         fromBlock: blockNumber + 1,
                                                         toBlock:   blockNumber + 1,
                                                         address:   manager05,
                                                       });
    global.assert.strictEqual(pastEvents.length, 1, 'The JNTPriceApproveChanged event must be raised');


    blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(jntPayableServiceERC20Contract.setJntPrice.sendTransaction,
      [0, 110 * (10 ** 18), 0, { from: manager05 }]);
    pastEvents = await JNTPayableServiceERC20Routines.getJNTPriceTransferFromChangedEvents(jntPayableServiceERC20Contract.address,
                                                       {},
                                                       {
                                                         fromBlock: blockNumber + 1,
                                                         toBlock:   blockNumber + 1,
                                                         address:   manager05,
                                                       });
    global.assert.strictEqual(pastEvents.length, 1, 'The JNTPriceTransferFromChanged event must be raised');
  });
});
