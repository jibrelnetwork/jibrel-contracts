import { submitTxAndWaitConfirmation } from '../../../routine/misc/SubmitTx';

const CrydrViewBase                  = global.artifacts.require('CrydrViewBase.sol');
const CrydrControllerNoLicense       = global.artifacts.require('CrydrControllerNoLicense.sol');

const UtilsTestRoutines              = require('../../../routine/misc/UtilsTest');
const ManageableRoutines             = require('../../../routine/lifecycle/Manageable');
const PausableRoutines               = require('../../../routine/lifecycle/Pausable');
const CrydrViewBaseRoutines          = require('../../../routine/crydr/view/CrydrViewBaseInterface');

global.contract('CrydrViewBase', (accounts) => {
  const owner     = accounts[0];
  const manager01 = accounts[1];
  const manager02 = accounts[2];

  let CrydrViewBaseContract01;
  let CrydrViewBaseContract02;
  let CrydrControllerNoLicenseContract;
  const standardName = 'testName';
  const standardNameHash = '0x698c8efcda9e563cf153563941b60fc5ac88336fc58d361eb0888686fadb9976';


  global.beforeEach(async () => {
    CrydrControllerNoLicenseContract = await CrydrControllerNoLicense.new(1, { from: owner });
    CrydrViewBaseContract01 = await CrydrViewBase.new(standardName, 1, { from: owner });
    CrydrViewBaseContract02 = await CrydrViewBase.new(standardName, 2, { from: owner });

    await ManageableRoutines.enableManager(CrydrViewBaseContract01.address, owner, manager01);
    await ManageableRoutines.grantManagerPermissions(CrydrViewBaseContract01.address,
                                                     owner, manager01, ['set_crydr_controller', 'unpause_contract']);

    await ManageableRoutines.enableManager(CrydrViewBaseContract02.address, owner, manager01);
    await ManageableRoutines.grantManagerPermissions(CrydrViewBaseContract02.address,
                                                     owner, manager01, ['set_crydr_controller', 'unpause_contract']);
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log(`\tCrydrViewBaseContract: ${CrydrViewBaseContract01.address}`);
    global.assert.notStrictEqual(CrydrViewBaseContract01.address, '0x0000000000000000000000000000000000000000');

    global.console.log(`\tCrydrControllerNoLicenseContract: ${CrydrControllerNoLicenseContract.address}`);
    global.assert.notStrictEqual(CrydrControllerNoLicenseContract.address, '0x0000000000000000000000000000000000000000');

    let isPaused = await PausableRoutines.getPaused(CrydrViewBaseContract01.address);
    global.assert.strictEqual(isPaused, true, 'New deployed contract should be paused');

    let controllerAddress = await CrydrViewBaseContract01.getCrydrController.call();
    global.assert.strictEqual(controllerAddress, '0x0000000000000000000000000000000000000000', 'New deployed contract should have noninitialized crydrController');

    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewBaseContract01.address, manager01, CrydrControllerNoLicenseContract.address);
    controllerAddress = await CrydrViewBaseContract01.getCrydrController.call();
    global.assert.strictEqual(controllerAddress, CrydrControllerNoLicenseContract.address, 'crydrController should be initialized');

    PausableRoutines.unpauseContract(CrydrViewBaseContract01.address, manager01);
    isPaused = await PausableRoutines.getPaused(CrydrViewBaseContract01.address);
    global.assert.strictEqual(isPaused, false, 'contract should be unpaused');

    const viewName = await CrydrViewBaseContract01.getCrydrViewStandardName.call();
    global.assert.strictEqual(viewName, standardName);

    const viewNameHash = await CrydrViewBaseContract01.getCrydrViewStandardNameHash.call();
    global.assert.strictEqual(viewNameHash, standardNameHash);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    global.console.log(`\tCrydrViewBaseContract01: ${CrydrViewBaseContract01.address}`);
    global.assert.notStrictEqual(CrydrViewBaseContract01.address, '0x0000000000000000000000000000000000000000');
    global.console.log(`\tCrydrViewBaseContract02: ${CrydrViewBaseContract02.address}`);
    global.assert.notStrictEqual(CrydrViewBaseContract02.address, '0x0000000000000000000000000000000000000000');

    let isPaused = await CrydrViewBaseContract01.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Just deployed contract must be paused');

    isPaused = await CrydrViewBaseContract02.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Just deployed contract must be paused');

    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewBaseContract02.address, manager01, CrydrControllerNoLicenseContract.address);
    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract02.unpauseContract.sendTransaction,
                                                [{ from: manager01 }],
                                                'should it not be possible');
    isPaused = await CrydrViewBaseContract02.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Expected that contract is paused2');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract01.setCrydrController.sendTransaction,
                                                [CrydrControllerNoLicenseContract.address, { from: manager02 }],
                                                'Only manager should be able to set crydrController');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract01.setCrydrController.sendTransaction,
                                                [0x0, { from: manager01 }],
                                                'Should be a valid address of crydrController');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract01.unpauseContract.sendTransaction,
                                                [{ from: manager02 }],
                                                'Only manager should be able to unpause contract');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract01.pauseContract.sendTransaction,
                                                [{ from: manager01 }],
                                                'It should not be possible to pause already paused contract');

    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewBaseContract01.address, manager01, CrydrControllerNoLicenseContract.address);

    await PausableRoutines.unpauseContract(CrydrViewBaseContract01.address, manager01);
    isPaused = await CrydrViewBaseContract01.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract01.pauseContract.sendTransaction,
                                                [{ from: manager02 }],
                                                'Only manager should be able to pause contract');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract01.unpauseContract.sendTransaction,
                                                [{ from: manager01 }],
                                                'It should not be possible to unpause already unpaused contract');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract01.setCrydrController.sendTransaction,
                                                [CrydrControllerNoLicenseContract.address, { from: manager01 }],
                                                'It should not be possible to set crydrController while contract is unpaused');
  });

  global.it('should test that functions fire events', async () => {
    const blockNumber = global.web3.eth.blockNumber;
    const controllerAddress = CrydrControllerNoLicenseContract.address;
    await submitTxAndWaitConfirmation(CrydrViewBaseContract01.setCrydrController.sendTransaction,
      [CrydrControllerNoLicenseContract.address, { from: manager01 }]);

    const pastEvents = await CrydrViewBaseRoutines.getCrydrControllerChangedEvents(CrydrViewBaseContract01.address,
                                                                                   { controllerAddress },
                                                                                   {
                                                                                     fromBlock: blockNumber + 1,
                                                                                     toBlock:   blockNumber + 1,
                                                                                     address:   manager01,
                                                                                   });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
