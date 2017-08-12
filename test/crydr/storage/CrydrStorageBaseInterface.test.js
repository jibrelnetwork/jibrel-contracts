const BigNumber = require('bignumber.js');

const CrydrStorage = global.artifacts.require('CrydrStorage.sol');

const UtilsTestRoutines           = require('../../../routine/misc/UtilsTest');
const ManageableRoutines          = require('../../../routine/lifecycle/Manageable');
const PausableRoutines            = require('../../../routine/lifecycle/Pausable');
const crydrStorageBaseRoutines    = require('../../../routine/crydr/storage/CrydrStorageBaseInterface');
const crydrStorageGeneralRoutines = require('../../../routine/crydr/storage/CrydrStorageGeneral');


global.contract('CrydrStorageBaseInterface', (accounts) => {
  const owner             = accounts[0];
  const manager           = accounts[1];
  const crydrController01 = accounts[2];
  const crydrController02 = accounts[3];
  const investor01        = accounts[4];
  const investor02        = accounts[5];
  const miscAddress       = accounts[7];

  let crydrStorageContract;


  /**
   * Configuration
   */

  global.beforeEach(async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });
    await crydrStorageGeneralRoutines.configureCrydrStorage(crydrStorageContract.address, owner, manager,
                                                            crydrController01);
  });

  global.it('check storage state after deployment and configuration routines finished', async () => {
    global.assert.notEqual(crydrStorageContract.address, 0x0);

    let isAllowed = await crydrStorageContract.isManagerAllowed.call(manager, 'set_crydr_controller');
    global.assert.equal(isAllowed, true);
    isAllowed = await crydrStorageContract.isManagerAllowed.call(manager, 'pause_contract');
    global.assert.equal(isAllowed, true);
    isAllowed = await crydrStorageContract.isManagerAllowed.call(manager, 'unpause_contract');
    global.assert.equal(isAllowed, true);

    const isPaused = await crydrStorageContract.getPaused.call();
    global.assert.equal(isPaused, false, 'Contract should be unpaused');

    const crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.equal(crydrController01Received, crydrController01);

    const crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 0);
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

    await crydrStorageBaseRoutines.setCrydrController(crydrStorageContract.address, manager, crydrController01);
    crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.equal(crydrController01Received, crydrController01,
                        'Manager should be able to configure crydr storage and set controller');

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrController01, { from: manager }],
                                                'New crydr controller should be different from the previous one');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrStorageContract.address, { from: manager }],
                                                'Storage can not be a controller');

    await PausableRoutines.unpauseContract(crydrStorageContract.address, manager);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrController02, { from: manager }],
                                                'We should not be able to set crydr controller of unpaused contract');

    await PausableRoutines.pauseContract(crydrStorageContract.address, manager);

    await crydrStorageBaseRoutines.setCrydrController(crydrStorageContract.address, manager, crydrController02);
    crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.equal(crydrController01Received, crydrController02,
                        'Manager should be able to change crydr controller at any time');

    await PausableRoutines.unpauseContract(crydrStorageContract.address, manager);
  });

  global.it('should test that configuration functions fire events', async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });

    const managerPermissions = [
      'set_crydr_controller',
      'pause_contract',
      'unpause_contract'];
    await ManageableRoutines.enableManager(crydrStorageContract.address, owner, manager);
    await ManageableRoutines.grantManagerPermissions(crydrStorageContract.address, owner, manager, managerPermissions);


    const blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.setCrydrController(crydrStorageContract.address, manager, crydrController01);
    const pastEvents = await crydrStorageBaseRoutines.getCrydrControllerChangedEvents(
      crydrStorageContract.address,
      {
        crydrcontroller: crydrController01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   manager,
      });
    global.assert.equal(pastEvents.length, 1);
  });


  /**
   * Low-level setters
   */

  global.it('check that low-level setters work as expected', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);


    // increaseBalance & decreaseBalance

    let investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 0);
    let crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 0);

    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 10 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 10 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseRoutines.decreaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 5 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.equal(investor01Balance.toNumber(), 5 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.equal(crydrStorageTotalSupply.toNumber(), 5 * (10 ** 18));


    // increaseAllowance & decreaseAllowance

    let investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 0);

    await crydrStorageBaseRoutines.increaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, 10 * (10 ** 18));

    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseRoutines.decreaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, 5 * (10 ** 18));

    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.equal(investor01to02Allowance.toNumber(), 5 * (10 ** 18));
  });

  global.it('should test that low-level setters fire events', async () => {
    let blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 10 * (10 ** 18));
    let pastEvents = await crydrStorageBaseRoutines.getAccountBalanceIncreasedEvents(
      crydrStorageContract.address,
      {
        account: investor01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   crydrController01,
      });
    global.assert.equal(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.decreaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 5 * (10 ** 18));
    pastEvents = await crydrStorageBaseRoutines.getAccountBalanceDecreasedEvents(
      crydrStorageContract.address,
      {
        account: investor01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   crydrController01,
      });
    global.assert.equal(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.increaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, 10 * (10 ** 18));
    pastEvents = await crydrStorageBaseRoutines.getAccountAllowanceIncreasedEvents(
      crydrStorageContract.address,
      {
        owner:   investor01,
        spender: investor02,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   crydrController01,
      });
    global.assert.equal(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.decreaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, 5 * (10 ** 18));
    pastEvents = await crydrStorageBaseRoutines.getAccountAllowanceDecreasedEvents(
      crydrStorageContract.address,
      {
        owner:   investor01,
        spender: investor02,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   crydrController01,
      });
    global.assert.equal(pastEvents.length, 1);
  });

  global.it('check that low-level setters throw if general conditions not met', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);

    // set non-zero values
    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 10 * (10 ** 18));
    await crydrStorageBaseRoutines.increaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, 10 * (10 ** 18));

    // pause contract
    await PausableRoutines.pauseContract(crydrStorageContract.address, manager);


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
    await PausableRoutines.unpauseContract(crydrStorageContract.address, manager);


    // test that only crydr controller is able to invoke setters
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseBalance.sendTransaction,
                                                [investor01, 5 * (10 ** 18), { from: miscAddress }],
                                                'increaseBalance should throw if called by non-controller');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseBalance.sendTransaction,
                                                [investor01, 5 * (10 ** 18), { from: miscAddress }],
                                                'decreaseBalance should throw if called by non-controller');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseAllowance.sendTransaction,
                                                [investor01, investor02, 5 * (10 ** 18), { from: miscAddress }],
                                                'increaseAllowance should throw if called by non-controller');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseAllowance.sendTransaction,
                                                [investor01, investor02, 5 * (10 ** 18), { from: miscAddress }],
                                                'decreaseAllowance should throw if called by non-controller');
  });

  global.it('test that low-level setters throw if not enough balance or integer overflow', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);

    const uint256Max = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');


    // increaseBalance & decreaseBalance

    let investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 0);
    let investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseBalance.sendTransaction,
                                                [investor01, 1, { from: crydrController01 }],
                                                'decreaseBalance should throw if integer overflow');

    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 1000);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseBalance.sendTransaction,
                                                [investor01, 1001, { from: crydrController01 }],
                                                'decreaseBalance should throw if integer overflow');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseBalance.sendTransaction,
                                                [investor01, uint256Max.minus(999), { from: crydrController01 }],
                                                'increaseBalance should throw if integer overflow');

    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, uint256Max.minus(1000));
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(),
                        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseBalance.sendTransaction,
                                                [investor01, 1, { from: crydrController01 }],
                                                'increaseBalance should throw if integer overflow');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseBalance.sendTransaction,
                                                [investor02, 1, { from: crydrController01 }],
                                                'increaseBalance should throw if integer overflow of total supply');


    // increaseAllowance & decreaseAllowance

    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(),
                        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseAllowance.sendTransaction,
                                                [investor01, investor02, 1, { from: crydrController01 }],
                                                'decreaseAllowance should throw if integer overflow');

    await crydrStorageBaseRoutines.increaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(),
                        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 1000);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.decreaseAllowance.sendTransaction,
                                                [investor01, investor02, 1001, { from: crydrController01 }],
                                                'decreaseAllowance should throw if integer overflow');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseAllowance.sendTransaction,
                                                [investor01, investor02, uint256Max.minus(999), { from: crydrController01 }],
                                                'increaseAllowance should throw if integer overflow');

    await crydrStorageBaseRoutines.increaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, uint256Max.minus(1000));
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(),
                        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(),
                        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.increaseAllowance.sendTransaction,
                                                [investor01, investor02, 1, { from: crydrController01 }],
                                                'increaseAllowance should throw if integer overflow');

    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(),
                        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(),
                        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
  });
});
