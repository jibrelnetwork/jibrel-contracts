import * as PausableInterfaceJSAPI from '../../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as CrydrStorageBaseInterfaceJSAPI from '../../../contracts/crydr/storage/CrydrStorageBase/CrydrStorageBaseInterface.jsapi';
import * as CrydrStorageBalanceInterfaceJSAPI from '../../../contracts/crydr/storage/CrydrStorageBalance/CrydrStorageBalanceInterface.jsapi';
import * as CrydrStorageAllowanceInterfaceJSAPI from '../../../contracts/crydr/storage/CrydrStorageAllowance/CrydrStorageAllowanceInterface.jsapi';
import * as CrydrStorageBlocksInterfaceJSAPI from '../../../contracts/crydr/storage/CrydrStorageBlocks/CrydrStorageBlocksInterface.jsapi';
import * as CrydrStorageERC20InterfaceJSAPI from '../../../contracts/crydr/storage/CrydrStorageERC20/CrydrStorageERC20Interface.jsapi';

import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';
import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';
import * as BnUtil from '../../../jsroutines/util/BnUtil';

import * as CrydrStorageInit from '../../../jsroutines/jsinit/CrydrStorageInit';

const JCashCrydrStorage = global.artifacts.require('JCashCrydrStorage.sol');
const CrydrStorageERC20Proxy = global.artifacts.require('CrydrStorageERC20Proxy.sol');


global.contract('CrydrStorageERC20Interface', (accounts) => {
  TxConfig.setWeb3(global.web3);

  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();


  let crydrStorageInstance;
  let storageProxyInstance01;
  let storageProxyInstance02;


  global.beforeEach(async () => {
    crydrStorageInstance = await JCashCrydrStorage.new('jXYZ', { from: ethAccounts.owner });
    storageProxyInstance01 = await CrydrStorageERC20Proxy.new('jXYZ', crydrStorageInstance.address,
                                                              { from: ethAccounts.owner });
    storageProxyInstance02 = await CrydrStorageERC20Proxy.new('jXYZ', crydrStorageInstance.address,
                                                              { from: ethAccounts.owner });

    await CrydrStorageInit.configureCrydrStorageManagers(crydrStorageInstance.address, ethAccounts);
    await CrydrStorageBaseInterfaceJSAPI
      .setCrydrController(crydrStorageInstance.address, ethAccounts.managerGeneral, storageProxyInstance01.address);
    await PausableInterfaceJSAPI.unpauseContract(crydrStorageInstance.address, ethAccounts.managerPause);
  });


  global.it('check that ERC20 setters work as expected', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');


    // set non-zero balances

    let testInvestor1Balance = await crydrStorageInstance.getBalance(ethAccounts.testInvestor1);
    global.assert.strictEqual(testInvestor1Balance.toString(), '0');
    let testInvestor2Balance = await crydrStorageInstance.getBalance(ethAccounts.testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toString(), '0');
    let testInvestor3Balance = await crydrStorageInstance.getBalance(ethAccounts.testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toString(), '0');
    let testInvestor1to02Allowance = await crydrStorageInstance.getAllowance(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toString(), '0');
    let crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply();
    global.assert.strictEqual(crydrStorageTotalSupply.toString(), '0');

    await CrydrStorageBalanceInterfaceJSAPI.increaseBalance(storageProxyInstance01.address, ethAccounts.owner,
                                                            ethAccounts.testInvestor1, 10 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.isTrue(testInvestor1Balance.eq(BnUtil.ether(10)));
    testInvestor2Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(testInvestor2Balance.toNumber(), 0);
    testInvestor3Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.isTrue(crydrStorageTotalSupply.eq(BnUtil.ether(10)));


    // transfer

    await CrydrStorageERC20InterfaceJSAPI.transfer(storageProxyInstance01.address, ethAccounts.owner,
                                                   ethAccounts.testInvestor1, ethAccounts.testInvestor2, 2 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.isTrue(testInvestor1Balance.eq(BnUtil.ether(8)));
    testInvestor2Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor2Balance.eq(BnUtil.ether(2)));
    testInvestor3Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.isTrue(crydrStorageTotalSupply.eq(BnUtil.ether(10)));

    await CrydrStorageERC20InterfaceJSAPI.transfer(storageProxyInstance01.address, ethAccounts.owner,
                                                   ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.isTrue(testInvestor1Balance.eq(BnUtil.ether(7)));
    testInvestor2Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor2Balance.eq(BnUtil.ether(3)));
    testInvestor3Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(testInvestor1to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.isTrue(crydrStorageTotalSupply.eq(BnUtil.ether(10)));


    // approve

    await CrydrStorageERC20InterfaceJSAPI.approve(storageProxyInstance01.address, ethAccounts.owner,
                                                  ethAccounts.testInvestor1, ethAccounts.testInvestor2, 3 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.isTrue(testInvestor1Balance.eq(BnUtil.ether(7)));
    testInvestor2Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor2Balance.eq(BnUtil.ether(3)));
    testInvestor3Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor1to02Allowance.eq(BnUtil.ether(3)));
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.isTrue(crydrStorageTotalSupply.eq(BnUtil.ether(10)));

    await CrydrStorageERC20InterfaceJSAPI.approve(storageProxyInstance01.address, ethAccounts.owner,
                                                  ethAccounts.testInvestor1, ethAccounts.testInvestor2, 5 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.isTrue(testInvestor1Balance.eq(BnUtil.ether(7)));
    testInvestor2Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor2Balance.eq(BnUtil.ether(3)));
    testInvestor3Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor3);
    global.assert.strictEqual(testInvestor3Balance.toNumber(), 0);
    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor1to02Allowance.eq(BnUtil.ether(5)));
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.isTrue(crydrStorageTotalSupply.eq(BnUtil.ether(10)));


    // transferFrom

    await CrydrStorageERC20InterfaceJSAPI.transferFrom(storageProxyInstance01.address, ethAccounts.owner,
                                                       ethAccounts.testInvestor2, ethAccounts.testInvestor1, ethAccounts.testInvestor3, 1 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.isTrue(testInvestor1Balance.eq(BnUtil.ether(6)));
    testInvestor2Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor2Balance.eq(BnUtil.ether(3)));
    testInvestor3Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor3);
    global.assert.isTrue(testInvestor3Balance.eq(BnUtil.ether(1)));
    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor1to02Allowance.eq(BnUtil.ether(4)));
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.isTrue(crydrStorageTotalSupply.eq(BnUtil.ether(10)));

    await CrydrStorageERC20InterfaceJSAPI.transferFrom(storageProxyInstance01.address, ethAccounts.owner,
                                                       ethAccounts.testInvestor2, ethAccounts.testInvestor1, ethAccounts.testInvestor3, 2 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.isTrue(testInvestor1Balance.eq(BnUtil.ether(4)));
    testInvestor2Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor2Balance.eq(BnUtil.ether(3)));
    testInvestor3Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor3);
    global.assert.isTrue(testInvestor3Balance.eq(BnUtil.ether(3)));
    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor1to02Allowance.eq(BnUtil.ether(2)));
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.isTrue(crydrStorageTotalSupply.eq(BnUtil.ether(10)));

    await CrydrStorageERC20InterfaceJSAPI.transferFrom(storageProxyInstance01.address, ethAccounts.owner,
                                                       ethAccounts.testInvestor2, ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1 * (10 ** 18));

    testInvestor1Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.isTrue(testInvestor1Balance.eq(BnUtil.ether(3)));
    testInvestor2Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor2Balance.eq(BnUtil.ether(4)));
    testInvestor3Balance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor3);
    global.assert.isTrue(testInvestor3Balance.eq(BnUtil.ether(3)));
    testInvestor1to02Allowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.isTrue(testInvestor1to02Allowance.eq(BnUtil.ether(1)));
    crydrStorageTotalSupply = await crydrStorageInstance.getTotalSupply.call();
    global.assert.isTrue(crydrStorageTotalSupply.eq(BnUtil.ether(10)));
  });

  global.it('should test that ERC20 setters fire events', async () => {
    // set non-zero balance
    await CrydrStorageBalanceInterfaceJSAPI.increaseBalance(storageProxyInstance01.address, ethAccounts.owner,
                                                            ethAccounts.testInvestor1, 10 * (10 ** 18));


    let blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await CrydrStorageERC20InterfaceJSAPI.transfer(storageProxyInstance01.address, ethAccounts.owner,
                                                   ethAccounts.testInvestor1, ethAccounts.testInvestor2, 5 * (10 ** 18));
    const controllerAddress = storageProxyInstance01.address;
    let pastEvents = await CrydrStorageERC20InterfaceJSAPI.getCrydrTransferredEvents(
      crydrStorageInstance.address,
      {
        from: ethAccounts.testInvestor1,
        to:   ethAccounts.testInvestor2,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await CrydrStorageERC20InterfaceJSAPI.approve(storageProxyInstance01.address, ethAccounts.owner,
                                                  ethAccounts.testInvestor1, ethAccounts.testInvestor2, 5 * (10 ** 18));
    pastEvents = await CrydrStorageERC20InterfaceJSAPI.getCrydrSpendingApprovedEvents(
      crydrStorageInstance.address,
      {
        owner:   ethAccounts.testInvestor1,
        spender: ethAccounts.testInvestor2,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await CrydrStorageERC20InterfaceJSAPI.transferFrom(storageProxyInstance01.address, ethAccounts.owner,
                                                       ethAccounts.testInvestor2, ethAccounts.testInvestor1, ethAccounts.testInvestor2, 5 * (10 ** 18));
    pastEvents = await CrydrStorageERC20InterfaceJSAPI.getCrydrTransferredFromEvents(
      crydrStorageInstance.address,
      {
        spender: ethAccounts.testInvestor2,
        from:    ethAccounts.testInvestor1,
        to:      ethAccounts.testInvestor2,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('check that ERC20 setters throw if general conditions not met', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');

    // set non-zero values
    await CrydrStorageBalanceInterfaceJSAPI.increaseBalance(storageProxyInstance01.address, ethAccounts.owner,
                                                            ethAccounts.testInvestor1, 10 * (10 ** 18));
    await CrydrStorageAllowanceInterfaceJSAPI.increaseAllowance(storageProxyInstance01.address, ethAccounts.owner,
                                                                ethAccounts.testInvestor1, ethAccounts.testInvestor2, 10 * (10 ** 18));

    // pause contract
    await PausableInterfaceJSAPI.pauseContract(crydrStorageInstance.address, ethAccounts.managerPause);


    // test that methods throw if contract is paused
    let isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transfer.sendTransaction,
                                                          [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 2 * (10 ** 18), { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transfer should throw if contract is paused');
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.approve.sendTransaction,
                                                      [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 2 * (10 ** 18), { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'approve should throw if contract is paused');
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transferFrom.sendTransaction,
                                                      [
                                                        ethAccounts.testInvestor2,
                                                        ethAccounts.testInvestor1,
                                                        ethAccounts.testInvestor2,
                                                        2 * (10 ** 18),
                                                        { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transferFrom should throw if contract is paused');

    // unpause contract
    await PausableInterfaceJSAPI.unpauseContract(crydrStorageInstance.address, ethAccounts.managerPause);

    // block/unlock
    global.console.log(`\t\tBlock account: ${ethAccounts.testInvestor1}`);
    await CrydrStorageBlocksInterfaceJSAPI.blockAccount(storageProxyInstance01.address, ethAccounts.owner,
                                                        ethAccounts.testInvestor1);
    global.console.log('\t\tCheck that blocked account is not able to spend');
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transfer.sendTransaction,
                                                      [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 2 * (10 ** 18), { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transfer should throw if account is blocked');
    global.console.log('\t\tCheck that blocked account is not able to approve spendings');
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.approve.sendTransaction,
                                                      [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 2 * (10 ** 18), { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'approve should throw if account is blocked');

    global.console.log(`\t\tUnblock account: ${ethAccounts.testInvestor1}`);
    await CrydrStorageBlocksInterfaceJSAPI.unblockAccount(storageProxyInstance01.address, ethAccounts.owner,
                                                          ethAccounts.testInvestor1);
    global.console.log('\t\tApprove spendings');
    await CrydrStorageERC20InterfaceJSAPI.approve(storageProxyInstance01.address, ethAccounts.owner,
                                                  ethAccounts.testInvestor1, ethAccounts.testInvestor2, 2 * (10 ** 18));
    global.console.log(`\t\tBlock account: ${ethAccounts.testInvestor1}`);
    await CrydrStorageBlocksInterfaceJSAPI.blockAccount(storageProxyInstance01.address, ethAccounts.owner,
                                                        ethAccounts.testInvestor1);
    global.console.log('\t\tCheck that nobody can spend on behalf of blocked account');
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transferFrom.sendTransaction,
                                                      [
                                                        ethAccounts.testInvestor2,
                                                        ethAccounts.testInvestor1,
                                                        ethAccounts.testInvestor2,
                                                        2 * (10 ** 18),
                                                        { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transferFrom should throw if account is blocked');

    await CrydrStorageBlocksInterfaceJSAPI.unblockAccount(storageProxyInstance01.address, ethAccounts.owner,
                                                          ethAccounts.testInvestor1);

    await CrydrStorageBlocksInterfaceJSAPI.blockAccountFunds(storageProxyInstance01.address, ethAccounts.owner,
                                                             ethAccounts.testInvestor1, 7 * (10 ** 18));
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transfer.sendTransaction,
                                                      [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 4 * (10 ** 18), { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transfer should throw if funds is blocked');
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transferFrom.sendTransaction,
                                                      [
                                                        ethAccounts.testInvestor2,
                                                        ethAccounts.testInvestor1,
                                                        ethAccounts.testInvestor2,
                                                        4 * (10 ** 18),
                                                        { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transferFrom should throw if funds is blocked');

    // test that only crydr controller is able to invoke setters
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance02.transfer.sendTransaction,
                                                      [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 2 * (10 ** 18), { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transfer should throw if contract is paused');
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance02.approve.sendTransaction,
                                                      [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 2 * (10 ** 18), { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'approve should throw if contract is paused');
    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance02.transferFrom.sendTransaction,
                                                      [
                                                        ethAccounts.testInvestor2,
                                                        ethAccounts.testInvestor1,
                                                        ethAccounts.testInvestor2,
                                                        2 * (10 ** 18),
                                                        { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transferFrom should throw if contract is paused');
  });

  global.it('test that ERC20 setters throw if not enough balance or integer overflow - transfer', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');


    let investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);

    let isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transfer.sendTransaction,
                                                          [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1, { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transfer should throw if not enough balance');

    await CrydrStorageBalanceInterfaceJSAPI.increaseBalance(storageProxyInstance01.address, ethAccounts.owner,
                                                            ethAccounts.testInvestor1, 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);

    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transfer.sendTransaction,
                                                      [ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1001, { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transfer should throw if not enough balance');

    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
  });

  global.it('test that ERC20 setters throw if not enough balance or integer overflow - transferFrom', async () => {
    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address, '0x0000000000000000000000000000000000000000');


    let investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    let investorAllowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    let isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transferFrom.sendTransaction,
                                                          [ethAccounts.testInvestor2, ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1, { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transferFrom should throw if not enough balance');

    await CrydrStorageBalanceInterfaceJSAPI.increaseBalance(storageProxyInstance01.address, ethAccounts.owner,
                                                            ethAccounts.testInvestor1, 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transferFrom.sendTransaction,
                                                      [ethAccounts.testInvestor2, ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1, { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transferFrom should throw if not enough allowance');

    await CrydrStorageAllowanceInterfaceJSAPI.increaseAllowance(storageProxyInstance01.address, ethAccounts.owner,
                                                                ethAccounts.testInvestor1, ethAccounts.testInvestor2, 500);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 500);

    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transferFrom.sendTransaction,
                                                      [ethAccounts.testInvestor2, ethAccounts.testInvestor1, ethAccounts.testInvestor2, 501, { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transferFrom should throw if not enough allowance');

    await CrydrStorageAllowanceInterfaceJSAPI.increaseAllowance(storageProxyInstance01.address, ethAccounts.owner,
                                                                ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 1500);

    isThrows = await CheckExceptions.isContractThrows(storageProxyInstance01.transferFrom.sendTransaction,
                                                      [ethAccounts.testInvestor2, ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1001, { from: ethAccounts.owner }]);
    global.assert.strictEqual(isThrows, true, 'transferFrom should throw if not enough balance');

    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor2);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageInstance.getAllowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.strictEqual(investorAllowance.toNumber(), 1500);
  });
});
