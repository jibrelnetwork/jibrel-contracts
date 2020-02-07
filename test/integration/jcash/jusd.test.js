import * as ERC20InterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewERC20/ERC20Interface.jsapi';
import * as CrydrControllerMintableInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerMintable/CrydrControllerMintableInterface.jsapi';
import * as CrydrControllerLicensedERC20JSAPI from '../../../contracts/crydr/controller/CrydrControllerLicensedERC20/CrydrControllerLicensedERC20.jsapi';

import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';

import * as migrations from '../../../jsroutines/migrations/index';

const JUSDViewERC20 = artifacts.require("JUSDViewERC20");


global.contract('Integration tests - JUSD', (accounts) => {
  let JUSDLicenseRegistryAddress;
  let JUSDControllerAddress;
  let JUSDViewERC20Address;

  TxConfig.setDeployer(undefined);
  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();


  global.beforeEach(async () => {
    const JUSDAddresses = await migrations.executeMigration(3);

    JUSDLicenseRegistryAddress = JUSDAddresses[1];
    JUSDControllerAddress = JUSDAddresses[2];
    JUSDViewERC20Address = JUSDAddresses[3];
  });

  global.it('should test minting of the tokens', async () => {
    // check initial state
    let accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor1);
    global.assert.strictEqual(accountBalance.toString(), '0', 'expected that a new user has zero balance');

    // mint tokens
    await CrydrControllerMintableInterfaceJSAPI.mint(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.testInvestor1,
                                                     10 ** 18);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor1);
    global.console.log('AAAAAAAA@!!!!!!', accountBalance, accountBalance.toString());
    global.assert.strictEqual(accountBalance.toString(), (10 ** 18).toString(), 'expected that user has 1 JUSD');

    // burn tokens
    await CrydrControllerMintableInterfaceJSAPI.burn(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.testInvestor1,
                                                     10 ** 17);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor1);
    global.assert.strictEqual(accountBalance.toString(), (9 * (10 ** 17)).toString(), 'expected that user has 0.9 JUSD');

    // restore initial state
    await CrydrControllerMintableInterfaceJSAPI.burn(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.testInvestor1,
                                                     9 * (10 ** 17));
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor1);
    global.assert.strictEqual(accountBalance.toString(), '0', 'expected that user has 0 JUSD');
  });

  global.it('should test that licenses required to perform transactions', async () => {
    // initial config
    let accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor1);
    global.assert.strictEqual(accountBalance.toString(), '0', 'expected that a new user has zero balance');

    await CrydrControllerMintableInterfaceJSAPI.mint(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.testInvestor1,
                                                     10 ** 18);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor1);
    global.console.log('2 AAAAAAAA@!!!!!!', accountBalance, accountBalance.toString());
    global.assert.strictEqual(accountBalance.toString(), (10 ** 18).toString(), 'expected that user has 1 JUSD');


    // check that by default contract throws
    const isThrows = await CheckExceptions.isContractThrows(ERC20InterfaceJSAPI.transfer,
                                                            [JUSDViewERC20Address,
                                                             ethAccounts.testInvestor1,
                                                             ethAccounts.testInvestor2,
                                                             10 ** 10]);

    // global.console.log(isThrows, 'BBBB', await ERC20InterfaceJSAPI.transfer(JUSDViewERC20Address,
    //                                                          ethAccounts.testInvestor1,
    //                                                          ethAccounts.testInvestor2,
    //                                                          10 ** 10));
    const c = await JUSDViewERC20.at(JUSDViewERC20Address);
    await debug(c.transfer(ethAccounts.testInvestor2, 10, { from: ethAccounts.testInvestor1 }));

    global.assert.strictEqual(isThrows, true, 'Should throw without licences');
    // global.assert.throws( async () => await ERC20InterfaceJSAPI.transfer(JUSDViewERC20Address,
    //                                                                      ethAccounts.testInvestor1,
    //                                                                      ethAccounts.testInvestor2,
    //                                                       10 ** 18), 'Should throw without licences');


    // grant licenses
    await CrydrControllerLicensedERC20JSAPI.grantUserLicensesAndAdmit(JUSDLicenseRegistryAddress,
                                                                      ethAccounts.managerLicense,
                                                                      ethAccounts.testInvestor1);

    await CrydrControllerLicensedERC20JSAPI.grantUserLicensesAndAdmit(JUSDLicenseRegistryAddress,
                                                                      ethAccounts.managerLicense,
                                                                      ethAccounts.testInvestor2);


    // check transfer
    await ERC20InterfaceJSAPI.transfer(JUSDViewERC20Address,
                                       ethAccounts.testInvestor1,
                                       ethAccounts.testInvestor2,
                                       10 ** 18);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor1);
    global.assert.strictEqual(accountBalance.toString(), 0, 'expected that user has 0 JUSD');
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor2);
    global.assert.strictEqual(accountBalance.toString(), (10 ** 18).toString(), 'expected that user has 1 JUSD');


    // restore initial state
    await CrydrControllerMintableInterfaceJSAPI.burn(JUSDControllerAddress,
                                                     ethAccounts.managerMint,
                                                     ethAccounts.testInvestor2,
                                                     10 ** 18);
    accountBalance = await ERC20InterfaceJSAPI.balanceOf(JUSDViewERC20Address, ethAccounts.testInvestor2);
    global.assert.strictEqual(accountBalance.toString(), '0', 'expected that user has 0 JUSD');
  });
});
