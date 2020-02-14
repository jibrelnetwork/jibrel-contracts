import { BN } from 'bn.js';

import * as CrydrControllerMintableInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerMintable/CrydrControllerMintableInterface.jsapi';
import * as ERC20InterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewERC20/ERC20Interface.jsapi';
import * as CrydrViewERC20MintableInterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewERC20Mintable/CrydrViewERC20MintableInterface.jsapi';

import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';

import * as migrations from '../../../jsroutines/migrations/index';


global.contract('JNT Integration tests', (accounts) => {
  TxConfig.setWeb3(global.web3);
  TxConfig.setDeployer(undefined);
  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();


  let JNTControllerAddress;
  let JNTViewERC20Address;

  global.beforeEach(async () => {
    const JNTAddresses = await migrations.executeMigration(2);

    JNTControllerAddress = JNTAddresses[1];
    JNTViewERC20Address = JNTAddresses[2];
  });

  global.it('should test minting of JNT', async () => {
    const mintedValue = new BN((15 * (10 ** 18)).toString(16), 16);

    const balanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress, ethAccounts.managerMint, ethAccounts.testInvestor1, mintedValue);

    const balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);
    global.console.log('ZZZ', balanceChanged, balanceInitial, mintedValue);
    global.assert.isTrue(balanceChanged.eq(balanceInitial.add(mintedValue)));

    const pastEvents = await CrydrViewERC20MintableInterfaceJSAPI.getMintEvents(
      JNTViewERC20Address,
      {
        owner: ethAccounts.testInvestor1,
        value: mintedValue,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   ethAccounts.testInvestor1,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('should test burning of JNT', async () => {
    const mintedValue = new BN((15 * (10 ** 18)).toString(16), 16);

    const balanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);

    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress, ethAccounts.managerMint, ethAccounts.testInvestor1, mintedValue);

    let balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);
    // global.assert.strictEqual(balanceChanged.toNumber(), balanceInitial.toNumber() + mintedValue);
    global.assert.isTrue(balanceChanged.eq(balanceInitial.add(mintedValue)));

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

    await CrydrControllerMintableInterfaceJSAPI.burn(JNTControllerAddress, ethAccounts.managerMint, ethAccounts.testInvestor1, mintedValue);

    balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);
    // global.assert.strictEqual(balanceChanged.toNumber(), balanceInitial.toNumber());
    global.assert.isTrue(balanceChanged.eq(balanceInitial));

    const pastEvents = await CrydrViewERC20MintableInterfaceJSAPI.getBurnEvents(
      JNTViewERC20Address,
      {
        owner: ethAccounts.testInvestor1,
        value: mintedValue,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   ethAccounts.testInvestor1,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('should test transfers of JNT', async () => {
    const mintedValue = new BN((50 * (10 ** 18)).toString(16), 16);
    const transferredValue = new BN((15 * (10 ** 18)).toString(16), 16);

    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress, ethAccounts.managerMint, ethAccounts.testInvestor1, mintedValue);

    const investor1BalanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);
    const investor2BalanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor2);
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

    await ERC20InterfaceJSAPI.transfer(JNTViewERC20Address,
                                       ethAccounts.testInvestor1, ethAccounts.testInvestor2, transferredValue);

    const investor1BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address,
                                                                        ethAccounts.testInvestor1);
    const investor2BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address,
                                                                        ethAccounts.testInvestor2);
    // global.assert.strictEqual(investor1BalanceChanged.toNumber(),
    //                           investor1BalanceInitial.toNumber() - transferredValue);
    // global.assert.strictEqual(investor2BalanceChanged.toNumber(),
    //                           investor2BalanceInitial.toNumber() + transferredValue);
    global.assert.isTrue(investor1BalanceChanged.eq(investor1BalanceInitial.sub(transferredValue)));
    global.assert.isTrue(investor2BalanceChanged.eq(investor2BalanceInitial.add(transferredValue)));

    const pastEvents = await ERC20InterfaceJSAPI.getTransferEvents(
      JNTViewERC20Address,
      {
        from:  ethAccounts.testInvestor1,
        to:    ethAccounts.testInvestor2,
        value: transferredValue,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   ethAccounts.testInvestor1,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('should test approvals for spendings of JNT', async () => {
    const approvedValue = new BN((15 * (10 ** 18)).toString(16), 16);

    let approvedSpendingInitial = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Address,
                                                                      ethAccounts.testInvestor1, ethAccounts.testInvestor3);
    if (approvedSpendingInitial.toNumber() > 0) {
      await ERC20InterfaceJSAPI.approve(JNTViewERC20Address,
                                        ethAccounts.testInvestor1, ethAccounts.testInvestor3, 0);
      approvedSpendingInitial = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Address,
                                                                    ethAccounts.testInvestor1, ethAccounts.testInvestor3);
    }

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

    await ERC20InterfaceJSAPI.approve(JNTViewERC20Address,
                                      ethAccounts.testInvestor1, ethAccounts.testInvestor3, approvedValue);

    const approvedSpendingChanged = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Address,
                                                                        ethAccounts.testInvestor1, ethAccounts.testInvestor3);
    global.assert.isTrue(approvedSpendingChanged.eq(approvedSpendingInitial.add(approvedValue)));

    const pastEvents = await ERC20InterfaceJSAPI.getApprovalEvents(
      JNTViewERC20Address,
      {
        owner:   ethAccounts.testInvestor1,
        spender: ethAccounts.testInvestor3,
        value:   approvedValue,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   ethAccounts.testInvestor1,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1);
  });

  global.it('should test approved transfers of JNT', async () => {
    const mintedValue = new BN((50 * (10 ** 18)).toString(16), 16);
    const approvedValue = new BN((25 * (10 ** 18)).toString(16), 16);
    const transferredValue = new BN((10 * (10 ** 18)).toString(16), 16);

    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress, ethAccounts.managerMint, ethAccounts.testInvestor1, mintedValue);

    const investor1BalanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);
    const investor2BalanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor2);

    let approvedSpendingInitial = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Address,
                                                                      ethAccounts.testInvestor1, ethAccounts.testInvestor3);
    if (approvedSpendingInitial.toNumber() > 0) {
      await ERC20InterfaceJSAPI.approve(JNTViewERC20Address, ethAccounts.testInvestor1, ethAccounts.testInvestor3, 0);
    }
    await ERC20InterfaceJSAPI.approve(JNTViewERC20Address, ethAccounts.testInvestor1, ethAccounts.testInvestor3, approvedValue);
    approvedSpendingInitial = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Address,
                                                                  ethAccounts.testInvestor1, ethAccounts.testInvestor3);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

    await ERC20InterfaceJSAPI.transferFrom(JNTViewERC20Address,
                                           ethAccounts.testInvestor3, ethAccounts.testInvestor1, ethAccounts.testInvestor2, transferredValue);

    const investor1BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address,
                                                                        ethAccounts.testInvestor1);
    const investor2BalanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address,
                                                                        ethAccounts.testInvestor2);
    const approvedSpendingChanged = await ERC20InterfaceJSAPI.allowance(JNTViewERC20Address,
                                                                        ethAccounts.testInvestor1, ethAccounts.testInvestor3);

    global.assert.isTrue(investor1BalanceChanged.eq(investor1BalanceInitial.sub(transferredValue)));
    global.assert.isTrue(investor2BalanceChanged.eq(investor2BalanceInitial.add(transferredValue)));
    global.assert.isTrue(approvedSpendingChanged.eq(approvedSpendingInitial.sub(transferredValue)));

    const pastEvents = await ERC20InterfaceJSAPI.getTransferEvents(
      JNTViewERC20Address,
      {
        from:  ethAccounts.testInvestor1,
        to:    ethAccounts.testInvestor2,
        value: transferredValue,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   ethAccounts.testInvestor1,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
