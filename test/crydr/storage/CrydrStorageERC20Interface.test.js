const CrydrStorage = global.artifacts.require('CrydrStorage.sol');
const CrydrController = global.artifacts.require('CrydrControllerMock.sol');

const PausableJSAPI = require('../../../jsapi/lifecycle/Pausable');
const crydrStorageBaseJSAPI = require('../../../jsapi/crydr/storage/CrydrStorageBaseInterface');
const crydrStorageERC20Routines = require('../../../jsapi/crydr/storage/CrydrStorageERC20Interface');
const CrydrStorageBaseInterfaceJSAPI = require('../../../jsapi/crydr/storage/CrydrStorageBaseInterface');

const CrydrStorageInit = require('../../../migrations/init/CrydrStorageInit');
const GlobalConfig = require('../../../migrations/init/GlobalConfig');

const CheckExceptions = require('../../../test_util/CheckExceptions');


global.contract('CrydrStorageERC20Interface', (accounts) => {
  GlobalConfig.setAccounts(accounts);
  const { owner, managerPause, managerGeneral, testInvestor1, testInvestor2, testInvestor3 } =
    GlobalConfig.getAccounts();

  let crydrStorageContract;
  let crydrControllerContract01;
  let crydrControllerContract02;

  global.beforeEach(async () => {
    crydrStorageContract = await CrydrStorage.new('jXYZ', { from: owner });
    crydrControllerContract01 = await CrydrController.new(crydrStorageContract.address, 'jXYZ',
                                                          { from: owner });
    crydrControllerContract02 = await CrydrController.new(crydrStorageContract.address, 'jXYZ',
                                                          { from: owner });

    await CrydrStorageInit.configureCrydrStorageManagers(crydrStorageContract.address);
    await CrydrStorageBaseInterfaceJSAPI
      .setCrydrController(crydrStorageContract.address, managerGeneral, crydrControllerContract01.address);
    await PausableJSAPI.unpauseContract(crydrStorageContract.address, managerPause);
  });


  global.it('check that ERC20 setters work as expected', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');


    // set non-zero balances

    let testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 0);
    let testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 0);
    let testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    let testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 0);
    let crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 0);

    await crydrStorageBaseJSAPI.increaseBalance(crydrControllerContract01.address, owner,
                                                testInvestor1, 10 * (10 ** 18));

    testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 10 * (10 ** 18));
    testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 0);
    testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // transfer

    await crydrStorageERC20Routines.transfer(crydrControllerContract01.address, owner,
                                             testInvestor1, testInvestor2, 2 * (10 ** 18));

    testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 8 * (10 ** 18));
    testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 2 * (10 ** 18));
    testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageERC20Routines.transfer(crydrControllerContract01.address, owner,
                                             testInvestor1, testInvestor2, 1 * (10 ** 18));

    testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 7 * (10 ** 18));
    testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 3 * (10 ** 18));
    testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // approve

    await crydrStorageERC20Routines.approve(crydrControllerContract01.address, owner,
                                            testInvestor1, testInvestor2, 3 * (10 ** 18));

    testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 7 * (10 ** 18));
    testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 3 * (10 ** 18));
    testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 3 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageERC20Routines.approve(crydrControllerContract01.address, owner,
                                            testInvestor1, testInvestor2, 5 * (10 ** 18));

    testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 7 * (10 ** 18));
    testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 3 * (10 ** 18));
    testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 5 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // transferFrom

    await crydrStorageERC20Routines.transferFrom(crydrControllerContract01.address, owner,
                                                 testInvestor2, testInvestor1, testInvestor3, 1 * (10 ** 18));

    testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 6 * (10 ** 18));
    testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 3 * (10 ** 18));
    testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 1 * (10 ** 18));
    testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 4 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageERC20Routines.transferFrom(crydrControllerContract01.address, owner,
                                                 testInvestor2, testInvestor1, testInvestor3, 2 * (10 ** 18));

    testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 4 * (10 ** 18));
    testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 3 * (10 ** 18));
    testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 3 * (10 ** 18));
    testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 2 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageERC20Routines.transferFrom(crydrControllerContract01.address, owner,
                                                 testInvestor2, testInvestor1, testInvestor2, 1 * (10 ** 18));

    testInvestor1Balance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toNumber(), 3 * (10 ** 18));
    testInvestor2Balance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 4 * (10 ** 18));
    testInvestor3Balance = await crydrStorageContract.getBalance.call(testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 3 * (10 ** 18));
    testInvestor1to02Allowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 1 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));
  });

  global.it('should test that ERC20 setters fire events', async () => {
    // set non-zero balance
    await crydrStorageBaseJSAPI.increaseBalance(crydrControllerContract01.address, owner,
                                                testInvestor1, 10 * (10 ** 18));


    let blockNumber = global.web3.eth.blockNumber;
    await crydrStorageERC20Routines.transfer(crydrControllerContract01.address, owner,
                                             testInvestor1, testInvestor2, 5 * (10 ** 18));
    const controllerAddress = crydrControllerContract01.address;
    let pastEvents = await crydrStorageERC20Routines.getCrydrTransferredEvents(
      crydrStorageContract.address,
      {
        from: testInvestor1,
        to:   testInvestor2,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageERC20Routines.approve(crydrControllerContract01.address, owner,
                                            testInvestor1, testInvestor2, 5 * (10 ** 18));
    pastEvents = await crydrStorageERC20Routines.getCrydrSpendingApprovedEvents(
      crydrStorageContract.address,
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
    await crydrStorageERC20Routines.transferFrom(crydrControllerContract01.address, owner,
                                                 testInvestor2, testInvestor1, testInvestor2, 5 * (10 ** 18));
    pastEvents = await crydrStorageERC20Routines.getCrydrTransferredFromEvents(
      crydrStorageContract.address,
      {
        spender: testInvestor2,
        from:    testInvestor1,
        to:      testInvestor2,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('check that ERC20 setters throw if general conditions not met', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    // set non-zero values
    await crydrStorageBaseJSAPI.increaseBalance(crydrControllerContract01.address, owner,
                                                testInvestor1, 10 * (10 ** 18));
    await crydrStorageBaseJSAPI.increaseAllowance(crydrControllerContract01.address, owner,
                                                  testInvestor1, testInvestor2, 10 * (10 ** 18));

    // pause contract
    await PausableJSAPI.pauseContract(crydrStorageContract.address, managerPause);


    // test that methods throw if contract is paused
    await CheckExceptions.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                              [testInvestor1, testInvestor2, 2 * (10 ** 18), { from: owner }],
                                              'transfer should throw if contract is paused');
    await CheckExceptions.checkContractThrows(crydrControllerContract01.approve.sendTransaction,
                                              [testInvestor1, testInvestor2, 2 * (10 ** 18), { from: owner }],
                                              'approve should throw if contract is paused');
    await CheckExceptions.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                              [
                                                testInvestor2,
                                                testInvestor1,
                                                testInvestor2,
                                                2 * (10 ** 18),
                                                { from: owner }],
                                              'transferFrom should throw if contract is paused');

    // unpause contract
    await PausableJSAPI.unpauseContract(crydrStorageContract.address, managerPause);

    // block/unlock
    await crydrStorageBaseJSAPI.blockAccount(crydrControllerContract01.address, owner,
                                             testInvestor1);
    await CheckExceptions.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                              [testInvestor1, testInvestor2, 2 * (10 ** 18), { from: owner }],
                                              'transfer should throw if account is blocked');
    await crydrStorageERC20Routines.approve(crydrControllerContract01.address, owner,
                                            testInvestor1, testInvestor2, 2 * (10 ** 18));
    await CheckExceptions.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                              [
                                                testInvestor2,
                                                testInvestor1,
                                                testInvestor2,
                                                2 * (10 ** 18),
                                                { from: owner }],
                                              'transferFrom should throw if account is blocked');

    await crydrStorageBaseJSAPI.unblockAccount(crydrControllerContract01.address, owner,
                                               testInvestor1);

    await crydrStorageBaseJSAPI.blockAccountFunds(crydrControllerContract01.address, owner,
                                                  testInvestor1, 7 * (10 ** 18));
    await CheckExceptions.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                              [testInvestor1, testInvestor2, 4 * (10 ** 18), { from: owner }],
                                              'transfer should throw if funds is blocked');
    await CheckExceptions.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                              [
                                                testInvestor2,
                                                testInvestor1,
                                                testInvestor2,
                                                4 * (10 ** 18),
                                                { from: owner }],
                                              'transferFrom should throw if funds is blocked');

    // test that only crydr controller is able to invoke setters
    await CheckExceptions.checkContractThrows(crydrControllerContract02.transfer.sendTransaction,
                                              [testInvestor1, testInvestor2, 2 * (10 ** 18), { from: owner }],
                                              'transfer should throw if contract is paused');
    await CheckExceptions.checkContractThrows(crydrControllerContract02.approve.sendTransaction,
                                              [testInvestor1, testInvestor2, 2 * (10 ** 18), { from: owner }],
                                              'approve should throw if contract is paused');
    await CheckExceptions.checkContractThrows(crydrControllerContract02.transferFrom.sendTransaction,
                                              [
                                                testInvestor2,
                                                testInvestor1,
                                                testInvestor2,
                                                2 * (10 ** 18),
                                                { from: owner }],
                                              'transferFrom should throw if contract is paused');
  });

  global.it('test that ERC20 setters throw if not enough balance or integer overflow - transfer', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');


    let investorBalance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);

    await CheckExceptions.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                              [testInvestor1, testInvestor2, 1, { from: owner }],
                                              'transfer should throw if not enough balance');

    await crydrStorageBaseJSAPI.increaseBalance(crydrControllerContract01.address, owner,
                                                testInvestor1, 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);

    await CheckExceptions.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                              [testInvestor1, testInvestor2, 1001, { from: owner }],
                                              'transfer should throw if not enough balance');

    investorBalance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
  });

  global.it('test that ERC20 setters throw if not enough balance or integer overflow - transferFrom', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');


    let investorBalance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    let investorAllowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await CheckExceptions.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                              [testInvestor2, testInvestor1, testInvestor2, 1, { from: owner }],
                                              'transferFrom should throw if not enough balance');

    await crydrStorageBaseJSAPI.increaseBalance(crydrControllerContract01.address, owner,
                                                testInvestor1, 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await CheckExceptions.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                              [testInvestor2, testInvestor1, testInvestor2, 1, { from: owner }],
                                              'transferFrom should throw if not enough allowance');

    await crydrStorageBaseJSAPI.increaseAllowance(crydrControllerContract01.address, owner,
                                                  testInvestor1, testInvestor2, 500);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 500);

    await CheckExceptions.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                              [testInvestor2, testInvestor1, testInvestor2, 501, { from: owner }],
                                              'transferFrom should throw if not enough allowance');

    await crydrStorageBaseJSAPI.increaseAllowance(crydrControllerContract01.address, owner,
                                                  testInvestor1, testInvestor2, 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 1500);

    await CheckExceptions.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                              [testInvestor2, testInvestor1, testInvestor2, 1001, { from: owner }],
                                              'transferFrom should throw if not enough balance');

    investorBalance = await crydrStorageContract.getBalance.call(testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance.call(testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 1500);
  });
});
