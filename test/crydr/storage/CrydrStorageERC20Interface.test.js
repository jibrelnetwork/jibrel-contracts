const CrydrStorage = global.artifacts.require('CrydrStorage.sol');

const UtilsTestRoutines           = require('../../../routine/misc/UtilsTest');
const PausableRoutines            = require('../../../routine/lifecycle/Pausable');
const crydrStorageBaseRoutines    = require('../../../routine/crydr/storage/CrydrStorageBaseInterface');
const crydrStorageERC20Routines   = require('../../../routine/crydr/storage/CrydrStorageERC20Interface');
const crydrStorageGeneralRoutines = require('../../../routine/crydr/storage/CrydrStorageGeneral');


global.contract('CrydrStorageERC20Interface', (accounts) => {
  const owner             = accounts[0];
  const manager           = accounts[1];
  const crydrController01 = accounts[2];
  const crydrController02 = accounts[3];
  const investor01        = accounts[4];
  const investor02        = accounts[5];
  const investor03        = accounts[6];

  let crydrStorageContract;

  global.beforeEach(async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });
    await crydrStorageGeneralRoutines.configureCrydrStorage(crydrStorageContract.address, owner, manager,
                                                            crydrController01);
  });


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

    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 10 * (10 ** 18));

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

    await crydrStorageERC20Routines.transfer(crydrStorageContract.address, crydrController01,
                                             investor01, investor02, 2 * (10 ** 18));

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

    await crydrStorageERC20Routines.transfer(crydrStorageContract.address, crydrController01,
                                             investor01, investor02, 1 * (10 ** 18));

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

    await crydrStorageERC20Routines.approve(crydrStorageContract.address, crydrController01,
                                            investor01, investor02, 3 * (10 ** 18));

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

    await crydrStorageERC20Routines.approve(crydrStorageContract.address, crydrController01,
                                            investor01, investor02, 5 * (10 ** 18));

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

    await crydrStorageERC20Routines.transferFrom(crydrStorageContract.address, crydrController01,
                                                 investor02, investor01, investor03, 1 * (10 ** 18));

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

    await crydrStorageERC20Routines.transferFrom(crydrStorageContract.address, crydrController01,
                                                 investor02, investor01, investor03, 2 * (10 ** 18));

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

    await crydrStorageERC20Routines.transferFrom(crydrStorageContract.address, crydrController01,
                                                 investor02, investor01, investor02, 1 * (10 ** 18));

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

  global.it('should test that ERC20 setters fire events', async () => {
    // set non-zero balance
    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 10 * (10 ** 18));


    let blockNumber = global.web3.eth.blockNumber;
    await crydrStorageERC20Routines.transfer(crydrStorageContract.address, crydrController01,
                                             investor01, investor02, 5 * (10 ** 18));
    let pastEvents = await crydrStorageERC20Routines.getCrydrTransferEvents(
      crydrStorageContract.address,
      {
        from: investor01,
        to:   investor02,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   crydrController01,
      });
    global.assert.equal(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageERC20Routines.approve(crydrStorageContract.address, crydrController01,
                                            investor01, investor02, 5 * (10 ** 18));
    pastEvents = await crydrStorageERC20Routines.getCrydrSpendingApprovedEvents(
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
    await crydrStorageERC20Routines.transferFrom(crydrStorageContract.address, crydrController01,
                                                 investor02, investor01, investor02, 5 * (10 ** 18));
    pastEvents = await crydrStorageERC20Routines.getCrydrTransferFromEvents(
      crydrStorageContract.address,
      {
        spender: investor02,
        from:    investor01,
        to:      investor02,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   crydrController01,
      });
    global.assert.equal(pastEvents.length, 1);
  });

  global.it('check that ERC20 setters throw if general conditions not met', async () => {
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
    await PausableRoutines.unpauseContract(crydrStorageContract.address, manager);


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

  global.it('test that ERC20 setters throw if not enough balance or integer overflow - transfer', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);


    let investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 0);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.equal(investorBalance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transfer.sendTransaction,
                                                [investor01, investor02, 1, { from: crydrController01 }],
                                                'transfer should throw if not enough balance');

    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.equal(investorBalance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transfer.sendTransaction,
                                                [investor01, investor02, 1001, { from: crydrController01 }],
                                                'transfer should throw if not enough balance');

    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.equal(investorBalance.toNumber(), 0);
  });

  global.it('test that ERC20 setters throw if not enough balance or integer overflow - transferFrom', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notEqual(crydrStorageContract.address, 0x0);


    let investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 0);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.equal(investorBalance.toNumber(), 0);
    let investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transferFrom.sendTransaction,
                                                [investor02, investor01, investor02, 1, { from: crydrController01 }],
                                                'transferFrom should throw if not enough balance');

    await crydrStorageBaseRoutines.increaseBalance(crydrStorageContract.address, crydrController01,
                                                   investor01, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.equal(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transferFrom.sendTransaction,
                                                [investor02, investor01, investor02, 1, { from: crydrController01 }],
                                                'transferFrom should throw if not enough allowance');

    await crydrStorageBaseRoutines.increaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, 500);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.equal(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 500);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transferFrom.sendTransaction,
                                                [investor02, investor01, investor02, 501, { from: crydrController01 }],
                                                'transferFrom should throw if not enough allowance');

    await crydrStorageBaseRoutines.increaseAllowance(crydrStorageContract.address, crydrController01,
                                                     investor01, investor02, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.equal(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 1500);

    await UtilsTestRoutines.checkContractThrows(crydrStorageContract.transferFrom.sendTransaction,
                                                [investor02, investor01, investor02, 1001, { from: crydrController01 }],
                                                'transferFrom should throw if not enough balance');

    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.equal(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.equal(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.equal(investorAllowance.toNumber(), 1500);
  });
});
