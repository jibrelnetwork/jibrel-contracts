import { submitTxAndWaitConfirmation } from '../../../routine/misc/SubmitTx';
import {checkContractThrows} from "../../../routine/misc/UtilsTest";

const CrydrControllerMintable = global.artifacts.require('CrydrControllerMintable.sol');
const CrydrStorage            = global.artifacts.require('CrydrStorage.sol');
const CrydrViewBase           = global.artifacts.require('CrydrViewBase.sol');

const UtilsTestRoutines               = require('../../../routine/misc/UtilsTest');
const ManageableRoutines              = require('../../../routine/lifecycle/Manageable');
const PausableRoutines                = require('../../../routine/lifecycle/Pausable');
const CrydrControllerBaseRoutines     = require('../../../routine/crydr/controller/CrydrControllerBaseInterface');
const crydrStorageGeneralRoutines     = require('../../../routine/crydr/storage/CrydrStorageGeneral');


global.contract('CrydrControllerMintable', (accounts) => {
  let crydrControllerMintableContract;
  let crydrStorageContract;
  let crydrViewBaseContract;

  const owner      = accounts[0];
  const manager01  = accounts[1];
  const manager02  = accounts[2];
  const manager03  = accounts[3];
  const investor01 = accounts[4];

  const viewName = 'TestView';

  global.beforeEach(async () => {
    crydrControllerMintableContract = await CrydrControllerMintable.new({ from: owner });
    crydrStorageContract            = await CrydrStorage.new({ from: owner });
    crydrViewBaseContract           = await CrydrViewBase.new(viewName, { from: owner });

    await ManageableRoutines.grantManagerPermissions(crydrControllerMintableContract.address, owner, manager02,
                                                     ['mint_crydr']);
    await ManageableRoutines.grantManagerPermissions(crydrControllerMintableContract.address, owner, manager03,
                                                     ['burn_crydr']);
    await ManageableRoutines.enableManager(crydrControllerMintableContract.address, owner, manager02);
    await ManageableRoutines.enableManager(crydrControllerMintableContract.address, owner, manager03);
    await CrydrControllerBaseRoutines.configureCrydrController(crydrControllerMintableContract.address, owner, manager01,
                                                               crydrStorageContract.address,
                                                               new Map([[viewName, crydrViewBaseContract.address]]),
                                                               false, false, []);
    await crydrStorageGeneralRoutines.configureCrydrStorage(crydrStorageContract.address, owner, manager02,
                                                            crydrControllerMintableContract.address);
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log('\tcrydrControllerMintableContract: ${crydrControllerMintableContract.address}');
    global.assert.notStrictEqual(crydrControllerMintableContract.address, '0x0000000000000000000000000000000000000000');

    global.console.log('\tcrydrStorageContract: ${crydrStorageContract.address}');
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    global.console.log('\tcrydrViewBaseContract: ${crydrViewBaseContract.address}');
    global.assert.notStrictEqual(crydrViewBaseContract.address, '0x0000000000000000000000000000000000000000');

    let isPaused = await crydrControllerMintableContract.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Just configured crydrControllerMintable contract must be unpaused');

    let storageAddress = await crydrControllerMintableContract.getCrydrStorage.call();
    global.assert.strictEqual(storageAddress, crydrStorageContract.address, 'Just configured crydrControllerMintable should have initialized crydrStorage address');

    let viewsNumber = await crydrControllerMintableContract.getCrydrViewsNumber.call();
    global.assert.strictEqual(viewsNumber.toNumber(), 1, 'Just configured crydrControllerMintable should have a view');

    let viewAddress = await crydrControllerMintableContract.getCrydrViewByNumber.call(0);
    global.assert.strictEqual(viewAddress, crydrViewBaseContract.address, 'Expected that crydrView is set');

    viewAddress = await crydrControllerMintableContract.getCrydrView.call(viewName);
    global.assert.strictEqual(viewAddress, crydrViewBaseContract.address, 'Expected that crydrView is set');

    const initialBalance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(initialBalance.toNumber(), 0, 'Expected that initial balance is 0');

    await submitTxAndWaitConfirmation(crydrControllerMintableContract.mint.sendTransaction,
                                      [investor01, 10 * (10 ** 18), { from: manager02 }]);
    let balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(balance.toNumber(), 10 * (10 ** 18), 'Expected that balance has increased');

    await submitTxAndWaitConfirmation(crydrControllerMintableContract.burn.sendTransaction,
                                      [investor01, 10 * (10 ** 18), { from: manager03 }]);
    balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(balance.toNumber(), 0, 'Expected that balance has decreased');
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    global.console.log('\tcrydrControllerMintableContract: ${crydrControllerMintableContract.address}');
    global.assert.notStrictEqual(crydrControllerMintableContract.address, '0x0000000000000000000000000000000000000000');

    global.console.log('\tcrydrStorageContract: ${crydrStorageContract.address}');
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    global.console.log('\tcrydrViewBaseContract: ${crydrViewBaseContract.address}');
    global.assert.notStrictEqual(crydrViewBaseContract.address, '0x0000000000000000000000000000000000000000');

    let isPaused = await crydrControllerMintableContract.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Just configured crydrControllerBase contract must be unpaused');

    await UtilsTestRoutines.checkContractThrows(crydrControllerMintableContract.mint.sendTransaction,
                                                [0x0, 100 * (10 ** 18), { from: manager02 }],
                                                'Should be a valid account address');

    await UtilsTestRoutines.checkContractThrows(crydrControllerMintableContract.mint.sendTransaction,
                                                [investor01, 0, { from: manager02 }],
                                                'Should be a positive value');

    await UtilsTestRoutines.checkContractThrows(crydrControllerMintableContract.mint.sendTransaction,
                                                [investor01, 100 * (10 ** 18), { from: manager03 }],
                                                'Only manager should be able to mint');

    await UtilsTestRoutines.checkContractThrows(crydrControllerMintableContract.burn.sendTransaction,
                                                [0x0, 100 * (10 ** 18), { from: manager03 }],
                                                'Should be a valid account address');

    await UtilsTestRoutines.checkContractThrows(crydrControllerMintableContract.burn.sendTransaction,
                                                [investor01, 0, { from: manager03 }],
                                                'Should be a positive value');

    await UtilsTestRoutines.checkContractThrows(crydrControllerMintableContract.burn.sendTransaction,
                                                [investor01, 100 * (10 ** 18), { from: manager02 }],
                                                'Only manager should be able to burn');
  });
});
