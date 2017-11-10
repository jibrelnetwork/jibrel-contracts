import { submitTxAndWaitConfirmation } from '../../../routine/misc/SubmitTx';

const CrydrControllerERC20Mock       = global.artifacts.require('CrydrControllerERC20Mock.sol');
const CrydrViewERC20                 = global.artifacts.require('CrydrViewERC20.sol');

const UtilsTestRoutines              = require('../../../routine/misc/UtilsTest');
const ManageableRoutines             = require('../../../routine/lifecycle/Manageable');
const PausableRoutines               = require('../../../routine/lifecycle/Pausable');
const CrydrViewBaseRoutines          = require('../../../routine/crydr/view/CrydrViewBaseInterface');
const ERC20InterfaceRoutines         = require('../../../routine/crydr/view/ERC20Interface');

global.contract('CrydrViewERC20', (accounts) => {
  const owner      = accounts[0];
  const manager01  = accounts[1];
  const investor01 = accounts[3];
  const investor02 = accounts[4];

  let CrydrViewERC20Contract;
  let CrydrControllerERC20MockContract;
  const name = 'testName';
  const symbol = 'testSymbol';
  const decimals = 18;


  global.beforeEach(async () => {
    CrydrViewERC20Contract = await CrydrViewERC20.new(name, symbol, decimals, { from: owner });
    CrydrControllerERC20MockContract = await CrydrControllerERC20Mock.new(CrydrViewERC20Contract.address, { from: owner });

    await ManageableRoutines.enableManager(CrydrViewERC20Contract.address, owner, manager01);
    await ManageableRoutines.grantManagerPermissions(CrydrViewERC20Contract.address,
                                                     owner, manager01, ['set_crydr_controller', 'unpause_contract']);
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log(`\tCrydrViewERC20Contract: ${CrydrViewERC20Contract.address}`);
    global.assert.notStrictEqual(CrydrViewERC20Contract.address, '0x0000000000000000000000000000000000000000');

    let isPaused = await PausableRoutines.getPaused(CrydrViewERC20Contract.address);
    global.assert.strictEqual(isPaused, true, 'New deployed contract should be paused');

    let controllerAddress = await CrydrViewERC20Contract.getCrydrController.call();
    global.assert.strictEqual(controllerAddress, '0x0000000000000000000000000000000000000000', 'New deployed contract should have noninitialized crydrController');

    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewERC20Contract.address, manager01, CrydrControllerERC20MockContract.address);
    controllerAddress = await CrydrViewERC20Contract.getCrydrController.call();
    global.assert.strictEqual(controllerAddress, CrydrControllerERC20MockContract.address, 'crydrController should be initialized');

    PausableRoutines.unpauseContract(CrydrViewERC20Contract.address, manager01);
    isPaused = await PausableRoutines.getPaused(CrydrViewERC20Contract.address);
    global.assert.strictEqual(isPaused, false, 'contract should be unpaused');

    await submitTxAndWaitConfirmation(CrydrViewERC20Contract.transfer.sendTransaction,
      [investor02, 10 * (10 ** 18), { from: investor01 }]);
    const transferCounter = await CrydrControllerERC20MockContract.transferCounter.call();
    global.assert.strictEqual(transferCounter.toNumber(), 1);

    await submitTxAndWaitConfirmation(CrydrViewERC20Contract.approve.sendTransaction,
      [investor01, 10 * (10 ** 18), { from: investor01 }]);
    const approveCounter = await CrydrControllerERC20MockContract.approveCounter.call();
    global.assert.strictEqual(approveCounter.toNumber(), 1);

    await submitTxAndWaitConfirmation(CrydrViewERC20Contract.transferFrom.sendTransaction,
      [investor01, investor02, 10 * (10 ** 18), { from: investor01 }]);
    const transferFromCounter = await CrydrControllerERC20MockContract.transferFromCounter.call();
    global.assert.strictEqual(transferFromCounter.toNumber(), 1);

    const totalSupply = await CrydrViewERC20Contract.totalSupply.call();
    global.assert.strictEqual(totalSupply.toNumber(), 60 * (10 ** 18));

    const balanceOf = await CrydrViewERC20Contract.balanceOf.call(investor01);
    global.assert.strictEqual(balanceOf.toNumber(), 40 * (10 ** 18));

    const allowance = await CrydrViewERC20Contract.allowance.call(investor01, investor02);
    global.assert.strictEqual(allowance.toNumber(), 20 * (10 ** 18));
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    global.console.log(`\tCrydrViewERC20Contract: ${CrydrViewERC20Contract.address}`);
    global.assert.notStrictEqual(CrydrViewERC20Contract.address, '0x0000000000000000000000000000000000000000');

    let isPaused = await CrydrViewERC20Contract.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Just deployed contract must be paused');

    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewERC20Contract.address, manager01, CrydrControllerERC20MockContract.address);
    const controllerAddress = await CrydrViewERC20Contract.getCrydrController.call();
    global.assert.strictEqual(controllerAddress, CrydrControllerERC20MockContract.address, 'crydrController should be initialized');

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.transfer.sendTransaction,
                                                [investor02, 10 * (10 ** 18), { from: investor01 }],
                                                'It should not be possible to transfer already paused contract');
    let transferCounter = await CrydrControllerERC20MockContract.transferCounter.call();
    global.assert.strictEqual(transferCounter.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.approve.sendTransaction,
                                                [investor01, 10 * (10 ** 18), { from: investor01 }],
                                                'It should not be possible to approve already paused contract');
    const approveCounter = await CrydrControllerERC20MockContract.approveCounter.call();
    global.assert.strictEqual(approveCounter.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.transferFrom.sendTransaction,
                                                [investor01, investor02, 10 * (10 ** 18), { from: investor01 }],
                                                'It should not be possible to transferFrom already paused contract');
    let transferFromCounter = await CrydrControllerERC20MockContract.transferFromCounter.call();
    global.assert.strictEqual(transferFromCounter.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.emitTransferEvent.sendTransaction,
                                                [investor01, investor02, 10 * (10 ** 18), { from: investor01 }],
                                                'It should not be possible to emitTransferEvent already paused contract');

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.emitApprovalEvent.sendTransaction,
                                                [investor01, investor02, 10 * (10 ** 18), { from: investor01 }],
                                                'It should not be possible to emitTransferEvent already paused contract');

    PausableRoutines.unpauseContract(CrydrViewERC20Contract.address, manager01);
    isPaused = await PausableRoutines.getPaused(CrydrViewERC20Contract.address);
    global.assert.strictEqual(isPaused, false, 'contract should be unpaused');

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.transfer.sendTransaction,
                                                [investor02, 10 * (10 ** 18), { from: '0x27c65a2e4ebcaf9b457028ffc771b2d5f7c06f' }],
                                                'It should not be possible to transfer when a contract receives less data than it was expecting');
    transferCounter = await CrydrControllerERC20MockContract.transferCounter.call();
    global.assert.strictEqual(transferCounter.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.transferFrom.sendTransaction,
                                                [investor01, investor02, 10 * (10 ** 18), { from: '0x27c65a2e4ebcaf9b457028ffc771b2d5f7c06f' }],
                                                'It should not be possible to transfer when a contract receives less data than it was expecting');
    transferFromCounter = await CrydrControllerERC20MockContract.transferCounter.call();
    global.assert.strictEqual(transferFromCounter.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.emitTransferEvent.sendTransaction,
                                                [investor01, investor02, 10 * (10 ** 18), { from: investor01 }],
                                                'Only CrydrController can emit transfer event');

    await UtilsTestRoutines.checkContractThrows(CrydrViewERC20Contract.emitApprovalEvent.sendTransaction,
                                                [investor01, investor02, 10 * (10 ** 18), { from: investor01 }],
                                                'Only CrydrController can emit approval event');
  });

  global.it('should test that functions fire events', async () => {
    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewERC20Contract.address, manager01, CrydrControllerERC20MockContract.address);
    const controllerAddress = await CrydrViewERC20Contract.getCrydrController.call();
    global.assert.strictEqual(controllerAddress, CrydrControllerERC20MockContract.address, 'crydrController should be initialized');

    PausableRoutines.unpauseContract(CrydrViewERC20Contract.address, manager01);
    const isPaused = await PausableRoutines.getPaused(CrydrViewERC20Contract.address);
    global.assert.strictEqual(isPaused, false, 'contract should be unpaused');

    const value = 10 * (10 ** 18);

    let blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(CrydrViewERC20Contract.transfer.sendTransaction,
      [investor02, 10 * (10 ** 18), { from: investor01 }]);
    let pastEvents = await ERC20InterfaceRoutines.getTransferEvents(CrydrViewERC20Contract.address,
                                                                    { investor01, investor02, value },
                                                                    {
                                                                      fromBlock: blockNumber + 1,
                                                                      toBlock:   blockNumber + 1,
                                                                      address:   investor01,
                                                                    });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(CrydrViewERC20Contract.approve.sendTransaction,
      [investor01, 10 * (10 ** 18), { from: investor01 }]);
    pastEvents = await ERC20InterfaceRoutines.getApprovalEvents(CrydrViewERC20Contract.address,
                                                                { investor01, investor02, value },
                                                                {
                                                                  fromBlock: blockNumber + 1,
                                                                  toBlock:   blockNumber + 1,
                                                                  address:   investor01,
                                                                });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(CrydrViewERC20Contract.transferFrom.sendTransaction,
      [investor01, investor02, 10 * (10 ** 18), { from: investor01 }]);
    pastEvents = await ERC20InterfaceRoutines.getTransferEvents(CrydrViewERC20Contract.address,
                                                                { investor01, investor02, value },
                                                                {
                                                                  fromBlock: blockNumber + 1,
                                                                  toBlock:   blockNumber + 1,
                                                                  address:   investor01,
                                                                });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
