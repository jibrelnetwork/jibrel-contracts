import * as ERC20InterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewERC20/ERC20Interface.jsapi';
import * as CrydrControllerMintableInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerMintable/CrydrControllerMintableInterface.jsapi';
import * as CrydrControllerLicensedERC20JSAPI from '../../../contracts/crydr/controller/CrydrControllerLicensedERC20/CrydrControllerLicensedERC20.jsapi';
import * as JcashRegistrarInterfaceJSAPI from '../../../contracts/jcash/JcashRegistrar/JcashRegistrarInterface.jsapi';

import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as DeployConfig from '../../../jsroutines/jsconfig/DeployConfig';
import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';
import * as migrations from '../../../jsroutines/migrations/index';


global.contract('Integration tests - JcashRegistrar', (accounts) => {
  let JNTControllerAddress;
  let JNTViewERC20Address;
  let JUSDLicenseRegistryAddress;
  let JUSDControllerAddress;
  let JUSDViewERC20Address;
  let JcashRegistrarAddress;

  DeployConfig.setDeployer(undefined);
  DeployConfig.setEthAccounts(accounts);
  const ethAccounts = DeployConfig.getEthAccounts();


  global.beforeEach(async () => {
    const JNTAddresses = await migrations.executeMigration(2);
    const JUSDAddresses = await migrations.executeMigration(3);
    const JEURAddresses = await migrations.executeMigration(4);
    const JGBPAddresses = await migrations.executeMigration(5);
    const JKRWAddresses = await migrations.executeMigration(6);
    const JJODAddresses = await migrations.executeMigration(7);
    JcashRegistrarAddress = await migrations.executeMigration(8, [JNTAddresses[1], JUSDAddresses[1], JEURAddresses[1], JGBPAddresses[1], JKRWAddresses[1], JJODAddresses[1]]);

    JNTControllerAddress = JNTAddresses[1];
    JNTViewERC20Address = JNTAddresses[2];
    JUSDLicenseRegistryAddress = JUSDAddresses[1];
    JUSDControllerAddress = JUSDAddresses[2];
    JUSDViewERC20Address = JUSDAddresses[3];
  });

  global.it('should test replenishment of JcashRegistrar contract with Jcash tokens', async () => {
    global.console.log('\tcheck initial state');
    let accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that managerJcashReplenisher has zero balance');
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, JcashRegistrarAddress);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that JcashRegistrar has zero balance');

    global.console.log('\tmint tokens');
    await CrydrControllerMintableInterfaceJSAPI.mint(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.managerJcashReplenisher,
                                                     10 ** 18);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(accountBalance.toNumber(), 10 ** 18, 'expected that replenisher has 1 JUSD');

    global.console.log('\ttransfer tokens');
    await ERC20InterfaceJSAPI.transfer(JUSDViewERC20Address,
                                       ethAccounts.managerJcashReplenisher,
                                       JcashRegistrarAddress,
                                       10 ** 18);

    global.console.log('\trestore initial state');
    await CrydrControllerMintableInterfaceJSAPI.burn(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     JcashRegistrarAddress,
                                                     10 ** 18);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that managerJcashReplenisher has zero balance');
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, JcashRegistrarAddress);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that JcashRegistrar has zero balance');
  });

  global.it('should test Jcash exchange operation', async () => {
    const tokenValue = 10 ** 20;
    const ethValue = 10 ** 18;
    const jntExchangePrice = 10 ** 18;

    global.console.log('\tcheck initial state');
    let accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that managerJcashReplenisher has zero balance');
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, JcashRegistrarAddress);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that JcashRegistrar has zero balance');

    global.console.log('\tmint tokens');
    await CrydrControllerMintableInterfaceJSAPI.mint(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.managerJcashReplenisher,
                                                     tokenValue);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(accountBalance.toNumber(), tokenValue, 'expected that replenisher has 1 JUSD');

    global.console.log('\ttransfer tokens to the JcashRegistrar contract');
    await ERC20InterfaceJSAPI.transfer(JUSDViewERC20Address,
                                       ethAccounts.managerJcashReplenisher,
                                       JcashRegistrarAddress,
                                       tokenValue);


    global.console.log('\tmint JNT for a new user');
    await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.testInvestor1,
                                                     2 * jntExchangePrice);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);
    global.assert.strictEqual(accountBalance.toNumber(), jntExchangePrice * 2,
                              'expected that a new user has JNT after minting');

    global.console.log('\tgrant token licenses to a new user');
    await CrydrControllerLicensedERC20JSAPI.grantUserLicensesAndAdmit(JUSDLicenseRegistryAddress,
                                                                      ethAccounts.managerLicense,
                                                                      ethAccounts.testInvestor1);


    global.console.log('\tperform exchange ETH -> token');
    global.console.log('\tuser sends ETH to the JcashRegistrar');
    const ethTransferTxHash = await AsyncWeb3.sendTransaction(
      TxConfig.getWeb3(),
      { from: ethAccounts.testInvestor1, to: JcashRegistrarAddress, value: ethValue }
    );
    global.console.log('\tJcash service sends tokens to the user');
    await JcashRegistrarInterfaceJSAPI.transferToken(JcashRegistrarAddress,
                                                     ethAccounts.managerJcashExchange,
                                                     ethTransferTxHash,
                                                     JUSDViewERC20Address,
                                                     ethAccounts.testInvestor1,
                                                     10 ** 19);


    global.console.log('\tperform exchange token -> ETH');
    global.console.log('\tuser sends tokens to the JcashRegistrar');
    const tokenTransferTxHash = await ERC20InterfaceJSAPI.transfer(JUSDViewERC20Address,
                                                                   ethAccounts.testInvestor1,
                                                                   JcashRegistrarAddress,
                                                                   10 ** 19);
    global.console.log('\tJcash service sends ETH to the user');
    await JcashRegistrarInterfaceJSAPI.transferEth(JcashRegistrarAddress,
                                                   ethAccounts.managerJcashExchange,
                                                   tokenTransferTxHash,
                                                   ethAccounts.testInvestor1,
                                                   ethValue);


    global.console.log('\tcheck JNT charges for exchange operations');
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.testInvestor1);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that user has no JNT after 2 exchange operations');
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Address, ethAccounts.jntBeneficiary);
    global.assert.strictEqual(accountBalance.toNumber(), jntExchangePrice * 2,
                              'expected that jnt beneficiary has all JNT after exchange operations finished');


    global.console.log('\trestore initial state');
    await CrydrControllerMintableInterfaceJSAPI.burn(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     JcashRegistrarAddress,
                                                     tokenValue);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that managerJcashReplenisher has zero balance');
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, JcashRegistrarAddress);
    global.assert.strictEqual(accountBalance.toNumber(), 0, 'expected that JcashRegistrar has zero balance');

    await CrydrControllerMintableInterfaceJSAPI.burn(JNTControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.jntBeneficiary,
                                                     jntExchangePrice * 2);
  });
});
