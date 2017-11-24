const CrydrControllerERC20Stub       = global.artifacts.require('CrydrControllerERC20Stub.sol');
const CrydrViewERC20                 = global.artifacts.require('CrydrViewERC20.sol');

const PausableJSAPI = require('../../../jsapi/lifecycle/Pausable');
const CrydrViewBaseJSAPI = require('../../../jsapi/crydr/view/CrydrViewBaseInterface');
const CrydrViewERC20JSAPI = require('../../../jsapi/crydr/view/ERC20Interface');
const CrydrViewERC20LoggableJSAPI = require('../../../jsapi/crydr/view/CrydrViewERC20LoggableInterface');

const PausableTestSuite = require('../../../test_suit/lifecycle/Pausable');

const GlobalConfig = require('../../../migrations/init/GlobalConfig');
const CrydrViewInit = require('../../../migrations/init/CrydrViewInit');

const CheckExceptions = require('../../../test_util/CheckExceptions');


global.contract('CrydrViewERC20', (accounts) => {
  let CrydrViewERC20Instance;
  let controllerStubInstance;


  GlobalConfig.setAccounts(accounts);
  const { owner, managerGeneral, managerPause, testInvestor1, testInvestor2 } = GlobalConfig.getAccounts();

  const name = 'testName';
  const symbol = 'testSymbol';
  const decimals = 18;

  const assetID = 'jASSET';


  global.beforeEach(async () => {
    CrydrViewERC20Instance = await CrydrViewERC20.new(assetID, name, symbol, decimals, { from: owner });
    controllerStubInstance = await CrydrControllerERC20Stub.new(assetID,
                                                                CrydrViewERC20Instance.address,
                                                                { from: owner });

    global.console.log('\tContracts deployed for tests CrydrViewBase:');
    global.console.log(`\t\tCrydrViewERC20Instance: ${CrydrViewERC20Instance.address}`);
    global.console.log(`\t\tcontrollerStubInstance: ${controllerStubInstance}`);

    global.console.log('\tStart to configure test contracts:');
    await CrydrViewInit.configureCrydrViewManagers(CrydrViewERC20Instance.address);
    await CrydrViewBaseJSAPI.setCrydrController(CrydrViewERC20Instance.address,
                                                managerGeneral,
                                                controllerStubInstance.address);
    await PausableJSAPI.unpauseContract(CrydrViewERC20Instance.address, managerPause);


    global.console.log('\tStart to verify configuration of test contracts:');
    const controllerAddress = await CrydrViewBaseJSAPI.getCrydrController(CrydrViewERC20Instance.address);
    global.assert.strictEqual(controllerAddress, controllerStubInstance.address,
                              'Expected that view configured properly');
    const isPaused = await PausableJSAPI.getPaused(CrydrViewERC20Instance.address);
    global.assert.strictEqual(isPaused, false, 'Expected that contract is paused');
  });

  global.it('should test that contract works as expected', async () => {
    await CrydrViewERC20JSAPI.transfer(CrydrViewERC20Instance.address, testInvestor1,
                                       testInvestor1, 10 * (10 ** 18));
    const transferCounter = await controllerStubInstance.transferCounter.call();
    global.assert.strictEqual(transferCounter.toNumber(), 1);

    await CrydrViewERC20JSAPI.approve(CrydrViewERC20Instance.address, testInvestor1,
                                      testInvestor1, 10 * (10 ** 18));
    const approveCounter = await controllerStubInstance.approveCounter.call();
    global.assert.strictEqual(approveCounter.toNumber(), 1);

    await CrydrViewERC20JSAPI.transferFrom(CrydrViewERC20Instance.address, testInvestor1,
                                           testInvestor1, testInvestor2, 10 * (10 ** 18));
    const transferFromCounter = await controllerStubInstance.transferFromCounter.call();
    global.assert.strictEqual(transferFromCounter.toNumber(), 1);

    const totalSupply = await CrydrViewERC20Instance.totalSupply.call();
    global.assert.strictEqual(totalSupply.toNumber(), 60 * (10 ** 18));

    const balanceOf = await CrydrViewERC20Instance.balanceOf.call(testInvestor1);
    global.assert.strictEqual(balanceOf.toNumber(), 40 * (10 ** 18));

    const allowance = await CrydrViewERC20Instance.allowance.call(testInvestor1, testInvestor2);
    global.assert.strictEqual(allowance.toNumber(), 20 * (10 ** 18));
  });

  global.it('should test that functions covered by pause modifiers', async () => {
    PausableJSAPI.pauseContract(CrydrViewERC20Instance.address, managerPause);

    await PausableTestSuite
      .assertWhenContractNotPaused(CrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20JSAPI.transfer,
                                   [CrydrViewERC20Instance.address, testInvestor1,
                                    testInvestor2, 10 * (10 ** 18)]);
    await PausableTestSuite
      .assertWhenContractNotPaused(CrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20JSAPI.approve,
                                   [CrydrViewERC20Instance.address, testInvestor1,
                                    testInvestor2, 10 * (10 ** 18)]);
    await PausableTestSuite
      .assertWhenContractNotPaused(CrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20JSAPI.transferFrom,
                                   [CrydrViewERC20Instance.address, testInvestor1,
                                    testInvestor1, testInvestor2, 10 * (10 ** 18)]);

    await PausableTestSuite
      .assertWhenContractNotPaused(CrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20LoggableJSAPI.emitTransferEvent,
                                   [controllerStubInstance.address, testInvestor1,
                                    testInvestor1, testInvestor2, 10 * (10 ** 18)]);
    await PausableTestSuite
      .assertWhenContractNotPaused(CrydrViewERC20Instance.address, managerPause,
                                   CrydrViewERC20LoggableJSAPI.emitApprovalEvent,
                                   [controllerStubInstance.address, testInvestor1,
                                    testInvestor1, testInvestor2, 10 * (10 ** 18)]);
  });

  global.it('should test that only controller is allowed to emit events', async () => {
    // direct call to the view, not through the controller
    await CheckExceptions
      .checkContractThrows(CrydrViewERC20LoggableJSAPI.emitTransferEvent,
                           [CrydrViewERC20Instance.address, testInvestor1,
                            testInvestor1, testInvestor2, 10 * (10 ** 18)],
                           'Only CrydrController can emit transfer event');
    await CheckExceptions
      .checkContractThrows(CrydrViewERC20LoggableJSAPI.emitApprovalEvent,
                           [CrydrViewERC20Instance.address, testInvestor1,
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
      .getTransferEvents(CrydrViewERC20Instance.address,
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
      .getApprovalEvents(CrydrViewERC20Instance.address,
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
