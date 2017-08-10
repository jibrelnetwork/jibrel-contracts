const CrydrStorage = global.artifacts.require('CrydrStorage.sol');

const crydrStorageRoutines = require('../../routine/CrydrStorageBaseInterface');


global.contract('CrydrStorage', (accounts) => {
  const owner           = accounts[0];
  const manager         = accounts[1];
  const crydrController = accounts[2];
  const investor01      = accounts[3];
  const investor02      = accounts[4];

  let CrydrStorageContract;

  global.beforeEach(async () => {
    CrydrStorageContract = await CrydrStorage.new({ from: owner });
    await crydrStorageRoutines.configureCrydrStorage(CrydrStorageContract.address, owner, manager, crydrController);
  });

  global.it('check member functions', async () => {
    global.console.log(`\tcrydrStorageContract: ${CrydrStorageContract.address}`);
    global.assert.equal(CrydrStorageContract.address === 0x0, false);

    const crydrStorageTotalSupply = await CrydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 0);

    await CrydrStorageContract.increaseBalance.sendTransaction(investor01, 10 * (10 ** 18), { from: crydrController });
    let crydrBalance = await CrydrStorageContract.getBalance.call(investor01);
    global.assert.equal(crydrBalance.toNumber(), 10 * (10 ** 18));

    await CrydrStorageContract.decreaseBalance.sendTransaction(investor01, 5 * (10 ** 18), { from: crydrController });
    crydrBalance = await CrydrStorageContract.getBalance.call(investor01);
    global.assert.equal(crydrBalance.toNumber(), 5 * (10 ** 18));

    await CrydrStorageContract.increaseAllowance.sendTransaction(investor01, investor02, 10 * (10 ** 18),
                                                                 { from: crydrController });
    let allowance = await CrydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(allowance.toNumber(), 10 * (10 ** 18));

    await CrydrStorageContract.decreaseAllowance.sendTransaction(investor01, investor02, 5 * (10 ** 18),
                                                                 { from: crydrController });
    allowance = await CrydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(allowance.toNumber(), 5 * (10 ** 18));
  });
});
