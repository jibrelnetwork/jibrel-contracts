/* eslint-disable no-multi-spaces */
global.artifacts = artifacts;

const CrydrControllerMintable   = global.artifacts.require('CrydrControllerMintable.sol');
const CrydrStorage              = global.artifacts.require('CrydrStorage.sol');
const CrydrViewBase             = global.artifacts.require('CrydrViewBase.sol');

global.contract('CrydrControllerMintable', (accounts) => {
  const owner = accounts[0];
  const manager = accounts[1];
  const investor_01 = accounts[3];

  let CrydrControllerMintableContract;
  let CrydrStorageContract;
  let CrydrViewBaseContract;

  global.beforeEach(async () => {
    CrydrControllerMintableContract = await CrydrControllerMintable.new({ from: owner });
    CrydrStorageContract            = await CrydrStorage.new({ from: owner });
    CrydrViewBaseContract           = await CrydrViewBase.new('Test', { form: owner });
  });

  global.it('check member functions', async () => {

    global.assert.equal(CrydrControllerMintableContract.address === 0x0 ||
          CrydrStorageContract.address === 0x0 || CrydrViewBaseContract === 0x0, false);

    await CrydrControllerMintableContract.enableManager.sendTransaction(manager, { from: owner });
    await CrydrControllerMintableContract.grantManagerPermission.sendTransaction(manager, 'set_crydr_storage', { from: owner });
    await CrydrControllerMintableContract.setCrydrStorage.sendTransaction(CrydrStorageContract.address, { from: manager });
    await CrydrControllerMintableContract.grantManagerPermission.sendTransaction(manager, 'set_crydr_view', { from: owner });
    await CrydrControllerMintableContract.setCrydrView.sendTransaction('Test', CrydrViewBaseContract.address, { from: manager });

    let isTrow = false;
    await CrydrControllerMintableContract.mint.sendTransaction(0x0, 10 * (10 ** 18), { form: manager }).catch( () => {
      isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should throw an exception if account address is invalid');

    isTrow = false;
    await CrydrControllerMintableContract.mint.sendTransaction(investor_01, 10 * (10 ** 18), { form: manager }).catch( () => {
      isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should trow an exception if the manager don\'t have \'mint_crydr\' permission');

    await CrydrControllerMintableContract.grantManagerPermission.sendTransaction(manager, 'mint_crydr', { from: owner });
    await CrydrControllerMintableContract.mint.sendTransaction(investor_01, 10 * (10 ** 18), { form: manager });

    let isTrow = false;
    await CrydrControllerMintableContract.burn.sendTransaction(0x0, 10 * (10 ** 18), { form: manager }).catch( () => {
      isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should throw an exception if account address is invalid');

    isTrow = false;
    await CrydrControllerMintableContract.burn.sendTransaction(investor_01, 10 * (10 ** 18), { form: manager }).catch( () => {
      isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should trow an exception if the manager don\'t have \'burn_crydr\' permission');

    await CrydrControllerMintableContract.grantManagerPermission.sendTransaction(manager, 'burn_crydr', { from: owner });
    await CrydrControllerMintableContract.burn.sendTransaction(investor_01, 10 * (10 ** 18), { form: manager });
  });
});
