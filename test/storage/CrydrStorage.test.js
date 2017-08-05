/* eslint-disable no-multi-spaces */
global.artifacts = artifacts;

const CrydrStorage       = global.artifacts.require('CrydrStorage.sol');

global.contract('CrydrStorage', (accounts) => {
  const owner = accounts[0];
  const investor01 = accounts[3];
  const investor02 = accounts[4];

  let CrydrStorageContract;

  global.beforeEach(async () => {
    CrydrStorageContract = await CrydrStorage.new({ from: owner });
  });

  global.it('check member functions', async () => {
    let crydrController;

    global.console.log(`\tcrydrStorageContract: ${CrydrStorageContract.address}`);
    global.assert.equal(CrydrStorageContract.address == 0x0, false);

    crydrController = await CrydrStorageContract.getCrydrController();
    global.assert.equal(crydrController, 0x0);

    let crydrStorageTotalSupply = await CrydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 0);

    await CrydrStorageContract.increaseBalance.sendTransaction(investor01, 10 * (10 ** 18), { from: owner });
    let crydrBalance = await CrydrStorageContract.getBalance.call(investor01);
    global.assert.equal(crydrBalance.toNumber(), 0);

    await CrydrStorageContract.decreaseBalance.sendTransaction(investor01, 10 * (10 ** 18), { from: owner });
    crydrBalance = await CrydrStorageContract.getBalance.call(investor01);
    global.assert.equal(crydrBalance.toNumber(), 0);

    await CrydrStorageContract.increaseAllowance.sendTransaction(investor01, investor02, 10 * (10 ** 18), { from: owner });
    let allowance = await CrydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(allowance.toNumber(), 0);

    await CrydrStorageContract.decreaseAllowance.sendTransaction(investor01, investor02, 10 * (10 ** 18), { from: owner });
    allowance = await CrydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(allowance.toNumber(), 0);
  });
});
