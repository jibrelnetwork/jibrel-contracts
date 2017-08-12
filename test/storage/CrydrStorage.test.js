const CrydrStorage = global.artifacts.require('CrydrStorage.sol');

const UtilsTestRoutines    = require('../../routine/misc/UtilsTest');
const ManageableRoutines   = require('../../routine/lifecycle/Manageable');
const crydrStorageRoutines = require('../../routine/crydr/storage/CrydrStorageBaseInterface');


global.contract('CrydrStorage', (accounts) => {
  const owner             = accounts[0];
  const manager           = accounts[1];
  const crydrController01 = accounts[2];
  const crydrController02 = accounts[3];
  const investor01        = accounts[4];
  const investor02        = accounts[5];
  const investor03        = accounts[6];
  const miscAddress       = accounts[7];

  let crydrStorageContract;

  global.beforeEach(async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });
    await crydrStorageRoutines.configureCrydrStorage(crydrStorageContract.address, owner, manager, crydrController01);
  });

  global.it('check that crydr storage is configurable', async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });

    const managerPermissions = [
      'set_crydr_controller',
      'pause_contract',
      'unpause_contract'];
    await ManageableRoutines.enableManager(crydrStorageContract.address, owner, manager);
    await ManageableRoutines.grantManagerPermissions(crydrStorageContract.address, owner, manager, managerPermissions);

    let crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.equal(crydrController01Received, 0x0, 'Default controller address should be zero');

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [0x0, { from: manager }],
                                                'Should reject invalid crydr controller address');

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrController01, { from: miscAddress }],
                                                'Only allowed manager should be able to configure crydr storage');

    await crydrStorageContract.setCrydrController.sendTransaction(crydrController01, { from: manager });
    crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.equal(crydrController01Received, crydrController01,
                        'Manager should be able to configure crydr storage and set controller');

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrController01, { from: manager }],
                                                'New crydr controller should be different from the previous one');

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrStorageContract.address, { from: manager }],
                                                'Storage can not be a controller');

    await crydrStorageContract.setCrydrController.sendTransaction(crydrController02, { from: manager });
    crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.equal(crydrController01Received, crydrController02,
                        'Manager should be able to change crydr controller at any time');
  });

  // todo test that configuration events fired


  global.it('check storage state after deployment and configuration routines finished', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);

    const isPaused = await crydrStorageContract.getPaused.call();
    global.assert.equal(isPaused, false, 'Contract should be unpaused');

    const crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 0);

    // todo test events - no manipulations with balances
  });

  global.it('check that low-level setters work as expected', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);


    // increaseBalance & decreaseBalance

    let investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 0);
    let crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 0);

    await crydrStorageContract.increaseBalance.sendTransaction(investor01, 10 * (10 ** 18),
                                                               { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 10 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageContract.decreaseBalance.sendTransaction(investor01, 5 * (10 ** 18),
                                                               { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 5 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 5 * (10 ** 18));


    // increaseAllowance & decreaseAllowance

    let investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 0);

    await crydrStorageContract.increaseAllowance.sendTransaction(investor01, investor02, 10 * (10 ** 18),
                                                                 { from: crydrController01 });

    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 10 * (10 ** 18));

    await crydrStorageContract.decreaseAllowance.sendTransaction(investor01, investor02, 5 * (10 ** 18),
                                                                 { from: crydrController01 });

    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 5 * (10 ** 18));
  });

  // todo test that low-level setters fire events

  global.it('check that low-level setters throw if general conditions not met', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);

    // set non-zero values
    await crydrStorageContract.increaseBalance.sendTransaction(investor01, 10 * (10 ** 18),
                                                               { from: crydrController01 });
    await crydrStorageContract.increaseAllowance.sendTransaction(investor01, investor02, 10 * (10 ** 18),
                                                                 { from: crydrController01 });

    // pause contract
    await crydrStorageContract.pause.sendTransaction({ from: manager });


    // test that methods throw if contract is paused
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseBalance.sendTransaction,
                                                [investor01, 5 * (10 ** 18), { from: crydrController01 }],
                                                'increaseBalance should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseBalance.sendTransaction,
                                                [investor01, 5 * (10 ** 18), { from: crydrController01 }],
                                                'decreaseBalance should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseAllowance.sendTransaction,
                                                [investor01, investor02, 5 * (10 ** 18), { from: crydrController01 }],
                                                'increaseAllowance should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseAllowance.sendTransaction,
                                                [investor01, investor02, 5 * (10 ** 18), { from: crydrController01 }],
                                                'decreaseAllowance should throw if contract is paused');

    // unpause contract
    await crydrStorageContract.unpause.sendTransaction({ from: manager });


    // test that only crydr controller is able to invoke setters
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseBalance.sendTransaction,
                                                [investor01, 5 * (10 ** 18), { from: crydrController02 }],
                                                'increaseBalance should throw if called by non-controller');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseBalance.sendTransaction,
                                                [investor01, 5 * (10 ** 18), { from: crydrController02 }],
                                                'decreaseBalance should throw if called by non-controller');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseAllowance.sendTransaction,
                                                [investor01, investor02, 5 * (10 ** 18), { from: crydrController02 }],
                                                'increaseAllowance should throw if called by non-controller');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseAllowance.sendTransaction,
                                                [investor01, investor02, 5 * (10 ** 18), { from: crydrController02 }],
                                                'decreaseAllowance should throw if called by non-controller');
  });

  // todo test that low-level setters throw if not enough balance or integer overflow


  global.it('check that ERC20 setters work as expected', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);


    // set non-zero balances

    let investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 0);
    let investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 0);
    let investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 0);
    let investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 0);
    let crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 0);

    await crydrStorageContract.increaseBalance.sendTransaction(investor01, 10 * (10 ** 18),
                                                               { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 10 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 0);
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // transfer

    await crydrStorageContract.transfer.sendTransaction(investor01, investor02, 2 * (10 ** 18),
                                                        { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 8 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 2 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageContract.transfer.sendTransaction(investor01, investor02, 1 * (10 ** 18),
                                                        { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 7 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // approve

    await crydrStorageContract.approve.sendTransaction(investor01, investor02, 3 * (10 ** 18),
                                                       { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 7 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 3 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageContract.approve.sendTransaction(investor01, investor02, 5 * (10 ** 18),
                                                       { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 7 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 5 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // transferFrom

    await crydrStorageContract.transferFrom.sendTransaction(investor02, investor01, investor03, 1 * (10 ** 18),
                                                            { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 6 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 1 * (10 ** 18));
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 4 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageContract.transferFrom.sendTransaction(investor02, investor01, investor03, 2 * (10 ** 18),
                                                            { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 4 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 3 * (10 ** 18));
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 2 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    await crydrStorageContract.transferFrom.sendTransaction(investor02, investor01, investor02, 1 * (10 ** 18),
                                                            { from: crydrController01 });

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 3 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.equal(investor02Balance.toNumber(), 4 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.equal(investor03Balance.toNumber(), 3 * (10 ** 18));
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 1 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));
  });

  // todo test that ERC20 setters fire events

  global.it('check that ERC20 setters throw if general conditions not met', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);

    // set non-zero values
    await crydrStorageContract.increaseBalance.sendTransaction(investor01, 10 * (10 ** 18),
                                                               { from: crydrController01 });
    await crydrStorageContract.increaseAllowance.sendTransaction(investor01, investor02, 10 * (10 ** 18),
                                                                 { from: crydrController01 });

    // pause contract
    await crydrStorageContract.pause.sendTransaction({ from: manager });


    // test that methods throw if contract is paused
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transfer.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: crydrController01 }],
                                                'transfer should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.approve.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: crydrController01 }],
                                                'approve should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transferFrom.sendTransaction,
                                                [
                                                  investor02,
                                                  investor01,
                                                  investor02,
                                                  2 * (10 ** 18),
                                                  { from: crydrController01 }],
                                                'transferFrom should throw if contract is paused');

    // unpause contract
    await crydrStorageContract.unpause.sendTransaction({ from: manager });


    // test that only crydr controller is able to invoke setters
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transfer.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: crydrController02 }],
                                                'transfer should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.approve.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: crydrController02 }],
                                                'approve should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transferFrom.sendTransaction,
                                                [
                                                  investor02,
                                                  investor01,
                                                  investor02,
                                                  2 * (10 ** 18),
                                                  { from: crydrController02 }],
                                                'transferFrom should throw if contract is paused');
  });

  // todo test that low-level setters throw if not enough balance or integer overflow
});
