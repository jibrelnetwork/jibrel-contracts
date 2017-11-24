const CrydrViewBase = global.artifacts.require('CrydrViewBase.sol');
const CrydrControllerERC20Stub = global.artifacts.require('CrydrControllerERC20Stub.sol');

const PausableJSAPI = require('../../../jsapi/lifecycle/Pausable');
const CrydrViewBaseJSAPI = require('../../../jsapi/crydr/view/CrydrViewBaseInterface');

const GlobalConfig = require('../../../migrations/init/GlobalConfig');
const CrydrViewInit = require('../../../migrations/init/CrydrViewInit');

const CheckExceptions = require('../../../test_util/CheckExceptions');

global.contract('CrydrViewBase', (accounts) => {
  let CrydrViewBaseInstance;
  let controllerStubInstance01;
  let controllerStubInstance02;

  GlobalConfig.setAccounts(accounts);
  const { owner, managerGeneral, managerPause, testInvestor1 } = GlobalConfig.getAccounts();

  const viewStandard = 'testName';
  const viewStandardHash = '0x698c8efcda9e563cf153563941b60fc5ac88336fc58d361eb0888686fadb9976';
  const assetID = 'jASSET';


  global.beforeEach(async () => {
    CrydrViewBaseInstance = await CrydrViewBase.new(assetID, viewStandard, { from: owner });
    controllerStubInstance01 = await CrydrControllerERC20Stub.new(assetID,
                                                                  CrydrViewBaseInstance.address,
                                                                  { from: owner });
    controllerStubInstance02 = await CrydrControllerERC20Stub.new(assetID,
                                                                  CrydrViewBaseInstance.address,
                                                                  { from: owner });


    global.console.log('\tContracts deployed for tests CrydrViewBase:');
    global.console.log(`\t\tCrydrViewBaseInstance: ${CrydrViewBaseInstance.address}`);
    global.console.log(`\t\tcontrollerStubInstance01: ${controllerStubInstance01}`);
    global.console.log(`\t\tcontrollerStubInstance02: ${controllerStubInstance02}`);

    global.console.log('\tStart to configure test contracts:');
    await CrydrViewInit.configureCrydrViewManagers(CrydrViewBaseInstance.address);
    await CrydrViewBaseJSAPI.setCrydrController(CrydrViewBaseInstance.address,
                                                managerGeneral,
                                                controllerStubInstance01.address);
    await PausableJSAPI.unpauseContract(CrydrViewBaseInstance.address, managerPause);


    global.console.log('\tStart to verify configuration of test contracts:');
    const controllerAddress = await CrydrViewBaseJSAPI.getCrydrController(CrydrViewBaseInstance.address);
    global.assert.strictEqual(controllerAddress, controllerStubInstance01.address,
                              'Expected that view configured properly');
    const isPaused = await PausableJSAPI.getPaused(CrydrViewBaseInstance.address);
    global.assert.strictEqual(isPaused, false, 'Expected that contract is paused');
  });

  global.it('should test basic getters', async () => {
    const viewName = await CrydrViewBaseJSAPI.getCrydrViewStandardName(CrydrViewBaseInstance.address);
    global.assert.strictEqual(viewName, viewStandard);

    const viewNameHash = await CrydrViewBaseJSAPI.getCrydrViewStandardNameHash(CrydrViewBaseInstance.address);
    global.assert.strictEqual(viewNameHash, viewStandardHash);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    await PausableJSAPI.pauseContract(CrydrViewBaseInstance.address, managerPause);


    await CheckExceptions.checkContractThrows(CrydrViewBaseJSAPI.setCrydrController,
                                              [CrydrViewBaseInstance.address,
                                               testInvestor1,
                                               controllerStubInstance02.address],
                                              'Only manager should be able to set crydrController');
    await CheckExceptions.checkContractThrows(CrydrViewBaseJSAPI.setCrydrController,
                                              [CrydrViewBaseInstance.address,
                                               managerGeneral,
                                               0x0],
                                              'Should be a valid address of crydrController');
    await CrydrViewBaseJSAPI.setCrydrController(CrydrViewBaseInstance.address,
                                                managerGeneral,
                                                controllerStubInstance02.address);


    await PausableJSAPI.unpauseContract(CrydrViewBaseInstance.address, managerPause);
    const isPaused = await CrydrViewBaseInstance.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    await CheckExceptions.checkContractThrows(CrydrViewBaseJSAPI.setCrydrController,
                                              [CrydrViewBaseInstance.address,
                                               managerGeneral,
                                               0x0],
                                              'configuration os crydrController should be prohibited if unpaused');
  });

  global.it('should test that functions fire events', async () => {
    await PausableJSAPI.pauseContract(CrydrViewBaseInstance.address, managerPause);

    const blockNumber = global.web3.eth.blockNumber;
    await CrydrViewBaseJSAPI.setCrydrController(CrydrViewBaseInstance.address,
                                                managerGeneral,
                                                controllerStubInstance02.address);

    const pastEvents = await CrydrViewBaseJSAPI
      .getCrydrControllerChangedEvents(CrydrViewBaseInstance.address,
                                       {
                                         crydrcontroller: controllerStubInstance02.address,
                                       },
                                       {
                                         fromBlock: blockNumber + 1,
                                         toBlock:   blockNumber + 1,
                                         address:   managerGeneral,
                                       });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
