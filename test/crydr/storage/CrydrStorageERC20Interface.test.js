const CrydrStorage = global.artifacts.require('CrydrStorage.sol');
const CrydrController = global.artifacts.require('CrydrControllerMock.sol');

const UtilsTestRoutines           = require('../../../routine/misc/UtilsTest');
const PausableRoutines            = require('../../../routine/lifecycle/Pausable');
const crydrStorageBaseRoutines    = require('../../../routine/crydr/storage/CrydrStorageBaseInterface');
const crydrStorageERC20Routines   = require('../../../routine/crydr/storage/CrydrStorageERC20Interface');
const crydrStorageGeneralRoutines = require('../../../routine/crydr/storage/CrydrStorageGeneral');


global.contract('CrydrStorageERC20Interface', (accounts) => {
  const owner             = accounts[0];
  const manager           = accounts[1];
  const investor01        = accounts[2];
  const investor02        = accounts[3];
  const investor03        = accounts[4];

  let crydrStorageContract;
  let crydrControllerContract01;
  let crydrControllerContract02;

  global.beforeEach(async () => {
    crydrStorageContract = await CrydrStorage.new({ from: owner });
    crydrControllerContract01 = await CrydrController.new(crydrStorageContract.address, { from: owner });
    crydrControllerContract02 = await CrydrController.new(crydrStorageContract.address, { from: owner });
    await crydrStorageGeneralRoutines.configureCrydrStorage(crydrStorageContract.address, owner, manager,
                                                            crydrControllerContract01.address);
  });


  global.it('check that ERC20 setters work as expected', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');


    // set non-zero balances

    let investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 0);
    let investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 0);
    let investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 0);
    let investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 0);
    let crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 0);

    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 10 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 10 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 0);
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // transfer

    await crydrStorageERC20Routines.transfer(crydrControllerContract01.address, owner,
                                             investor01, investor02, 2 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 8 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 2 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageERC20Routines.transfer(crydrControllerContract01.address, owner,
                                             investor01, investor02, 1 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 7 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 0);
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // approve

    await crydrStorageERC20Routines.approve(crydrControllerContract01.address, owner,
                                            investor01, investor02, 3 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 7 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 3 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageERC20Routines.approve(crydrControllerContract01.address, owner,
                                            investor01, investor02, 5 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 7 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 0);
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 5 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));


    // transferFrom

    await crydrStorageERC20Routines.transferFrom(crydrControllerContract01.address, owner,
                                                 investor02, investor01, investor03, 1 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 6 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 1 * (10 ** 18));
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 4 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageERC20Routines.transferFrom(crydrControllerContract01.address, owner,
                                                 investor02, investor01, investor03, 2 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 4 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 3 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 3 * (10 ** 18));
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 2 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));

    await crydrStorageERC20Routines.transferFrom(crydrControllerContract01.address, owner,
                                                 investor02, investor01, investor02, 1 * (10 ** 18));

    investor01Balance = await crydrStorageContract.getBalance.call(investor01);
    global.assert.strictEqual(investor01Balance.toNumber(), 3 * (10 ** 18));
    investor02Balance = await crydrStorageContract.getBalance.call(investor02);
    global.assert.strictEqual(investor02Balance.toNumber(), 4 * (10 ** 18));
    investor03Balance = await crydrStorageContract.getBalance.call(investor03);
    global.assert.strictEqual(investor03Balance.toNumber(), 3 * (10 ** 18));
    investor01to02Allowance = await crydrStorageContract.getAllowance.call(investor01, investor02);
    global.assert.strictEqual(investor01to02Allowance.toNumber(), 1 * (10 ** 18));
    crydrStorageTotalSupply = await crydrStorageContract.getTotalSupply.call();
    global.assert.strictEqual(crydrStorageTotalSupply.toNumber(), 10 * (10 ** 18));
  });

  global.it('should test that ERC20 setters fire events', async () => {
    // set non-zero balance
    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 10 * (10 ** 18));


    let blockNumber = global.web3.eth.blockNumber;
    await crydrStorageERC20Routines.transfer(crydrControllerContract01.address, owner,
                                             investor01, investor02, 5 * (10 ** 18));
    const controllerAddress = crydrControllerContract01.address;
    let pastEvents = await crydrStorageERC20Routines.getCrydrTransferEvents(
      crydrStorageContract.address,
      {
        from: investor01,
        to:   investor02,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageERC20Routines.approve(crydrControllerContract01.address, owner,
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
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await crydrStorageERC20Routines.transferFrom(crydrControllerContract01.address, owner,
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
        address:   controllerAddress,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('check that ERC20 setters throw if general conditions not met', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');

    // set non-zero values
    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 10 * (10 ** 18));
    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, 10 * (10 ** 18));

    // pause contract
    await PausableRoutines.pauseContract(crydrStorageContract.address, manager);


    // test that methods throw if contract is paused
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: owner }],
                                                'transfer should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.approve.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: owner }],
                                                'approve should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                                [
                                                  investor02,
                                                  investor01,
                                                  investor02,
                                                  2 * (10 ** 18),
                                                  { from: owner }],
                                                'transferFrom should throw if contract is paused');

    // unpause contract
    await PausableRoutines.unpauseContract(crydrStorageContract.address, manager);

    // block/unlock
    await crydrStorageBaseRoutines.blockAccount(crydrControllerContract01.address, owner,
                                                investor01);
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: owner }],
                                                'transfer should throw if account is blocked');
    await crydrStorageERC20Routines.approve(crydrControllerContract01.address, owner,
                                            investor01, investor02, 2 * (10 ** 18));
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                                [
                                                  investor02,
                                                  investor01,
                                                  investor02,
                                                  2 * (10 ** 18),
                                                  { from: owner }],
                                                'transferFrom should throw if account is blocked');

    await crydrStorageBaseRoutines.unlockAccount(crydrControllerContract01.address, owner,
                                                 investor01);

    await crydrStorageBaseRoutines.blockFunds(crydrControllerContract01.address, owner,
                                              investor01, 7 * (10 ** 18));
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                                [investor01, investor02, 4 * (10 ** 18), { from: owner }],
                                                'transfer should throw if funds is blocked');
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                                [
                                                  investor02,
                                                  investor01,
                                                  investor02,
                                                  4 * (10 ** 18),
                                                  { from: owner }],
                                                'transferFrom should throw if funds is blocked');

    // test that only crydr controller is able to invoke setters
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract02.transfer.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: owner }],
                                                'transfer should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract02.approve.sendTransaction,
                                                [investor01, investor02, 2 * (10 ** 18), { from: owner }],
                                                'approve should throw if contract is paused');
    await UtilsTestRoutines.checkContractThrows(crydrControllerContract02.transferFrom.sendTransaction,
                                                [
                                                  investor02,
                                                  investor01,
                                                  investor02,
                                                  2 * (10 ** 18),
                                                  { from: owner }],
                                                'transferFrom should throw if contract is paused');
  });

  global.it('test that ERC20 setters throw if not enough balance or integer overflow - transfer', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');


    let investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.strictEqual(investorBalance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                                [investor01, investor02, 1, { from: owner }],
                                                'transfer should throw if not enough balance');

    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.strictEqual(investorBalance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transfer.sendTransaction,
                                                [investor01, investor02, 1001, { from: owner }],
                                                'transfer should throw if not enough balance');

    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
  });

  global.it('test that ERC20 setters throw if not enough balance or integer overflow - transferFrom', async () => {
    global.console.log(`\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.assert.notStrictEqual(crydrStorageContract.address, '0x0000000000000000000000000000000000000000');


    let investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    let investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                                [investor02, investor01, investor02, 1, { from: owner }],
                                                'transferFrom should throw if not enough balance');

    await crydrStorageBaseRoutines.increaseBalance(crydrControllerContract01.address, owner,
                                                   investor01, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 0);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                                [investor02, investor01, investor02, 1, { from: owner }],
                                                'transferFrom should throw if not enough allowance');

    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, 500);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 500);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                                [investor02, investor01, investor02, 501, { from: owner }],
                                                'transferFrom should throw if not enough allowance');

    await crydrStorageBaseRoutines.increaseAllowance(crydrControllerContract01.address, owner,
                                                     investor01, investor02, 1000);
    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 1500);

    await UtilsTestRoutines.checkContractThrows(crydrControllerContract01.transferFrom.sendTransaction,
                                                [investor02, investor01, investor02, 1001, { from: owner }],
                                                'transferFrom should throw if not enough balance');

    investorBalance = await crydrStorageContract.getBalance(investor01);
    global.assert.strictEqual(investorBalance.toNumber(), 1000);
    investorBalance = await crydrStorageContract.getBalance(investor02);
    global.assert.strictEqual(investorBalance.toNumber(), 0);
    investorAllowance = await crydrStorageContract.getAllowance(investor01, investor02);
    global.assert.strictEqual(investorAllowance.toNumber(), 1500);
  });
});
