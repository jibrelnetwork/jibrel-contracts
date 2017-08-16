import { submitTxAndWaitConfirmation } from '../../../routine/misc/SubmitTx';
import {checkContractThrows} from "../../../routine/misc/UtilsTest";

const CrydrControllerBase = global.artifacts.require('CrydrControllerBase.sol');
const CrydrStorage        = global.artifacts.require('CrydrStorage.sol');
const CrydrViewBase       = global.artifacts.require('CrydrViewBase.sol');

const UtilsTestRoutines           = require('../../../routine/misc/UtilsTest');
const ManageableRoutines          = require('../../../routine/lifecycle/Manageable');
const PausableRoutines            = require('../../../routine/lifecycle/Pausable');
const CrydrControllerBaseRoutines = require('../../../routine/crydr/controller/CrydrControllerBaseInterface');
const CrydrStorageGeneral         = require('../../../routine/crydr/storage/CrydrStorageGeneral');


global.contract('CrydrControllerBase', (accounts) => {
  let crydrControllerBaseContract;
  let crydrStorageContract;
  let crydrViewBaseContract;

  const owner     = accounts[0];
  const manager01 = accounts[1];
  const manager02 = accounts[2];
  const manager03 = accounts[3];
  const manager04 = accounts[4];
  const manager05 = accounts[5];

  const viewName = 'TestView';

  global.beforeEach(async () => {
    crydrControllerBaseContract = await CrydrControllerBase.new({ from: owner });
    crydrStorageContract        = await CrydrStorage.new({ from: owner });
    crydrViewBaseContract       = await CrydrViewBase.new(viewName, { form: owner });

    await ManageableRoutines.grantManagerPermissions(crydrControllerBaseContract.address, owner, manager01,
                                                     ['pause_contract']);
    await ManageableRoutines.grantManagerPermissions(crydrControllerBaseContract.address, owner, manager02,
                                                     ['unpause_contract']);
    await ManageableRoutines.grantManagerPermissions(crydrControllerBaseContract.address, owner, manager03,
                                                     ['set_crydr_storage']);
    await ManageableRoutines.grantManagerPermissions(crydrControllerBaseContract.address, owner, manager04,
                                                     ['set_crydr_view']);
    await ManageableRoutines.grantManagerPermissions(crydrControllerBaseContract.address, owner, manager05,
                                                     ['remove_crydr_view']);
    await ManageableRoutines.enableManager(crydrControllerBaseContract.address, owner, manager01);
    await ManageableRoutines.enableManager(crydrControllerBaseContract.address, owner, manager02);
    await ManageableRoutines.enableManager(crydrControllerBaseContract.address, owner, manager03);
    await ManageableRoutines.enableManager(crydrControllerBaseContract.address, owner, manager04);
    await ManageableRoutines.enableManager(crydrControllerBaseContract.address, owner, manager05);
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log('\tcrydrControllerBaseContract: ${crydrControllerBaseContract.address}');
    global.assert.notEqual(crydrControllerBaseContract.address, 0x0);

    global.console.log('\tcrydrStorageContract: ${crydrStorageContract.address}');
    global.assert.notEqual(crydrStorageContract.address, 0x0);

    global.console.log('\tcrydrViewBaseContract: ${crydrViewBaseContract.address}');
    global.assert.notEqual(crydrViewBaseContract.address, 0x0);

    let isPaused = await crydrControllerBaseContract.getPaused.call();
    global.assert.equal(isPaused, true, 'Just deployed crydrControllerBase contract must be paused');

    let storageAddress = await crydrControllerBaseContract.getCrydrStorage.call();
    global.assert.equal(storageAddress, 0x0, 'Just deployed crydrControllerBase should have noninitialized crydrStorage address');

    await submitTxAndWaitConfirmation(crydrControllerBaseContract.setCrydrStorage.sendTransaction,
                                      [crydrStorageContract.address, { from: manager03 }]);
    storageAddress = await crydrControllerBaseContract.getCrydrStorage.call();
    global.assert.equal(storageAddress, crydrStorageContract.address, 'Expected that crydrStorage is set');

    let viewsNumber = await crydrControllerBaseContract.getCrydrViewsNumber.call();
    global.assert.equal(viewsNumber.toNumber(), 0, 'Just deployed crydrControllerBase should have no views');

    await submitTxAndWaitConfirmation(crydrControllerBaseContract.setCrydrView.sendTransaction,
                                      [viewName, crydrViewBaseContract.address, { from: manager04 }]);
    let viewsAddress = await crydrControllerBaseContract.getCrydrView.call(viewName);
    global.assert.equal(viewsAddress, crydrViewBaseContract.address, 'Expected that crydrView is set');

    viewsNumber = await crydrControllerBaseContract.getCrydrViewsNumber.call();
    global.assert.equal(viewsNumber.toNumber(), 1, 'Expected that controller have only one view');

    viewsAddress = await crydrControllerBaseContract.getCrydrViewByNumber.call(0);
    global.assert.equal(viewsAddress, crydrViewBaseContract.address, 'Expected that crydrView is set');

    await submitTxAndWaitConfirmation(crydrControllerBaseContract.removeCrydrView.sendTransaction,
                                      [viewName, { from: manager05 }]);
    viewsNumber = await crydrControllerBaseContract.getCrydrViewsNumber.call();
    global.assert.equal(viewsNumber.toNumber(), 0, 'Expected that controller have no any views');

    await PausableRoutines.unpauseContract(crydrControllerBaseContract.address, manager02);
    isPaused = await crydrControllerBaseContract.getPaused.call();
    global.assert.equal(isPaused, false, 'Expected that contract is unpaused');
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    global.console.log('\tcrydrControllerBaseContract: ${crydrControllerBaseContract.address}');
    global.assert.notEqual(crydrControllerBaseContract.address, 0x0);

    global.console.log('\tcrydrStorageContract: ${crydrStorageContract.address}');
    global.assert.notEqual(crydrStorageContract.address, 0x0);

    global.console.log('\tcrydrViewBaseContract: ${crydrViewBaseContract.address}');
    global.assert.notEqual(crydrViewBaseContract.address, 0x0);

    let isPaused = await crydrControllerBaseContract.getPaused.call();
    global.assert.equal(isPaused, true, 'Just deployed crydrControllerBase contract must be paused');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrStorage.sendTransaction,
                                                [crydrStorageContract.address, { from: manager01 }],
                                                'Only manager should be able to set CrydrStorage');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrStorage.sendTransaction,
                                                [0x0, { from: manager03 }],
                                                'Should be a valid address of CrydrStorage');

    //todo uncomment
    //await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrStorage.sendTransaction,
    //                                            [manager01, { from: manager03 }],
    //                                            'The _crydrStorage parameter should be a contract');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.getCrydrViewByNumber.call,
                                                [0], 'Just deployed crydrControllerBase should have no views');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrView.sendTransaction,
                                                [viewName, crydrViewBaseContract.address, { from: manager01 }],
                                                'Only manager should be able to add a CrydrView');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrView.sendTransaction,
                                                [viewName, 0x0, { from: manager04 }],
                                                'Should be a valid address of CrydrView');

    //todo uncomment
    //await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrView.sendTransaction,
    //                                            [viewName, manager01, { from: manager04 }],
    //                                            'The _crydrView parameter should be a contract');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrView.sendTransaction,
                                                ['', crydrViewBaseContract.address, { from: manager04 }],
                                                'viewAPIStandardName could not be empty');

    await submitTxAndWaitConfirmation(crydrControllerBaseContract.setCrydrView.sendTransaction,
                                      [viewName, crydrViewBaseContract.address, { from: manager04 }]);

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrView.sendTransaction,
                                                [viewName, crydrViewBaseContract.address, { from: manager04 }],
                                                'Should be a different view address');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.removeCrydrView.sendTransaction,
                                                [viewName, { from: manager01 }],
                                                'Only manager should be able to remove a CrydrView');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.removeCrydrView.sendTransaction,
                                                ['', { from: manager05 }],
                                                'viewAPIStandardName could not be empty');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.unpause.sendTransaction,
                                                [{ from: manager01 }],
                                                'Only manager should be able to unpause');

    await PausableRoutines.unpauseContract(crydrControllerBaseContract.address, manager02);
    isPaused = await crydrControllerBaseContract.getPaused.call();
    global.assert.equal(isPaused, false, 'Expected that contract is unpaused');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.unpause.sendTransaction,
                                                [{ from: manager02 }],
                                                'It should not be possible to unpause already unpaused contract');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrStorage.sendTransaction,
                                                [crydrStorageContract.address, { from: manager03 }],
                                                'It should no be possible to set crydrStorage if contract is unpaused');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.setCrydrView.sendTransaction,
                                                [viewName, crydrViewBaseContract.address, { from: manager04 }],
                                                'It should no be possible to set crydrView if contract is unpaused');

    await UtilsTestRoutines.checkContractThrows(crydrControllerBaseContract.removeCrydrView.sendTransaction,
                                                [viewName, { from: manager05 }],
                                                'It should no be possible to remove a view if contract is unpaused');
  });

  global.it('should test that functions fire events', async () => {
    let blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(crydrControllerBaseContract.setCrydrStorage.sendTransaction,
                                      [crydrStorageContract.address, { from: manager03 }]);
    const crydrStorageAddress = crydrStorageContract.address;
    let pastEvents = await CrydrControllerBaseRoutines.getCrydrStorageChangedEvents(crydrControllerBaseContract.address,
                                                                      {
                                                                        crydrStorageAddress,
                                                                      },
                                                                      {
                                                                        fromBlock: blockNumber + 1,
                                                                        toBlock:   blockNumber + 1,
                                                                        address:   manager03,
                                                                      });
    global.assert.equal(pastEvents.length, 1);

    blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(crydrControllerBaseContract.setCrydrView.sendTransaction,
                                      [viewName, crydrViewBaseContract.address, { from: manager04 }]);
    const crydrControllerAddress = crydrStorageContract.address;
    pastEvents = await CrydrControllerBaseRoutines.getCrydrViewAddedEvents(crydrControllerBaseContract.address,
                                                                      {
                                                                        viewName, crydrViewAddress,
                                                                      },
                                                                      {
                                                                        fromBlock: blockNumber + 1,
                                                                        toBlock:   blockNumber + 1,
                                                                        address:   manager04,
                                                                      });
    global.assert.equal(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await submitTxAndWaitConfirmation(crydrControllerBaseContract.removeCrydrView.sendTransaction,
                                      [viewName, { from: manager05 }]);
    const crydrViewAddress = crydrViewBaseContract.address;
    pastEvents = await CrydrControllerBaseRoutines.getCrydrViewRemovedEvents(crydrControllerBaseContract.address,
                                                                   {
                                                                     viewName, crydrViewAddress,
                                                                   },
                                                                   {
                                                                     fromBlock: blockNumber + 1,
                                                                     toBlock:   blockNumber + 1,
                                                                     address:   manager05,
                                                                   });
    global.assert.equal(pastEvents.length, 1);
  });
});
