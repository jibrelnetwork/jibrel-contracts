/* eslint-disable no-multi-spaces */
global.artifacts = artifacts;

const CrydrControllerBase       = global.artifacts.require('CrydrControllerBase.sol');
const CrydrStorage              = global.artifacts.require('CrydrStorage.sol');
const CrydrViewBase             = global.artifacts.require('CrydrViewBase.sol');

global.contract('CrydrControllerBase', (accounts) => {
  const owner = accounts[0];
  const manager = accounts[1];

  let CrydrControllerBaseContract;
  let CrydrStorageContract;
  let CrydrViewBaseContract;

  global.beforeEach(async () => {
    CrydrControllerBaseContract = await CrydrControllerBase.new({ from: owner });
    CrydrStorageContract        = await CrydrStorage.new({ from: owner });
    CrydrViewBaseContract       = await CrydrViewBase.new('Test', { form: owner });
  });

  global.it('check member functions', async () => {
    global.assert.equal(CrydrControllerBaseContract.address === 0x0 ||
      CrydrStorageContract.address === 0x0 || CrydrViewBaseContract === 0x0, false);

    let crydrStorage = await CrydrControllerBaseContract.getCrydrStorage.call();
    global.assert.equal(crydrStorage, 0x0);

    await CrydrControllerBaseContract.enableManager.sendTransaction(manager, { from: owner });
    let isManagerEnabled = await CrydrControllerBaseContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);

    let isTrow = false;
    await CrydrControllerBaseContract.setCrydrStorage.sendTransaction(CrydrStorageContract.address, { from: manager })
      .catch( () => {
        isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should trow an exception if the manager don\'t have \'set_crydr_storage\' permission');
    await CrydrControllerBaseContract.grantManagerPermission.sendTransaction(manager, 'set_crydr_storage', { from: owner });
    await CrydrControllerBaseContract.setCrydrStorage.sendTransaction(CrydrStorageContract.address, { from: manager });

    isTrow = false;
    await CrydrControllerBaseContract.setCrydrView.sendTransaction('Test', CrydrViewBaseContract.address, { from: manager })
      .catch( () => {
        isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should trow an exception if the manager don\'t have \'set_crydr_view\' permission');

    await CrydrControllerBaseContract.grantManagerPermission.sendTransaction(manager, 'set_crydr_view', { from: owner });
    await CrydrControllerBaseContract.setCrydrView.sendTransaction('Test', CrydrViewBaseContract.address, { from: manager });
    let viewAddress = await CrydrControllerBaseContract.getCrydrView.call('Test');
    global.assert.equal(viewAddress, CrydrViewBaseContract.address);

    let viewsNumber = await CrydrControllerBaseContract.getCrydrViewsNumber.call();
    global.assert.equal(viewsNumber.toNumber(), 1);

    isTrow = false;
    await CrydrControllerBaseContract.unpause.sendTransaction().catch( () => {
      isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should throw an exception if unpause called by any account other than the manager');
    let isPaused = await CrydrControllerBaseContract.getPaused.call();
    global.assert.equal(isPaused, true);

    await CrydrControllerBaseContract.grantManagerPermission.sendTransaction(manager, 'unpause_contract', { from: owner });
    await CrydrControllerBaseContract.unpause.sendTransaction({ from: manager });
    isPaused = await CrydrControllerBaseContract.getPaused.call();
    global.assert.equal(isPaused, false);
  });
});
