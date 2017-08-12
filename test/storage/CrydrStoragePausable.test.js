const CrydrStorage = global.artifacts.require('CrydrStorage.sol');

const UtilsTestRoutines           = require('../../routine/misc/UtilsTest');
const ManageableRoutines          = require('../../routine/lifecycle/Manageable');
const PausableRoutines            = require('../../routine/lifecycle/Pausable');
const crydrStorageBaseRoutines    = require('../../routine/crydr/storage/CrydrStorageBaseInterface');
const crydrStorageGeneralRoutines = require('../../routine/crydr/storage/CrydrStorageGeneral');


global.contract('CrydrStoragePausable', (accounts) => {
  const owner             = accounts[0];
  const manager           = accounts[1];
  const crydrController01 = accounts[2];
  const miscAddress       = accounts[6];

  let crydrStorageContract;

  global.beforeEach(async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });
    await crydrStorageGeneralRoutines.configureCrydrStorage(crydrStorageContract.address, owner, manager,
                                                            crydrController01);
  });


  global.it('test that contract is unpausable only if configured correctly', async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });

    const managerPermissions = [
      'set_crydr_controller',
      'pause_contract',
      'unpause_contract'];
    await ManageableRoutines.enableManager(crydrStorageContract.address, owner, manager);
    await ManageableRoutines.grantManagerPermissions(crydrStorageContract.address, owner, manager, managerPermissions);


    const crydrControllerAddress = await crydrStorageContract.getCrydrController.call();
    global.assert.equal(crydrControllerAddress, 0x0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.unpause.sendTransaction, [{ from: manager }],
                                                'contract should be unpauseable only if correctly configured');

    await crydrStorageBaseRoutines.setCrydrController(crydrStorageContract.address, manager, crydrController01);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.unpause.sendTransaction, [{ from: miscAddress }],
                                                'contract can be unpaused only by authorised manager');

    await PausableRoutines.unpauseContract(crydrStorageContract.address, manager);
  });
});
