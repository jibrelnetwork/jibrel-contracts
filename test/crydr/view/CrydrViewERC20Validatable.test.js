const CrydrViewERC20Validatable = global.artifacts.require('CrydrViewERC20Validatable.sol');
const CrydrERC20ValidatableMock = global.artifacts.require('CrydrERC20ValidatableMock.sol');

const ManageableRoutines                   = require('../../../routine/lifecycle/Manageable');
const PausableRoutines                     = require('../../../routine/lifecycle/Pausable');
const CrydrViewBaseRoutines                = require('../../../routine/crydr/view/CrydrViewBaseInterface');

global.contract('CrydrViewERC20Validatable', (accounts) => {
  const owner      = accounts[0];
  const manager01  = accounts[1];
  const investor01 = accounts[2];
  const investor02 = accounts[3];
  const investor03 = accounts[4];

  let CrydrViewERC20ValidatableContract;
  let CrydrERC20ValidatableMockContract;
  const name = 'testName';
  const symbol = 'testSymbol';
  const decimals = 18;


  global.beforeEach(async () => {
    CrydrViewERC20ValidatableContract = await CrydrViewERC20Validatable.new(name, symbol, decimals, { from: owner });
    CrydrERC20ValidatableMockContract = await CrydrERC20ValidatableMock.new({ from: owner });

    ManageableRoutines.enableManager(CrydrViewERC20ValidatableContract.address, owner, manager01);
    ManageableRoutines.grantManagerPermissions(CrydrViewERC20ValidatableContract.address,
                                               owner, manager01, ['set_crydr_controller', 'unpause_contract']);
    CrydrViewBaseRoutines.setControllerOfCrydrView(CrydrViewERC20ValidatableContract.address, manager01,
                                                   CrydrERC20ValidatableMockContract.address);
    PausableRoutines.unpauseContract(CrydrViewERC20ValidatableContract.address, manager01);
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log(`\tCrydrViewERC20ValidatableContract: ${CrydrViewERC20ValidatableContract.address}`);
    global.assert.notStrictEqual(CrydrViewERC20ValidatableContract.address, 0x0);

    global.console.log(`\tCrydrControllerSingleLicenseContract: ${CrydrERC20ValidatableMockContract.address}`);
    global.assert.notEqual(CrydrERC20ValidatableMockContract.address, 0x0);

    const isPaused = await PausableRoutines.getPaused(CrydrViewERC20ValidatableContract.address);
    global.assert.equal(isPaused, false, 'Contract should be unpaused');

    const controllerAddress = await CrydrViewERC20ValidatableContract.getCrydrController.call();
    global.assert.equal(controllerAddress, CrydrERC20ValidatableMockContract.address,
                        'Contract should have initialized crydrController');

    const isReceivingAllowed = await CrydrViewERC20ValidatableContract.isReceivingAllowed.call(investor01, 0);
    global.assert.equal(isReceivingAllowed, true);

    const isSpendingAllowed = await CrydrViewERC20ValidatableContract.isSpendingAllowed.call(investor01, 0);
    global.assert.equal(isSpendingAllowed, true);

    const isTransferAllowed = await CrydrViewERC20ValidatableContract.isTransferAllowed.call(investor01, investor02, 0);
    global.assert.equal(isTransferAllowed, true);

    const isApproveAllowed = await CrydrViewERC20ValidatableContract.isApproveAllowed.call(investor01, investor02, 0);
    global.assert.equal(isApproveAllowed, true);

    const isApprovedSpendingAllowed = await CrydrViewERC20ValidatableContract.isApprovedSpendingAllowed.call(investor01, investor02, 0);
    global.assert.equal(isApprovedSpendingAllowed, true);

    const isTransferFromAllowed = await CrydrViewERC20ValidatableContract.isTransferFromAllowed.call(investor01, investor02, investor03, 0);
    global.assert.equal(isTransferFromAllowed, true);
  });
});
