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

  let CrydrViewBaseContract;
  let CrydrControllerNoLicenseContract;
  const standardName = 'testName';
  const standardNameHash = '0x698c8efcda9e563cf153563941b60fc5ac88336fc58d361eb0888686fadb9976';


  global.beforeEach(async () => {
    CrydrControllerNoLicenseContract = await CrydrControllerNoLicense.new({ from: owner });
    CrydrViewBaseContract = await CrydrViewBase.new(standardName, { from: owner });

    await ManageableRoutines.enableManager(CrydrViewBaseContract.address, owner, manager01);
    await ManageableRoutines.grantManagerPermissions(CrydrViewBaseContract.address,
                                                     owner, manager01, ['set_crydr_controller', 'unpause_contract']);
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log(`\tCrydrViewBaseContract: ${CrydrViewBaseContract.address}`);
    global.assert.notEqual(CrydrViewBaseContract.address, 0x0);

    global.console.log(`\tCrydrControllerNoLicenseContract: ${CrydrControllerNoLicenseContract.address}`);
    global.assert.notEqual(CrydrControllerNoLicenseContract.address, 0x0);

    let isPaused = await PausableRoutines.getPaused(CrydrViewBaseContract.address);
    global.assert.equal(isPaused, true, 'New deployed contract should be paused');

    let controllerAddress = await CrydrViewBaseContract.getCrydrController.call();
    global.assert.equal(controllerAddress, 0x0, 'New deployed contract should have noninitialized crydrController');

    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewBaseContract.address, manager01, CrydrControllerNoLicenseContract.address);
    controllerAddress = await CrydrViewBaseContract.getCrydrController.call();
    global.assert.equal(controllerAddress, CrydrControllerNoLicenseContract.address, 'crydrController should be initialized');

    PausableRoutines.unpauseContract(CrydrViewBaseContract.address, manager01);
    isPaused = await PausableRoutines.getPaused(CrydrViewBaseContract.address);
    global.assert.equal(isPaused, false, 'contract should be unpaused');

    const viewName = await CrydrViewBaseContract.getCrydrViewStandardName.call();
    global.assert.equal(viewName, standardName);

    const viewNameHash = await CrydrViewBaseContract.getCrydrViewStandardNameHash.call();
    global.assert.equal(viewNameHash, standardNameHash);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    global.console.log(`\tCrydrViewBaseContract: ${CrydrViewBaseContract.address}`);
    global.assert.notEqual(CrydrViewBaseContract.address, 0x0);

    let isPaused = await CrydrViewBaseContract.getPaused.call();
    global.assert.equal(isPaused, true, 'Just deployed contract must be paused');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract.setCrydrController.sendTransaction,
                                                [CrydrControllerNoLicenseContract.address, { from: manager02 }],
                                                'Only manager should be able to set crydrController');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract.setCrydrController.sendTransaction,
                                                [0x0, { from: manager01 }],
                                                'Should be a valid address of crydrController');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract.unpause.sendTransaction,
                                                [{ from: manager02 }],
                                                'Only manager should be able to unpause contract');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract.pauseContract.sendTransaction,
                                                [{ from: manager01 }],
                                                'It should not be possible to pause already paused contract');

    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewBaseContract.address, manager01, CrydrControllerNoLicenseContract.address);

    await PausableRoutines.unpauseContract(CrydrViewBaseContract.address, manager01);
    isPaused = await CrydrViewBaseContract.getPaused.call();
    global.assert.equal(isPaused, false, 'Expected that contract is unpaused');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract.pauseContract.sendTransaction,
                                                [{ from: manager02 }],
                                                'Only manager should be able to pause contract');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract.unpauseContract.sendTransaction,
                                                [{ from: manager01 }],
                                                'It should not be possible to unpause already unpaused contract');

    await UtilsTestRoutines.checkContractThrows(CrydrViewBaseContract.setCrydrController.sendTransaction,
                                                [CrydrControllerNoLicenseContract.address, { from: manager01 }],
                                                'It should not be possible to set crydrController while contract is unpaused');
  });

  global.it('should test that functions fire events', async () => {
    const blockNumber = global.web3.eth.blockNumber;
    const controllerAddress = CrydrControllerNoLicenseContract.address;
    await submitTxAndWaitConfirmation(CrydrViewBaseContract.setCrydrController.sendTransaction,
      [CrydrControllerNoLicenseContract.address, { from: manager01 }]);

    const pastEvents = await CrydrViewBaseRoutines.getCrydrControllerChangedEvents(CrydrViewBaseContract.address,
                                                             {controllerAddress},
                                                             {
                                                               fromBlock: blockNumber + 1,
                                                               toBlock:   blockNumber + 1,
                                                               address:   manager01,
                                                             });
    global.assert.equal(pastEvents.length, 1);
  });
});
