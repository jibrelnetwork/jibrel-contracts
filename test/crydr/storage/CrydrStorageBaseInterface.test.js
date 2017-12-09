const BigNumber = require('bignumber.js');

const CrydrStorage = global.artifacts.require('CrydrStorage.sol');
const CrydrStorageERC20Proxy = global.artifacts.require('CrydrStorageERC20Proxy.sol');

const PausableJSAPI = require('../../../jsroutines/jsapi/lifecycle/Pausable');
const crydrStorageBaseJSAPI = require('../../../jsroutines/jsapi/crydr/storage/CrydrStorageBaseInterface');
const CrydrStorageBaseInterfaceJSAPI = require('../../../jsroutines/jsapi/crydr/storage/CrydrStorageBaseInterface');

const CrydrStorageInit = require('../../../jsroutines/jsinit/CrydrStorageInit');
const DeployConfig = require('../../../jsroutines/jsconfig/DeployConfig');

const CheckExceptions = require('../../../jsroutines/test_util/CheckExceptions');
const PausableTestSuite = require('../../../jsroutines/test_suit/lifecycle/Pausable');


global.contract('CrydrStorageBaseInterface', (accounts) => {
  DeployConfig.setAccounts(accounts);
  const { owner, managerPause, managerGeneral, testInvestor1, testInvestor2 } = DeployConfig.getAccounts();

  let crydrStorageInstance;
  let storageProxyInstance01;
  let storageProxyInstance02;
  let storageProxyInstance03;


  /**
   * Configuration
   */

  global.beforeEach(async () => {
    crydrStorageInstance = await CrydrStorage.new('jXYZ', { from: owner });

    const crydrController01Received = await crydrStorageInstance.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received,
                              '0x0000000000000000000000000000000000000000',
                              'Default controller address should be zero');

    storageProxyInstance01 = await CrydrStorageERC20Proxy.new('jXYZ', crydrStorageInstance.address,
                                                              { from: owner });
    storageProxyInstance02 = await CrydrStorageERC20Proxy.new('jXYZ', crydrStorageInstance.address,
                                                              { from: owner });
    storageProxyInstance03 = await CrydrStorageERC20Proxy.new('jZZZ', crydrStorageInstance.address,
                                                              { from: owner });

    await CrydrStorageInit.configureCrydrStorageManagers(crydrStorageInstance.address);
    await CrydrStorageBaseInterfaceJSAPI
      .setCrydrController(crydrStorageInstance.address, managerGeneral, storageProxyInstance01.address);
    await PausableJSAPI.unpauseContract(crydrStorageInstance.address, managerPause);
  });

  global.it('check that crydr storage is configurable', async () => {
    await PausableJSAPI.pauseContract(crydrStorageInstance.address, managerPause);

    await CheckExceptions.checkContractThrows(crydrStorageInstance.setCrydrController.sendTransaction,
                                              [0x0, { from: managerGeneral }],
                                              'Should reject invalid crydr controller address');
    await CheckExceptions.checkContractThrows(crydrStorageInstance.setCrydrController.sendTransaction,
                                              [storageProxyInstance01.address, { from: testInvestor1 }],
                                              'Only allowed manager should be able to configure crydr storage');

    await crydrStorageBaseJSAPI.setCrydrController(crydrStorageInstance.address, managerGeneral,
                                                   storageProxyInstance02.address);

    let crydrControllerAddress = await crydrStorageInstance.getCrydrController.call();
    global.assert.strictEqual(crydrControllerAddress, storageProxyInstance02.address,
                              'Manager should be able to configure crydr storage and set controller');

    await CheckExceptions.checkContractThrows(crydrStorageInstance.setCrydrController.sendTransaction,
                                              [storageProxyInstance02.address, { from: managerGeneral }],
                                              'New crydr controller should be different from the previous one');

    await PausableJSAPI.unpauseContract(crydrStorageInstance.address, managerPause);
    await PausableJSAPI.pauseContract(crydrStorageInstance.address, managerPause);

    await crydrStorageBaseJSAPI.setCrydrController(crydrStorageInstance.address, managerGeneral,
                                                   storageProxyInstance03.address);
    crydrControllerAddress = await crydrStorageInstance.getCrydrController.call();
    global.assert.strictEqual(crydrControllerAddress, storageProxyInstance03.address,
                              'Manager should be able to change crydr controller at any time');
    await CheckExceptions.checkContractThrows(crydrStorageInstance.unpauseContract.sendTransaction,
                                              [{ from: managerPause }],
                                              'should not be possible');
    const isPaused = await crydrStorageInstance.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Contract should be paused');

    await crydrStorageBaseJSAPI.setCrydrController(crydrStorageInstance.address, managerGeneral,
                                                   storageProxyInstance02.address);
    const crydrController02Received = await crydrStorageInstance.getCrydrController.call();
    global.assert.strictEqual(crydrController02Received, storageProxyInstance02.address,
                              'Manager should be able to change crydr controller at any time');

    await PausableJSAPI.unpauseContract(crydrStorageInstance.address, managerPause);
  });

  global.it('check that crydr storage has correct pausable modifiers for configuration functions', async () => {
    await PausableJSAPI.pauseContract(crydrStorageInstance.address, managerPause);
    await crydrStorageBaseJSAPI.setCrydrController(crydrStorageInstance.address, managerGeneral,
                                                   storageProxyInstance02.address);

    await PausableTestSuite.assertWhenContractPaused(
      crydrStorageInstance.address,
      managerPause,
      crydrStorageInstance.setCrydrController.sendTransaction,
      [storageProxyInstance01.address, { from: managerGeneral }]);

    let crydrController01Received = await crydrStorageInstance.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received, storageProxyInstance01.address,
                              'Manager should be able to configure crydr storage and set controller');


    const isPaused = await crydrStorageInstance.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'should be paused');

    await PausableTestSuite.assertWhenContractPaused(
      crydrStorageInstance.address,
      managerPause,
      crydrStorageInstance.setCrydrController.sendTransaction,
      [storageProxyInstance02.address, { from: managerGeneral }]);

    crydrController01Received = await crydrStorageInstance.getCrydrController.call();
    global.assert.strictEqual(crydrController01Received, storageProxyInstance02.address,
                              'Manager should be able to reconfigure crydr storage and set different controller');
  });

  global.it('should test that configuration functions fire events', async () => {
    await PausableJSAPI.pauseContract(crydrStorageInstance.address, managerPause);
    const blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.setCrydrController(crydrStorageInstance.address, managerGeneral,
                                                   storageProxyInstance02.address);
    const controllerAddress = storageProxyInstance02.address;
    const pastEvents = await crydrStorageBaseJSAPI.getCrydrControllerChangedEvents(
      crydrStorageInstance.address,
      {
        crydrcontroller: controllerAddress,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   managerGeneral,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });


  /**
   * Low-level setters
   */

  global.it('check that low-level setters work as expected', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');


    // increaseBalance & decreaseBalance

    let testInvestor1Balance = await crydrStorageInstance.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 0);
    let crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 0);

    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 10 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 10 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseJSAPI.decreaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 5 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 5 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 5 * (10 ** 18));


    // increaseAllowance & decreaseAllowance

    let testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 0);

    await crydrStorageBaseJSAPI.increaseAllowance(storageProxyInstance01.address, owner,
                                                  testInvestor1, testInvestor2, 10 * (10 ** 18));

    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseJSAPI.decreaseAllowance(storageProxyInstance01.address, owner,
                                                  testInvestor1, testInvestor2, 5 * (10 ** 18));

    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 5 * (10 ** 18));
  });

  global.it('should test that low-level setters fire events', async () => {
    let blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 10 * (10 ** 18));
    const controllerAddress = storageProxyInstance01.address;
    let pastEvents = await crydrStorageBaseJSAPI.getAccountBalanceIncreasedEvents(
      crydrStorageInstance.address,
      {
        account: testInvestor1,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.decreaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 5 * (10 ** 18));
    pastEvents = await crydrStorageBaseJSAPI.getAccountBalanceDecreasedEvents(
      crydrStorageInstance.address,
      {
        account: testInvestor1,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.increaseAllowance(storageProxyInstance01.address, owner,
                                                  testInvestor1, testInvestor2, 10 * (10 ** 18));
    pastEvents = await crydrStorageBaseJSAPI.getAccountAllowanceIncreasedEvents(
      crydrStorageInstance.address,
      {
        owner:   testInvestor1,
        spender: testInvestor2,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.decreaseAllowance(storageProxyInstance01.address, owner,
                                                  testInvestor1, testInvestor2, 5 * (10 ** 18));
    pastEvents = await crydrStorageBaseJSAPI.getAccountAllowanceDecreasedEvents(
      crydrStorageInstance.address,
      {
        owner:   testInvestor1,
        spender: testInvestor2,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('check that low-level setters throw if general conditions not met', async () => {
    global.console.log(`\tCrydrStorage contract: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');

    // set non-zero values
    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 10 * (10 ** 18));
    await crydrStorageBaseJSAPI.increaseAllowance(storageProxyInstance01.address, owner,
                                                  testInvestor1, testInvestor2, 10 * (10 ** 18));

    // test that only crydr controller is able to invoke setters
    await CheckExceptions.checkContractThrows(crydrStorageInstance.increaseBalance.sendTransaction,
                                              [testInvestor1, 5 * (10 ** 18), { from: testInvestor1 }],
                                              'increaseBalance should throw if called by non-controller');
    await CheckExceptions.checkContractThrows(crydrStorageInstance.decreaseBalance.sendTransaction,
                                              [testInvestor1, 5 * (10 ** 18), { from: testInvestor1 }],
                                              'decreaseBalance should throw if called by non-controller');
    await CheckExceptions.checkContractThrows(crydrStorageInstance.increaseAllowance.sendTransaction,
                                              [testInvestor1, testInvestor2, 5 * (10 ** 18),
                                                { from: testInvestor1 }],
                                              'increaseAllowance should throw if called by non-controller');
    await CheckExceptions.checkContractThrows(crydrStorageInstance.decreaseAllowance.sendTransaction,
                                              [testInvestor1, testInvestor2, 5 * (10 ** 18),
                                                { from: testInvestor1 }],
                                              'decreaseAllowance should throw if called by non-controller');
  });

  global.it('check that crydr storage has correct pausable modifiers for low-level setters', async () => {
    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 100 * (10 ** 18));
    await crydrStorageBaseJSAPI.increaseAllowance(storageProxyInstance01.address, owner,
                                                  testInvestor1, testInvestor2, 100 * (10 ** 18));


    await PausableTestSuite.assertWhenContractNotPaused(
      crydrStorageInstance.address,
      managerPause,
      storageProxyInstance01.increaseBalance.sendTransaction,
      [testInvestor1, 5 * (10 ** 18), { from: owner }]);
    await PausableTestSuite.assertWhenContractNotPaused(
      crydrStorageInstance.address,
      managerPause,
      storageProxyInstance01.decreaseBalance.sendTransaction,
      [testInvestor1, 5 * (10 ** 18), { from: owner }]);
    await PausableTestSuite.assertWhenContractNotPaused(
      crydrStorageInstance.address,
      managerPause,
      storageProxyInstance01.increaseAllowance.sendTransaction,
      [testInvestor1, testInvestor2, 5 * (10 ** 18), { from: owner }]);
    await PausableTestSuite.assertWhenContractNotPaused(
      crydrStorageInstance.address,
      managerPause,
      storageProxyInstance01.decreaseAllowance.sendTransaction,
      [testInvestor1, testInvestor2, 5 * (10 ** 18), { from: owner }]);
  });

  global.it('test that low-level setters throw if not enough balance or integer overflow', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');

    const uint256Max = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');


    // increaseBalance & decreaseBalance

    let investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    let investorAllowance = await crydrStorageInstance.getAllowance(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.decreaseBalance.sendTransaction,
                                              [testInvestor1, 1, { from: owner }],
                                              'decreaseBalance should throw if integer overflow');

    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 1000);
    investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorAllowance = await crydrStorageInstance.getAllowance(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.decreaseBalance.sendTransaction,
                                              [testInvestor1, 1001, { from: owner }],
                                              'decreaseBalance should throw if integer overflow');
    await CheckExceptions.checkContractThrows(storageProxyInstance01.increaseBalance.sendTransaction,
                                              [testInvestor1, uint256Max.minus(999), { from: owner }],
                                              'increaseBalance should throw if integer overflow');

    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, uint256Max.minus(1000));
    investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageInstance.getAllowance(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.increaseBalance.sendTransaction,
                                              [testInvestor1, 1, { from: owner }],
                                              'increaseBalance should throw if integer overflow');
    await CheckExceptions.checkContractThrows(storageProxyInstance01.increaseBalance.sendTransaction,
                                              [testInvestor2, 1, { from: owner }],
                                              'increaseBalance should throw if integer overflow of total supply');


    // increaseAllowance & decreaseAllowance

    investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageInstance.getAllowance(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.decreaseAllowance.sendTransaction,
                                              [testInvestor1, testInvestor2, 1, { from: owner }],
                                              'decreaseAllowance should throw if integer overflow');

    await crydrStorageBaseJSAPI.increaseAllowance(storageProxyInstance01.address, owner,
                                                  testInvestor1, testInvestor2, 1000);
    investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageInstance.getAllowance(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 1000);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.decreaseAllowance.sendTransaction,
                                              [testInvestor1, testInvestor2, 1001, { from: owner }],
                                              'decreaseAllowance should throw if integer overflow');
    await CheckExceptions.checkContractThrows(storageProxyInstance01.increaseAllowance.sendTransaction,
                                              [testInvestor1,
                                               testInvestor2,
                                               uint256Max.minus(999),
                                               { from: owner }],
                                              'increaseAllowance should throw if integer overflow');

    await crydrStorageBaseJSAPI.increaseAllowance(storageProxyInstance01.address, owner,
                                                  testInvestor1, testInvestor2, uint256Max.minus(1000));
    investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageInstance.getAllowance(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.increaseAllowance.sendTransaction,
                                              [testInvestor1, testInvestor2, 1, { from: owner }],
                                              'increaseAllowance should throw if integer overflow');

    investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    investorAllowance = await crydrStorageInstance.getAllowance(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
  });

  /**
   * Low-level change of blocks
   */

  global.it('test that blocking/unlocking functions throw if general conditions not met', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');

    let investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 0);

    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 1000);
    investorBalance = await crydrStorageInstance.getBalance(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.blockAccount.sendTransaction,
                                              ['0x0', { from: owner }],
                                              'blockAccount should throw if account address is 0x0');

    await CheckExceptions.checkContractThrows(storageProxyInstance01.unblockAccount.sendTransaction,
                                              ['0x0', { from: owner }],
                                              'unblockAccount should throw if account address is 0x0');

    await CheckExceptions.checkContractThrows(storageProxyInstance01.blockAccountFunds.sendTransaction,
                                              ['0x0', 1000, { from: owner }],
                                              'blockAccountFunds should throw if account address is 0x0');

    await CheckExceptions.checkContractThrows(storageProxyInstance01.blockAccountFunds.sendTransaction,
                                              [testInvestor1, 0, { from: owner }],
                                              'blockAccountFunds should throw if value is 0');

    await CheckExceptions.checkContractThrows(storageProxyInstance01.unblockAccountFunds.sendTransaction,
                                              ['0x0', 1000, { from: owner }],
                                              'unblockAccountFunds should throw if account address is 0x0');

    await CheckExceptions.checkContractThrows(storageProxyInstance01.unblockAccountFunds.sendTransaction,
                                              [testInvestor1, 0, { from: owner }],
                                              'unblockAccountFunds should throw if value is 0');
  });

  global.it('test that blockAccountFunds/unblockAccountFunds functions throw if integer overflow', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');

    const uint256Max = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');


    await crydrStorageBaseJSAPI.blockAccountFunds(storageProxyInstance01.address, owner,
                                                  testInvestor1, uint256Max);
    let investorBlockFunds = await crydrStorageInstance.getAccountBlockedFunds(testInvestor1);
    global.assert.strictEqual(investorBlockFunds.toNumber(),
                              0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.blockAccountFunds.sendTransaction,
                                              [testInvestor1, 1, { from: owner }],
                                              'blockAccountFunds should throw if integer overflow');

    await crydrStorageBaseJSAPI.unblockAccountFunds(storageProxyInstance01.address, owner,
                                                    testInvestor1, uint256Max);
    investorBlockFunds = await crydrStorageInstance.getAccountBlockedFunds(testInvestor1);
    global.assert.strictEqual(investorBlockFunds.toNumber(), 0);

    await CheckExceptions.checkContractThrows(storageProxyInstance01.unblockAccountFunds.sendTransaction,
                                              [testInvestor1, 1, { from: owner }],
                                              'blockAccountFunds should throw if integer overflow');
  });

  global.it('should test that block/unlock functions fire events', async () => {
    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 10 * (10 ** 18));

    const controllerAddress = storageProxyInstance01.address;


    let blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.blockAccountFunds(storageProxyInstance01.address, owner,
                                                  testInvestor1, 10 * (10 ** 18));
    let pastEvents = await crydrStorageBaseJSAPI.getAccountFundsBlockedEvents(
      crydrStorageInstance.address,
      {
        account: testInvestor1,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.unblockAccountFunds(storageProxyInstance01.address, owner,
                                                    testInvestor1, 5 * (10 ** 18));
    pastEvents = await crydrStorageBaseJSAPI.getAccountFundsUnblockedEvents(
      crydrStorageInstance.address,
      {
        account: testInvestor1,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.blockAccount(storageProxyInstance01.address, owner,
                                             testInvestor1);
    pastEvents = await crydrStorageBaseJSAPI.getAccountBlockedEvents(
      crydrStorageInstance.address,
      {
        owner: testInvestor1,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageBaseJSAPI.unblockAccount(storageProxyInstance01.address, owner,
                                               testInvestor1);
    pastEvents = await crydrStorageBaseJSAPI.getAccountUnblockedEvents(
      crydrStorageInstance.address,
      {
        owner: testInvestor1,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('check that block/unlock functions work as expected', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');

    let testInvestor1Balance = await crydrStorageInstance.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 0);

    await crydrStorageBaseJSAPI.increaseBalance(storageProxyInstance01.address, owner,
                                                testInvestor1, 10 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseJSAPI.blockAccount(storageProxyInstance01.address, owner,
                                             testInvestor1);
    let accountBlock = await crydrStorageInstance.getAccountBlocks.call(testInvestor1);
    global.assert.strictEqual(accountBlock.toNumber(), 1);

    await crydrStorageBaseJSAPI.unblockAccount(storageProxyInstance01.address, owner,
                                               testInvestor1);
    accountBlock = await crydrStorageInstance.getAccountBlocks.call(testInvestor1);
    global.assert.strictEqual(accountBlock.toNumber(), 0);

    await crydrStorageBaseJSAPI.blockAccountFunds(storageProxyInstance01.address, owner,
                                                  testInvestor1, 10 * (10 ** 18));
    let blockAccountFunds = await crydrStorageInstance.getAccountBlockedFunds.call(testInvestor1);
    global.assert.strictEqual(blockAccountFunds.toNumber(), 10 * (10 ** 18));

    await crydrStorageBaseJSAPI.unblockAccountFunds(storageProxyInstance01.address, owner,
                                                    testInvestor1, 5 * (10 ** 18));
    blockAccountFunds = await crydrStorageInstance.getAccountBlockedFunds.call(testInvestor1);
    global.assert.strictEqual(blockAccountFunds.toNumber(), 5 * (10 ** 18));

    await crydrStorageBaseJSAPI.unblockAccountFunds(storageProxyInstance01.address, owner,
                                                    testInvestor1, 5 * (10 ** 18));
    blockAccountFunds = await crydrStorageInstance.getAccountBlockedFunds.call(testInvestor1);
    global.assert.strictEqual(blockAccountFunds.toNumber(), 0);
  });
});
