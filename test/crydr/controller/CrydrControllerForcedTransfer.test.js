import * as PausableInterfaceJSAPI from '../../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as CrydrStorageBalanceInterfaceJSAPI from '../../../contracts/crydr/storage/CrydrStorageBalance/CrydrStorageBalanceInterface.jsapi';
import * as CrydrControllerBaseInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerBase/CrydrControllerBaseInterface.jsapi';
import * as CrydrControllerMintableInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerMintable/CrydrControllerMintableInterface.jsapi';
import * as CrydrControllerForcedTransferInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerForcedTransfer/CrydrControllerForcedTransferInterface.jsapi';

import * as DeployConfig from '../../../jsroutines/jsconfig/DeployConfig';
import * as CrydrStorageInit from '../../../jsroutines/jsinit/CrydrStorageInit';
import * as CrydrControllerInit from '../../../jsroutines/jsinit/CrydrControllerInit';
import * as CrydrViewInit from '../../../jsroutines/jsinit/CrydrViewInit';
import * as CrydrInit from '../../../jsroutines/jsinit/CrydrInit';

const CrydrControllerForcedTransferMock = global.artifacts.require('CrydrControllerForcedTransferMock.sol');
const JCashCrydrStorage = global.artifacts.require('JCashCrydrStorage.sol');
const JCashCrydrViewERC20 = global.artifacts.require('JCashCrydrViewERC20.sol');


global.contract('CrydrControllerForcedTransfer', (accounts) => {
  let crydrControllerInstance;
  let crydrStorageInstance;
  let jcashCrydrViewERC20Instance;

  DeployConfig.setEthAccounts(accounts);
  const ethAccounts = DeployConfig.getEthAccounts();

  const viewStandard = 'erc20';
  const viewName = 'viewName';
  const viewSymbol = 'viewSymbol';
  const viewDecimals = 18;
  const assetID = 'jASSET';

  global.beforeEach(async () => {
    crydrControllerInstance = await CrydrControllerForcedTransferMock.new(assetID, { from: ethAccounts.owner });
    crydrStorageInstance = await JCashCrydrStorage.new(assetID, { from: ethAccounts.owner });
    jcashCrydrViewERC20Instance = await JCashCrydrViewERC20.new(assetID, viewName, viewSymbol, viewDecimals,
                                                                { from: ethAccounts.owner });

    const crydrStorageAddress = crydrStorageInstance.address;
    const crydrControllerAddress = crydrControllerInstance.address;
    const crydrViewAddress = jcashCrydrViewERC20Instance.address;

    global.console.log('\tContracts deployed for tests CrydrControllerMintable:');
    global.console.log(`\t\tcrydrControllerInstance: ${crydrControllerInstance.address}`);
    global.console.log(`\t\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.console.log(`\t\tjcashCrydrViewERC20Instance: ${jcashCrydrViewERC20Instance.address}`);

    global.console.log('\tConfiguring crydr managers');
    await CrydrStorageInit.configureCrydrStorageManagers(crydrStorageAddress, ethAccounts);
    await CrydrControllerInit.configureCrydrControllerManagers(crydrControllerAddress, ethAccounts);
    await CrydrViewInit.configureCrydrViewManagers(crydrViewAddress, ethAccounts);
    global.console.log('\tCrydr managers successfully configured');

    global.console.log('\tLink crydr contracts');
    await CrydrInit.linkCrydrStorage(crydrStorageAddress, crydrControllerAddress, ethAccounts);
    await CrydrInit.linkCrydrView(crydrControllerAddress, crydrViewAddress, 'erc20', ethAccounts);
    global.console.log('\tCrydr contracts successfully linked');


    /* Verify setup */

    global.console.log(`\tcrydrController address: ${crydrControllerInstance.address}`);
    global.assert.notStrictEqual(crydrControllerInstance.address,
                                 '0x0000000000000000000000000000000000000000');

    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address,
                                 '0x0000000000000000000000000000000000000000');

    global.console.log(`\tjcashCrydrViewERC20Instance: ${jcashCrydrViewERC20Instance.address}`);
    global.assert.notStrictEqual(jcashCrydrViewERC20Instance.address,
                                 '0x0000000000000000000000000000000000000000');

    const isPaused = await PausableInterfaceJSAPI.getPaused(crydrControllerInstance.address);
    global.assert.strictEqual(isPaused, true,
                              'Just configured crydrControllerMintable contract must be paused');

    const storageAddress = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrStorageAddress(crydrControllerInstance.address);
    global.assert.strictEqual(storageAddress, crydrStorageInstance.address,
                              'Just configured crydrControllerMintable should have initialized crydrStorage address');

    const viewAddress = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrViewAddress(crydrControllerInstance.address, viewStandard);
    global.assert.strictEqual(viewAddress, jcashCrydrViewERC20Instance.address,
                              'Expected that crydrView is set');

    const initialBalance = await crydrStorageInstance.getBalance.call(ethAccounts.testInvestor1);
    global.assert.strictEqual(initialBalance.toNumber(), 0,
                              'Expected that initial balance is 0');
  });

  global.it('should test that contract allows to transfer tokens by a manager', async () => {
    await PausableInterfaceJSAPI.unpauseContract(crydrStorageInstance.address, ethAccounts.managerPause);
    await PausableInterfaceJSAPI.unpauseContract(crydrControllerInstance.address, ethAccounts.managerPause);
    await PausableInterfaceJSAPI.unpauseContract(jcashCrydrViewERC20Instance.address, ethAccounts.managerPause);


    await CrydrControllerMintableInterfaceJSAPI.mint(crydrControllerInstance.address, ethAccounts.managerMint,
                                                     ethAccounts.testInvestor1, 10 * (10 ** 18));
    let balance = await CrydrStorageBalanceInterfaceJSAPI.getBalance(crydrStorageInstance.address, ethAccounts.testInvestor1);
    global.assert.strictEqual(balance.toNumber(), 10 * (10 ** 18),
                              'Expected that balance has increased');

    await CrydrControllerForcedTransferInterfaceJSAPI.forcedTransfer(crydrControllerInstance.address, ethAccounts.managerForcedTransfer,
                                                                     ethAccounts.testInvestor1, ethAccounts.testInvestor2, 1 * (10 ** 18));

    balance = await CrydrStorageBalanceInterfaceJSAPI.getBalance(crydrStorageInstance.address, ethAccounts.testInvestor1);
    global.assert.strictEqual(balance.toNumber(), 9 * (10 ** 18),
                              'Expected that balance has reduced due to forced transfer');
    balance = await CrydrStorageBalanceInterfaceJSAPI.getBalance(crydrStorageInstance.address, ethAccounts.testInvestor2);
    global.assert.strictEqual(balance.toNumber(), 1 * (10 ** 18),
                              'Expected that balance has increased due to forced transfer');
  });
  //
  // global.it('should test that functions throw if general conditions are not met', async () => {
  //   global.console.log(`\tcrydrControllerInstance: ${crydrControllerInstance.address}`);
  //   global.assert.notStrictEqual(crydrControllerInstance.address,
  //                                '0x0000000000000000000000000000000000000000');
  //
  //   global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
  //   global.assert.notStrictEqual(crydrStorageInstance.address,
  //                                '0x0000000000000000000000000000000000000000');
  //
  //   global.console.log(`\tjcashCrydrViewERC20Instance: ${jcashCrydrViewERC20Instance.address}`);
  //   global.assert.notStrictEqual(jcashCrydrViewERC20Instance.address,
  //                                '0x0000000000000000000000000000000000000000');
  //
  //   const isPaused = await crydrControllerInstance.getPaused.call();
  //   global.assert.strictEqual(isPaused, true,
  //                             'Just configured crydrControllerBase contract must be paused');
  //
  //
  //   let isThrows = await CheckExceptions.isContractThrows(crydrControllerInstance.mint.sendTransaction,
  //                                                         [0x0, 100 * (10 ** 18), { from: managerMint }]);
  //   global.assert.strictEqual(isThrows, true, 'Should be a valid account address');
  //
  //   isThrows = await CheckExceptions.isContractThrows(crydrControllerInstance.mint.sendTransaction,
  //                                                     [ethAccounts.testInvestor1, 0, { from: managerMint }]);
  //   global.assert.strictEqual(isThrows, true, 'Should be a positive value');
  //
  //   isThrows = await CheckExceptions.isContractThrows(crydrControllerInstance.mint.sendTransaction,
  //                                                     [ethAccounts.testInvestor1, 100 * (10 ** 18), { from: managerMint }]);
  //   global.assert.strictEqual(isThrows, true, 'Only manager should be able to mint');
  //
  //   isThrows = await CheckExceptions.isContractThrows(crydrControllerInstance.burn.sendTransaction,
  //                                                     [0x0, 100 * (10 ** 18), { from: managerMint }]);
  //   global.assert.strictEqual(isThrows, true, 'Should be a valid account address');
  //
  //   isThrows = await CheckExceptions.isContractThrows(crydrControllerInstance.burn.sendTransaction,
  //                                                     [ethAccounts.testInvestor1, 0, { from: managerMint }]);
  //   global.assert.strictEqual(isThrows, true, 'Should be a positive value');
  //
  //   isThrows = await CheckExceptions.isContractThrows(crydrControllerInstance.burn.sendTransaction,
  //                                                     [ethAccounts.testInvestor1, 100 * (10 ** 18), { from: ethAccounts.testInvestor1 }]);
  //   global.assert.strictEqual(isThrows, true, 'Only manager should be able to burn');
  // });
});
