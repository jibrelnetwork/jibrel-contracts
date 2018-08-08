const Migrations = global.artifacts.require('Migrations.sol');
const JNTController = global.artifacts.require('JNTController.sol');
const JNTViewERC20 = global.artifacts.require('JNTViewERC20.sol');

import * as CrydrControllerMintableInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerMintable/CrydrControllerMintableInterface.jsapi';
import * as ERC20InterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewERC20/ERC20Interface.jsapi';
import * as CrydrViewERC20MintableInterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewERC20Mintable/CrydrViewERC20MintableInterface.jsapi';

import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';
import * as DeployConfig from '../../../jsroutines/jsconfig/DeployConfig';

import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';


global.contract('JNT Integration tests', (accounts) => {
  DeployConfig.setAccounts(accounts);
  const { managerMint, testInvestor1, testInvestor2, testInvestor3 } = DeployConfig.getAccounts();

  global.it('should test minting of JNT', async () => {
    const mintedValue = 15 * (10 ** 18);

    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const balanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    const blockNumber = await AsyncWeb3.getBlockNumber();

    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerInstance.address, managerMint, testInvestor1, mintedValue);

    const balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    global.assert.strictEqual(balanceChanged.toNumber(), balanceInitial.toNumber() + mintedValue);

    const pastEvents = await CrydrViewERC20MintableInterfaceJSAPI.getMintEvents(
      JNTViewERC20Instance.address,
      {
        owner: testInvestor1,
        value: mintedValue,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   testInvestor1,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('should test burning of JNT', async () => {
    const mintedValue = 15 * (10 ** 18);

    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const balanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);

    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerInstance.address, managerMint, testInvestor1, mintedValue);

    let balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    global.assert.strictEqual(balanceChanged.toNumber(), balanceInitial.toNumber() + mintedValue);

    const blockNumber = await AsyncWeb3.getBlockNumber();

    await CrydrControllerMintableInterfaceJSAPI.burn(JNTControllerInstance.address, managerMint, testInvestor1, mintedValue);

    balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    global.assert.strictEqual(balanceChanged.toNumber(), balanceInitial.toNumber());

    const pastEvents = await CrydrViewERC20MintableInterfaceJSAPI.getBurnEvents(
      JNTViewERC20Instance.address,
      {
        owner: testInvestor1,
        value: mintedValue,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   testInvestor1,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('should test transfers of JNT', async () => {
    const mintedValue = 50 * (10 ** 18);
    const transferredValue = 15 * (10 ** 18);

    const MigrationsInstance = await Migrations.deployed();
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const lastMigration = await MigrationsInstance.last_completed_migration.call();

    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerInstance.address, managerMint, testInvestor1, mintedValue);

    const investor1BalanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    const investor2BalanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor2);
    const blockNumber = await AsyncWeb3.getBlockNumber();

    if (lastMigration.toNumber() <= 2) {
      global.console.log('    JNT ERC20 view not unpaused yet');

      const isThrows = await CheckExceptions.isContractThrows(
        ERC20InterfaceJSAPI.transfer,
        [JNTViewERC20Instance.address, testInvestor1, testInvestor2, transferredValue]);
      global.assert.strictEqual(isThrows, true, 'Should not be possible to transfer tokens');

      const investor1BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                          testInvestor1);
      const investor2BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                          testInvestor2);
      global.assert.strictEqual(investor1BalanceChanged.toNumber(),
                                investor1BalanceInitial.toNumber());
      global.assert.strictEqual(investor2BalanceChanged.toNumber(),
                                investor2BalanceInitial.toNumber());
    } else {
      global.console.log('    JNT ERC20 view is unpaused');

      await ERC20InterfaceJSAPI.transfer(JNTViewERC20Instance.address,
                                         testInvestor1, testInvestor2, transferredValue);

      const investor1BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                          testInvestor1);
      const investor2BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                          testInvestor2);
      global.assert.strictEqual(investor1BalanceChanged.toNumber(),
                                investor1BalanceInitial.toNumber() - transferredValue);
      global.assert.strictEqual(investor2BalanceChanged.toNumber(),
                                investor2BalanceInitial.toNumber() + transferredValue);

      const pastEvents = await ERC20InterfaceJSAPI.getTransferEvents(
        JNTViewERC20Instance.address,
        {
          from:  testInvestor1,
          to:    testInvestor2,
          value: transferredValue,
        },
        {
          fromBlock: blockNumber + 1,
          toBlock:   blockNumber + 1,
          address:   testInvestor1,
        });
      global.assert.strictEqual(pastEvents.length, 1);
    }
  });

  global.it('should test approvals for spendings of JNT', async () => {
    const approvedValue = 15 * (10 ** 18);

    const MigrationsInstance = await Migrations.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const lastMigration = await MigrationsInstance.last_completed_migration.call();

    let approvedSpendingInitial = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Instance.address,
                                                                      testInvestor1, testInvestor3);
    if (approvedSpendingInitial.toNumber() > 0) {
      await ERC20InterfaceJSAPI.approve(JNTViewERC20Instance.address,
                                        testInvestor1, testInvestor3, 0);
      approvedSpendingInitial = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Instance.address,
                                                                    testInvestor1, testInvestor3);
    }

    const blockNumber = await AsyncWeb3.getBlockNumber();

    if (lastMigration.toNumber() <= 2) {
      global.console.log('    JNT ERC20 view not unpaused yet');

      const isThrows = await CheckExceptions.isContractThrows(
        ERC20InterfaceJSAPI.approve,
        [JNTViewERC20Instance.address, testInvestor1, testInvestor3, approvedValue]);
      global.assert.strictEqual(isThrows, true, 'Should not be possible to approve spendings');

      const approvedSpendingChanged = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Instance.address,
                                                                          testInvestor1, testInvestor3);
      global.assert.strictEqual(approvedSpendingChanged.toNumber(),
                                approvedSpendingInitial.toNumber());
    } else {
      global.console.log('    JNT ERC20 view is unpaused');

      await ERC20InterfaceJSAPI.approve(JNTViewERC20Instance.address,
                                        testInvestor1, testInvestor3, approvedValue);

      const approvedSpendingChanged = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Instance.address,
                                                                          testInvestor1, testInvestor3);
      global.assert.strictEqual(approvedSpendingChanged.toNumber(),
                                approvedSpendingInitial.toNumber() + approvedValue);

      const pastEvents = await ERC20InterfaceJSAPI.getApprovalEvents(
        JNTViewERC20Instance.address,
        {
          owner:   testInvestor1,
          spender: testInvestor3,
          value:   approvedValue,
        },
        {
          fromBlock: blockNumber + 1,
          toBlock:   blockNumber + 1,
          address:   testInvestor1,
        });
      global.assert.strictEqual(pastEvents.length, 1);
    }
  });

  global.it('should test approved transfers of JNT', async () => {
    const mintedValue = 50 * (10 ** 18);
    const approvedValue = 25 * (10 ** 18);
    const transferredValue = 10 * (10 ** 18);

    const MigrationsInstance = await Migrations.deployed();
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const lastMigration = await MigrationsInstance.last_completed_migration.call();
    if (lastMigration.toNumber() <= 2) {
      global.console.log('    JNT ERC20 view not unpaused yet => not possible to approve any spending. Stop test.');
      return;
    }

    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerInstance.address, managerMint, testInvestor1, mintedValue);

    const investor1BalanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    const investor2BalanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor2);

    let approvedSpendingInitial = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Instance.address,
                                                                      testInvestor1, testInvestor3);
    if (approvedSpendingInitial.toNumber() > 0) {
      await ERC20InterfaceJSAPI.approve(JNTViewERC20Instance.address, testInvestor1, testInvestor3, 0);
    }
    await ERC20InterfaceJSAPI.approve(JNTViewERC20Instance.address, testInvestor1, testInvestor3, approvedValue);
    approvedSpendingInitial = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Instance.address,
                                                                  testInvestor1, testInvestor3);

    const blockNumber = await AsyncWeb3.getBlockNumber();

    await ERC20InterfaceJSAPI.transferFrom(JNTViewERC20Instance.address,
                                           testInvestor3, testInvestor1, testInvestor2, transferredValue);

    const investor1BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                        testInvestor1);
    const investor2BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                        testInvestor2);
    const approvedSpendingChanged = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Instance.address,
                                                                        testInvestor1, testInvestor3);

    global.assert.strictEqual(investor1BalanceChanged.toNumber(),
                              investor1BalanceInitial.toNumber() - transferredValue);
    global.assert.strictEqual(investor2BalanceChanged.toNumber(),
                              investor2BalanceInitial.toNumber() + transferredValue);
    global.assert.strictEqual(approvedSpendingChanged.toNumber(),
                              approvedSpendingInitial.toNumber() - transferredValue);

    const pastEvents = await ERC20InterfaceJSAPI.getTransferEvents(
      JNTViewERC20Instance.address,
      {
        from:  testInvestor1,
        to:    testInvestor2,
        value: transferredValue,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   testInvestor1,
      });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
