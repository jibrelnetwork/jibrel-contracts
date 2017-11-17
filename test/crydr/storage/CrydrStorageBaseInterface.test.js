const BigNumber = require('bignumber.js');

const CrydrStorage = global.artifacts.require('CrydrStorage.sol');
const CrydrController = global.artifacts.require('CrydrControllerMock.sol');

const UtilsTestRoutines           = require('../../../routine/misc/UtilsTest');
const ManageableRoutines          = require('../../../routine/lifecycle/Manageable');
const PausableRoutines            = require('../../../routine/lifecycle/Pausable');
const crydrStorageBaseRoutines    = require('../../../routine/crydr/storage/CrydrStorageBaseInterface');
const crydrStorageGeneralRoutines = require('../../../routine/crydr/storage/CrydrStorageGeneral');

const PausableTestSuite = require('../../../test_suit/lifecycle/Pausable');


global.contract('CrydrStorageBaseInterface', (accounts) => {
  const owner             = accounts[0];
  const manager           = accounts[1];
  const investor01        = accounts[2];
  const investor02        = accounts[3];
  const miscAddress       = accounts[4];

  let crydrStorageContract;
  let crydrControllerContract01;
  let crydrControllerContract02;


  /**
   * Configuration
   */

  global.beforeEach(async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });
    crydrControllerContract01 = await CrydrController.new(crydrStorageContract.address, { from: owner });
    crydrControllerContract02 = await CrydrController.new(crydrStorageContract.address, { from: owner });
    await crydrStorageGeneralRoutines.configureCrydrStorage(crydrStorageContract.address, owner, manager,
                                                            crydrControllerContract01.address);
  });

  global.it('check contract state after deployment and configuration routines finished', async () => {
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    let isAllowed = await crydrStorageContract.isManagerAllowed.call(manager, 'set_crydr_controller');
    global.assert.strictEqual(isAllowed, true);
    isAllowed = await crydrStorageContract.isManagerAllowed.call(manager, 'pause_contract');
    global.assert.strictEqual(isAllowed, true);
    isAllowed = await crydrStorageContract.isManagerAllowed.call(manager, 'unpause_contract');
    global.assert.strictEqual(isAllowed, true);

    const isPaused = await crydrStorageContract.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Contract should be unpaused');

    const crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received, crydrControllerContract01.address);

    const crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 0);
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
    global.assert.strictEqual(crydrController01Received, '0x0000000000000000000000000000000000000000', 'Default controller address should be zero');

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [0x0, { from: manager }],
                                                'Should reject invalid crydr controller address');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrControllerContract01.address, { from: miscAddress }],
                                                'Only allowed manager should be able to configure crydr storage');

    await crydrStorageBaseRoutines.setCrydrController(crydrStorageContract.address, manager, crydrControllerContract01.address);
    crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received, crydrControllerContract01.address,
                              'Manager should be able to configure crydr storage and set controller');

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrControllerContract01.address, { from: manager }],
                                                'New crydr controller should be different from the previous one');
    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.setCrydrController.sendTransaction,
                                                [crydrStorageContract.address, { from: manager }],
                                                'Storage can not be a controller');

    await PausableRoutines.unpauseContract(crydrStorageContract.address, manager);
    await PausableRoutines.pauseContract(crydrStorageContract.address, manager);

    await crydrStorageBaseRoutines.setCrydrController(crydrStorageContract.address, manager, crydrControllerContract02.address);
    crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received, crydrControllerContract02.address,
                              'Manager should be able to change crydr controller at any time');

    await PausableRoutines.unpauseContract(crydrStorageContract.address, manager);
  });

  global.it('check that crydr storage has correct pausable modifiers for configuration functions', async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });

    const managerPermissions = [
      'set_crydr_controller',
      'pause_contract',
      'unpause_contract'];
    await ManageableRoutines.enableManager(crydrStorageContract.address, owner, manager);
    await ManageableRoutines.grantManagerPermissions(crydrStorageContract.address, owner, manager, managerPermissions);


    let crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received, '0x0000000000000000000000000000000000000000', 'Default controller address should be zero');

    await PausableTestSuite.assertWhenContractPaused(
      crydrStorageContract.address,
      manager,
      crydrStorageContract.setCrydrController.sendTransaction,
      [crydrControllerContract01.address, { from: manager }]);

    crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received, crydrControllerContract01.address,
                              'Manager should be able to configure crydr storage and set controller');


    await PausableTestSuite.assertWhenContractPaused(
      crydrStorageContract.address,
      manager,
      crydrStorageContract.setCrydrController.sendTransaction,
      [crydrControllerContract02.address, { from: manager }]);

    crydrController01Received = await crydrStorageContract.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received, crydrControllerContract02.address,
                              'Manager should be able to reconfigure crydr storage and set different controller');
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
    await crydrStorageBaseRoutines.setCrydrController(crydrStorageContract.address, manager, crydrControllerContract01.address);
    const controllerAddress = crydrControllerContract01.address;
    const pastEvents = await crydrStorageBaseRoutines.getCrydrControllerChangedEvents(
      crydrStorageContract.address,
      {
        crydrcontroller: controllerAddress,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   manager,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });


  /**
   * Low-level setters
   */

  global.it('check that low-level setters work as expected', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');


    // increaseBalance & decreaseBalance

    let investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 0);
    let crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 0);

    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 10 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 10 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseRoutines.decreaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 5 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 5 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 5 * (10 ** 18));


    // increaseAllowance & decreaseAllowance

    let investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 0);

    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, 10 * (10 ** 18));

    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseRoutines.decreaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, 5 * (10 ** 18));

    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 5 * (10 ** 18));
  });

  global.it('should test that low-level setters fire events', async () => {
    let blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 10 * (10 ** 18));
    const controllerAddress = crydrControllerContract01.address;
    let pastEvents = await crydrStorageBaseRoutines.getAccountBalanceIncreasedEvents(
      crydrStorageContract.address,
      {
        account: investor01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.decreaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 5 * (10 ** 18));
    pastEvents = await crydrStorageBaseRoutines.getAccountBalanceDecreasedEvents(
      crydrStorageContract.address,
      {
        account: investor01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
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
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.decreaseAllowance(crydrControllerContract01.address, owner,
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
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('check that low-level setters throw if general conditions not met', async () => {
    global.console.log(`\tCrydrStorage contract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    // set non-zero values
    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 10 * (10 ** 18));
    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, 10 * (10 ** 18));

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

  global.it('check that crydr storage has correct pausable modifiers for low-level setters', async () => {
    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 100 * (10 ** 18));
    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, 100 * (10 ** 18));


    await PausableTestSuite.assertWhenContractNotPaused(
      crydrStorageContract.address,
      manager,
      crydrControllerContract01.increaseBalance.sendTransaction,
      [investor01, 5 * (10 ** 18), { from: owner }]);
    await PausableTestSuite.assertWhenContractNotPaused(
      crydrStorageContract.address,
      manager,
      crydrControllerContract01.decreaseBalance.sendTransaction,
      [investor01, 5 * (10 ** 18), { from: owner }]);
    await PausableTestSuite.assertWhenContractNotPaused(
      crydrStorageContract.address,
      manager,
      crydrControllerContract01.increaseAllowance.sendTransaction,
      [investor01, investor02, 5 * (10 ** 18), { from: owner }]);
    await PausableTestSuite.assertWhenContractNotPaused(
      crydrStorageContract.address,
      manager,
      crydrControllerContract01.decreaseAllowance.sendTransaction,
      [investor01, investor02, 5 * (10 ** 18), { from: owner }]);
  });

  global.it('test that low-level setters throw if not enough balance or integer overflow', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    const uint256Max = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');


    // increaseBalance & decreaseBalance

    let investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    let investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.decreaseBalance.sendTransaction,
                                                [investor01, 1, { from: owner }],
                                                'decreaseBalance should throw if integer overflow');

    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.decreaseBalance.sendTransaction,
                                                [investor01, 1001, { from: owner }],
                                                'decreaseBalance should throw if integer overflow');
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.increaseBalance.sendTransaction,
                                                [investor01, uint256Max.minus(999), { from: owner }],
                                                'increaseBalance should throw if integer overflow');

    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, uint256Max.minus(1000));
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.increaseBalance.sendTransaction,
                                                [investor01, 1, { from: owner }],
                                                'increaseBalance should throw if integer overflow');
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.increaseBalance.sendTransaction,
                                                [investor02, 1, { from: owner }],
                                                'increaseBalance should throw if integer overflow of total supply');


    // increaseAllowance & decreaseAllowance

    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.decreaseAllowance.sendTransaction,
                                                [investor01, investor02, 1, { from: owner }],
                                                'decreaseAllowance should throw if integer overflow');

    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 1000);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.decreaseAllowance.sendTransaction,
                                                [investor01, investor02, 1001, { from: owner }],
                                                'decreaseAllowance should throw if integer overflow');
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.increaseAllowance.sendTransaction,
                                                [
                                                  investor01,
                                                  investor02,
                                                  uint256Max.minus(999),
                                                  { from: owner }],
                                                'increaseAllowance should throw if integer overflow');

    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, uint256Max.minus(1000));
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.increaseAllowance.sendTransaction,
                                                [investor01, investor02, 1, { from: owner }],
                                                'increaseAllowance should throw if integer overflow');

    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
  });

  /**
   * Low-level change of blocks
   */

  global.it('test that blocking/unlocking functions throw if general conditions not met', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    let investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 0);

    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.blockAccount.sendTransaction,
                                                ['0x0', { from: owner }],
                                                'blockAccount should throw if account address is 0x0');

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.unlockAccount.sendTransaction,
                                                ['0x0', { from: owner }],
                                                'unlockAccount should throw if account address is 0x0');

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.blockFunds.sendTransaction,
                                                ['0x0', 1000, { from: owner }],
                                                'blockFunds should throw if account address is 0x0');

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.blockFunds.sendTransaction,
                                                [investor01, 0, { from: owner }],
                                                'blockFunds should throw if value is 0');

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.unlockFunds.sendTransaction,
                                                ['0x0', 1000, { from: owner }],
                                                'unlockFunds should throw if account address is 0x0');

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.unlockFunds.sendTransaction,
                                                [investor01, 0, { from: owner }],
                                                'unlockFunds should throw if value is 0');
  });

  global.it('test that blockFunds/unlockFunds functions throw if integer overflow', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    const uint256Max = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');


    await crydrStorageBaseRoutines.blockFunds(crydrControllerContract01.address, owner,
                                              investor01, uint256Max);
    let investorBlockFunds = await crydrStorageContract.getBlockFunds(investor01);
    global.assert.strictEqual(investorBlockFunds.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.blockFunds.sendTransaction,
                                                [investor01, 1, { from: owner }],
                                                'blockFunds should throw if integer overflow');

    await crydrStorageBaseRoutines.unlockFunds(crydrControllerContract01.address, owner,
                                               investor01, uint256Max);
    investorBlockFunds = await crydrStorageContract.getBlockFunds(investor01);
    global.assert.strictEqual(investorBlockFunds.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.unlockFunds.sendTransaction,
                                                [investor01, 1, { from: owner }],
                                                'blockFunds should throw if integer overflow');
  });

  global.it('should test that block/unlock functions fire events', async () => {
    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 10 * (10 ** 18));

    const controllerAddress = crydrControllerContract01.address;


    let blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.blockFunds(crydrControllerContract01.address, owner,
                                              investor01, 10 * (10 ** 18));
    let pastEvents = await crydrStorageBaseRoutines.getAccountBlockFundsEvents(
      crydrStorageContract.address,
      {
        account: investor01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.unlockFunds(crydrControllerContract01.address, owner,
                                               investor01, 5 * (10 ** 18));
    pastEvents = await crydrStorageBaseRoutines.getAccountUnlockFundsEvents(
      crydrStorageContract.address,
      {
        account: investor01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.blockAccount(crydrControllerContract01.address, owner,
                                                investor01);
    pastEvents = await crydrStorageBaseRoutines.getAccountBlockEvents(
      crydrStorageContract.address,
      {
        owner: investor01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseRoutines.unlockAccount(crydrControllerContract01.address, owner,
                                                 investor01);
    pastEvents = await crydrStorageBaseRoutines.getAccountUnlockEvents(
      crydrStorageContract.address,
      {
        owner: investor01,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('check that block/unlock functions work as expected', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    let investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 0);

    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 10 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseRoutines.blockAccount(crydrControllerContract01.address, owner,
                                                investor01);
    let accountBlock = await crydrStorageContract.getBlockAccount.call(investor01);
    global.assert.strictEqual(accountBlock.toNumber(), 1);

    await crydrStorageBaseRoutines.unlockAccount(crydrControllerContract01.address, owner,
                                                 investor01);
    accountBlock = await crydrStorageContract.getBlockAccount.call(investor01);
    global.assert.strictEqual(accountBlock.toNumber(), 0);

    await crydrStorageBaseRoutines.blockFunds(crydrControllerContract01.address, owner,
                                              investor01, 10 * (10 ** 18));
    let blockFunds = await crydrStorageContract.getBlockFunds.call(investor01);
    global.assert.strictEqual(blockFunds.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseRoutines.unlockFunds(crydrControllerContract01.address, owner,
                                               investor01, 5 * (10 ** 18));
    blockFunds = await crydrStorageContract.getBlockFunds.call(investor01);
    global.assert.strictEqual(blockFunds.toNumber(), 5 * (10 ** 18));

    await crydrStorageBaseRoutines.unlockFunds(crydrControllerContract01.address, owner,
                                               investor01, 5 * (10 ** 18));
    blockFunds = await crydrStorageContract.getBlockFunds.call(investor01);
    global.assert.strictEqual(blockFunds.toNumber(), 0);
  });
});
