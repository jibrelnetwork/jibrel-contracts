const CrydrControllerMintableMock = global.artifacts.require('CrydrControllerMintableMock.sol');
const CrydrStorage                = global.artifacts.require('CrydrStorage.sol');
const JCashCrydrViewERC20         = global.artifacts.require('JCashCrydrViewERC20.sol');

const PausableJSAPI = require('../../../jsroutines/jsapi/lifecycle/Pausable');
const CrydrStorageBaseJSAPI = require('../../../jsroutines/jsapi/crydr/storage/CrydrStorageBaseInterface');
const CrydrControllerBaseJSAPI = require('../../../jsroutines/jsapi/crydr/controller/CrydrControllerBaseInterface');
const CrydrControllerMintableJSAPI = require('../../../jsroutines/jsapi/crydr/controller/CrydrControllerMintableInterface');

const DeployConfig = require('../../../jsroutines/jsconfig/DeployConfig');
const CrydrInit = require('../../../jsroutines/jsinit/CrydrInit');

const CheckExceptions = require('../../../jsroutines/util/CheckExceptions');


global.contract('CrydrControllerMintable', (accounts) => {
  let crydrControllerMintableInstance;
  let crydrStorageInstance;
  let jcashCrydrViewERC20Instance;

  DeployConfig.setAccounts(accounts);
  const { owner, managerPause, managerMint, testInvestor1 } = DeployConfig.getAccounts();

  const viewStandard = 'erc20';
  const viewName = 'viewName';
  const viewSymbol = 'viewSymbol';
  const viewDecimals = 18;
  const assetID = 'jASSET';

  global.beforeEach(async () => {
    crydrControllerMintableInstance = await CrydrControllerMintableMock.new(assetID, { from: owner });
    crydrStorageInstance = await CrydrStorage.new(assetID, { from: owner });
    jcashCrydrViewERC20Instance = await JCashCrydrViewERC20.new(assetID, viewName, viewSymbol, viewDecimals,
                                                                { from: owner });

    global.console.log('\tContracts deployed for tests CrydrControllerMintable:');
    global.console.log(`\t\tcrydrControllerMintableInstance: ${crydrControllerMintableInstance.address}`);
    global.console.log(`\t\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.console.log(`\t\tjcashCrydrViewERC20Instance: ${jcashCrydrViewERC20Instance.address}`);

    await CrydrInit.configureCrydr(crydrStorageInstance.address,
                                   crydrControllerMintableInstance.address,
                                   jcashCrydrViewERC20Instance.address,
                                   viewStandard);
  });

  global.it('should test that contract allows to mint tokens', async () => {
    global.console.log(`\tcrydrControllerMintable address: ${crydrControllerMintableInstance.address}`);
    global.assert.notStrictEqual(crydrControllerMintableInstance.address,
                                 '0x0000000000000000000000000000000000000000');

    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address,
                                 '0x0000000000000000000000000000000000000000');

    global.console.log(`\tjcashCrydrViewERC20Instance: ${jcashCrydrViewERC20Instance.address}`);
    global.assert.notStrictEqual(jcashCrydrViewERC20Instance.address,
                                 '0x0000000000000000000000000000000000000000');

    const isPaused = await PausableJSAPI.getPaused(crydrControllerMintableInstance.address);
    global.assert.strictEqual(isPaused, true,
                              'Just configured crydrControllerMintable contract must be paused');

    const storageAddress = await CrydrControllerBaseJSAPI
      .getCrydrStorageAddress(crydrControllerMintableInstance.address);
    global.assert.strictEqual(storageAddress, crydrStorageInstance.address,
                              'Just configured crydrControllerMintable should have initialized crydrStorage address');

    const viewAddress = await CrydrControllerBaseJSAPI
      .getCrydrViewAddress(crydrControllerMintableInstance.address, viewStandard);
    global.assert.strictEqual(viewAddress, jcashCrydrViewERC20Instance.address,
                              'Expected that crydrView is set');

    const initialBalance = await crydrStorageInstance.getBalance.call(testInvestor1);
    global.assert.strictEqual(initialBalance.toNumber(), 0,
                              'Expected that initial balance is 0');


    await PausableJSAPI.unpauseContract(crydrStorageInstance.address, managerPause);
    await PausableJSAPI.unpauseContract(crydrControllerMintableInstance.address, managerPause);
    await PausableJSAPI.unpauseContract(jcashCrydrViewERC20Instance.address, managerPause);


    await CrydrControllerMintableJSAPI.mint(crydrControllerMintableInstance.address, managerMint,
                                            testInvestor1, 10 * (10 ** 18));
    let balance = await CrydrStorageBaseJSAPI.getBalance(crydrStorageInstance.address, testInvestor1);
    global.assert.strictEqual(balance.toNumber(), 10 * (10 ** 18),
                              'Expected that balance has increased');

    await CrydrControllerMintableJSAPI.burn(crydrControllerMintableInstance.address, managerMint,
                                            testInvestor1, 5 * (10 ** 18));
    balance = await CrydrStorageBaseJSAPI.getBalance(crydrStorageInstance.address, testInvestor1);
    global.assert.strictEqual(balance.toNumber(), 5 * (10 ** 18),
                              'Expected that balance has decreased');
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    global.console.log(`\tcrydrControllerMintableInstance: ${crydrControllerMintableInstance.address}`);
    global.assert.notStrictEqual(crydrControllerMintableInstance.address,
                                 '0x0000000000000000000000000000000000000000');

    global.console.log(`\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.assert.notStrictEqual(crydrStorageInstance.address,
                                 '0x0000000000000000000000000000000000000000');

    global.console.log(`\tjcashCrydrViewERC20Instance: ${jcashCrydrViewERC20Instance.address}`);
    global.assert.notStrictEqual(jcashCrydrViewERC20Instance.address,
                                 '0x0000000000000000000000000000000000000000');

    const isPaused = await crydrControllerMintableInstance.getPaused.call();
    global.assert.strictEqual(isPaused, true,
                              'Just configured crydrControllerBase contract must be paused');


    await CheckExceptions.checkContractThrows(crydrControllerMintableInstance.mint.sendTransaction,
                                              [0x0, 100 * (10 ** 18), { from: managerMint }],
                                              'Should be a valid account address');

    await CheckExceptions.checkContractThrows(crydrControllerMintableInstance.mint.sendTransaction,
                                              [testInvestor1, 0, { from: managerMint }],
                                              'Should be a positive value');

    await CheckExceptions.checkContractThrows(crydrControllerMintableInstance.mint.sendTransaction,
                                              [testInvestor1, 100 * (10 ** 18), { from: managerMint }],
                                              'Only manager should be able to mint');

    await CheckExceptions.checkContractThrows(crydrControllerMintableInstance.burn.sendTransaction,
                                              [0x0, 100 * (10 ** 18), { from: managerMint }],
                                              'Should be a valid account address');

    await CheckExceptions.checkContractThrows(crydrControllerMintableInstance.burn.sendTransaction,
                                              [testInvestor1, 0, { from: managerMint }],
                                              'Should be a positive value');

    await CheckExceptions.checkContractThrows(crydrControllerMintableInstance.burn.sendTransaction,
                                              [testInvestor1, 100 * (10 ** 18), { from: testInvestor1 }],
                                              'Only manager should be able to burn');
  });
});
