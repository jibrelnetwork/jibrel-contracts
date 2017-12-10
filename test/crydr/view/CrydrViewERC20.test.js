const CrydrControllerERC20Stub    = global.artifacts.require('CrydrControllerERC20Stub.sol');
const JCashCrydrViewERC20 = global.artifacts.require('JCashCrydrViewERC20.sol');

const PausableJSAPI = require('../../../jsroutines/jsapi/lifecycle/Pausable');
const CrydrViewBaseJSAPI = require('../../../jsroutines/jsapi/crydr/view/CrydrViewBaseInterface');
const CrydrViewERC20JSAPI = require('../../../jsroutines/jsapi/crydr/view/ERC20Interface');
const CrydrViewERC20LoggableJSAPI = require('../../../jsroutines/jsapi/crydr/view/ERC20LoggableInterface');

const PausableTestSuite = require('../../../jsroutines/test_suit/lifecycle/Pausable');

const DeployConfig = require('../../../jsroutines/jsconfig/DeployConfig');
const CrydrViewInit = require('../../../jsroutines/jsinit/CrydrViewInit');

const CheckExceptions = require('../../../jsroutines/util/CheckExceptions');


global.contract('CrydrViewERC20', (accounts) => {
  let jcashCrydrViewERC20Instance;
  let controllerStubInstance;


  DeployConfig.setAccounts(accounts);
  const { owner, managerGeneral, managerPause, testInvestor1, testInvestor2 } = DeployConfig.getAccounts();

  const originalName = 'testName';
  const originalSymbol = 'testSymbol';
  const originalDecimals = 18;
  const originalNameHash = '0x698c8efcda9e563cf153563941b60fc5ac88336fc58d361eb0888686fadb9976';
  const originalSymbolHash = '0x6a2f03a1dba5e9dbeb18b55ac2076e1af9f5f2b7411cb1dbef111c70934e1686';

  const assetID = 'jASSET';


  global.beforeEach(async () => {
    jcashCrydrViewERC20Instance = await JCashCrydrViewERC20.new(assetID,
                                                                originalName,
                                                                originalSymbol,
                                                                originalDecimals,
                                                                { from: owner });
    controllerStubInstance = await CrydrControllerERC20Stub.new(assetID,
                                                                jcashCrydrViewERC20Instance.address,
                                                                { from: owner });

    global.console.log('\tContracts deployed for tests CrydrViewBase:');
    global.console.log(`\t\tjcashCrydrViewERC20Instance: ${jcashCrydrViewERC20Instance.address}`);
    global.console.log(`\t\tcontrollerStubInstance: ${controllerStubInstance}`);

    global.console.log('\tStart to configure test contracts:');
    await CrydrViewInit.configureCrydrViewManagers(jcashCrydrViewERC20Instance.address);
    await CrydrViewBaseJSAPI.setCrydrController(jcashCrydrViewERC20Instance.address,
                                                managerGeneral,
                                                controllerStubInstance.address);
    await PausableJSAPI.unpauseContract(jcashCrydrViewERC20Instance.address, managerPause);


    global.console.log('\tStart to verify configuration of test contracts:');
    const controllerAddress = await CrydrViewBaseJSAPI.getCrydrController(jcashCrydrViewERC20Instance.address);
    global.assert.strictEqual(controllerAddress, controllerStubInstance.address,
                              'Expected that view configured properly');
    const isPaused = await PausableJSAPI.getPaused(jcashCrydrViewERC20Instance.address);
    global.assert.strictEqual(isPaused, false, 'Expected that contract is paused');
  });

  global.it('should test that contract works as expected', async () => {
    const contractName = await jcashCrydrViewERC20Instance.name.call();
    global.assert.strictEqual(contractName, originalName);

    const contractSymbol = await jcashCrydrViewERC20Instance.symbol.call();
    global.assert.strictEqual(contractSymbol, originalSymbol);

    const contractDecimals = await jcashCrydrViewERC20Instance.decimals.call();
    global.assert.strictEqual(contractDecimals.toNumber(), originalDecimals);


    const contractNameHash = await jcashCrydrViewERC20Instance.getNameHash.call();
    global.assert.strictEqual(contractNameHash, originalNameHash);

    const contractSymbolHash = await jcashCrydrViewERC20Instance.getSymbolHash.call();
    global.assert.strictEqual(contractSymbolHash, originalSymbolHash);


    await CrydrViewERC20JSAPI.transfer(jcashCrydrViewERC20Instance.address, testInvestor1,
                                       testInvestor1, 10 * (10 ** 18));
    const transferCounter = await controllerStubInstance.transferCounter.call();
    global.assert.strictEqual(transferCounter.toNumber(), 1);

    await CrydrViewERC20JSAPI.approve(jcashCrydrViewERC20Instance.address, testInvestor1,
                                      testInvestor1, 10 * (10 ** 18));
    const approveCounter = await controllerStubInstance.approveCounter.call();
    global.assert.strictEqual(approveCounter.toNumber(), 1);

    await CrydrViewERC20JSAPI.transferFrom(jcashCrydrViewERC20Instance.address, testInvestor1,
                                           testInvestor1, testInvestor2, 10 * (10 ** 18));
    const transferFromCounter = await controllerStubInstance.transferFromCounter.call();
    global.assert.strictEqual(transferFromCounter.toNumber(), 1);

    const totalSupply = await jcashCrydrViewERC20Instance.totalSupply.call();
    global.assert.strictEqual(totalSupply.toNumber(), 60 * (10 ** 18));

    const balanceOf = await jcashCrydrViewERC20Instance.balanceOf.call(testInvestor1);
    global.assert.strictEqual(balanceOf.toNumber(), 40 * (10 ** 18));

    const allowance = await jcashCrydrViewERC20Instance.allowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(allowance.toNumber(), 20 * (10 ** 18));
  });

  global.it('should test that functions covered by pause modifiers', async () => {
    PausableJSAPI.pauseContract(jcashCrydrViewERC20Instance.address, managerPause);

    await PausableTestSuite
      .assertWhenContractNotPaused(jcashCrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20JSAPI.transfer,
                                   [jcashCrydrViewERC20Instance.address, testInvestor1,
                                    testInvestor2, 10 * (10 ** 18)]);
    await PausableTestSuite
      .assertWhenContractNotPaused(jcashCrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20JSAPI.approve,
                                   [jcashCrydrViewERC20Instance.address, testInvestor1,
                                    testInvestor2, 10 * (10 ** 18)]);
    await PausableTestSuite
      .assertWhenContractNotPaused(jcashCrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20JSAPI.transferFrom,
                                   [jcashCrydrViewERC20Instance.address, testInvestor1,
                                    testInvestor1, testInvestor2, 10 * (10 ** 18)]);

    await PausableTestSuite
      .assertWhenContractNotPaused(jcashCrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20LoggableJSAPI.emitTransferEvent,
                                   [controllerStubInstance.address, testInvestor1,
                                    testInvestor1, testInvestor2, 10 * (10 ** 18)]);
    await PausableTestSuite
      .assertWhenContractNotPaused(jcashCrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20LoggableJSAPI.emitApprovalEvent,
                                   [controllerStubInstance.address, testInvestor1,
                                    testInvestor1, testInvestor2, 10 * (10 ** 18)]);
  });

  global.it('should test that only controller is allowed to emit events', async () => {
    // direct call to the view, not through the controller
    await CheckExceptions
      .checkContractThrows(CrydrViewERC20LoggableJSAPI.emitTransferEvent,
                           [jcashCrydrViewERC20Instance.address, testInvestor1,
                            testInvestor1, testInvestor2, 10 * (10 ** 18)],
                           'Only CrydrController can emit transfer event');
    await CheckExceptions
      .checkContractThrows(CrydrViewERC20LoggableJSAPI.emitApprovalEvent,
                           [jcashCrydrViewERC20Instance.address, testInvestor1,
                            testInvestor1, testInvestor2, 10 * (10 ** 18)],
                           'Only CrydrController can emit approval event');
  });


  global.it('should test that functions fire events', async () => {
    const value = 10 * (10 ** 18);

    let blockNumber = global.web3.eth.blockNumber;
    await CrydrViewERC20LoggableJSAPI
      .emitTransferEvent(controllerStubInstance.address, testInvestor1,
                         testInvestor1, testInvestor2, value);
    let pastEvents = await CrydrViewERC20JSAPI
      .getTransferEvents(jcashCrydrViewERC20Instance.address,
                         {
                           from: testInvestor1,
                           to:   testInvestor2,
                           value,
                         },
                         {
                           fromBlock: blockNumber + 1,
                           toBlock:   blockNumber + 1,
                           address:   testInvestor1,
                         });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = global.web3.eth.blockNumber;
    await CrydrViewERC20LoggableJSAPI
      .emitApprovalEvent(controllerStubInstance.address, testInvestor1,
                         testInvestor1, testInvestor2, value);
    pastEvents = await CrydrViewERC20JSAPI
      .getApprovalEvents(jcashCrydrViewERC20Instance.address,
                         {
                           owner:   testInvestor1,
                           spender: testInvestor2,
                           value,
                         },
                         {
                           fromBlock: blockNumber + 1,
                           toBlock:   blockNumber + 1,
                           address:   testInvestor1,
                         });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
