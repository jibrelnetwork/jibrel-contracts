const CrydrViewBaseMock = global.artifacts.require('CrydrViewBaseMock.sol');
const CrydrControllerERC20Stub = global.artifacts.require('CrydrControllerERC20Stub.sol');

const PausableJSAPI = require('../../../jsroutines/jsapi/lifecycle/Pausable');
const CrydrViewBaseJSAPI = require('../../../jsroutines/jsapi/crydr/view/CrydrViewBaseInterface');

const DeployConfig = require('../../../jsroutines/jsconfig/DeployConfig');
const CrydrViewInit = require('../../../jsroutines/jsinit/CrydrViewInit');

const CheckExceptions = require('../../../jsroutines/util/CheckExceptions');

global.contract('CrydrViewBase', (accounts) => {
  let crydrViewBaseInstance;
  let controllerStubInstance01;
  let controllerStubInstance02;

  DeployConfig.setAccounts(accounts);
  const { owner, managerGeneral, managerPause, testInvestor1 } = DeployConfig.getAccounts();

  const viewStandard = 'testName';
  const viewStandardHash = '0x698c8efcda9e563cf153563941b60fc5ac88336fc58d361eb0888686fadb9976';
  const assetID = 'jASSET';


  global.beforeEach(async () => {
    crydrViewBaseInstance = await CrydrViewBaseMock.new(assetID, viewStandard, { from: owner });
    controllerStubInstance01 = await CrydrControllerERC20Stub.new(assetID,
                                                                  crydrViewBaseInstance.address,
                                                                  { from: owner });
    controllerStubInstance02 = await CrydrControllerERC20Stub.new(assetID,
                                                                  crydrViewBaseInstance.address,
                                                                  { from: owner });


    global.console.log('\tContracts deployed for tests CrydrViewBase:');
    global.console.log(`\t\tcrydrViewBaseInstance: ${crydrViewBaseInstance.address}`);
    global.console.log(`\t\tcontrollerStubInstance01: ${controllerStubInstance01}`);
    global.console.log(`\t\tcontrollerStubInstance02: ${controllerStubInstance02}`);

    global.console.log('\tStart to configure test contracts:');
    await CrydrViewInit.configureCrydrViewManagers(crydrViewBaseInstance.address);
    await CrydrViewBaseJSAPI.setCrydrController(crydrViewBaseInstance.address,
                                                managerGeneral,
                                                controllerStubInstance01.address);
    await PausableJSAPI.unpauseContract(crydrViewBaseInstance.address, managerPause);


    global.console.log('\tStart to verify configuration of test contracts:');
    const controllerAddress = await CrydrViewBaseJSAPI.getCrydrController(crydrViewBaseInstance.address);
    global.assert.strictEqual(controllerAddress, controllerStubInstance01.address,
                              'Expected that view configured properly');
    const isPaused = await PausableJSAPI.getPaused(crydrViewBaseInstance.address);
    global.assert.strictEqual(isPaused, false, 'Expected that contract is paused');
  });

  global.it('should test basic getters', async () => {
    const viewName = await CrydrViewBaseJSAPI.getCrydrViewStandardName(crydrViewBaseInstance.address);
    global.assert.strictEqual(viewName, viewStandard);

    const viewNameHash = await CrydrViewBaseJSAPI.getCrydrViewStandardNameHash(crydrViewBaseInstance.address);
    global.assert.strictEqual(viewNameHash, viewStandardHash);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    await PausableJSAPI.pauseContract(crydrViewBaseInstance.address, managerPause);


    let isThrows = await CheckExceptions.isContractThrows(CrydrViewBaseJSAPI.setCrydrController,
                                                          [crydrViewBaseInstance.address,
                                                           testInvestor1,
                                                           controllerStubInstance02.address]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to set crydrController');
    isThrows = await CheckExceptions.isContractThrows(CrydrViewBaseJSAPI.setCrydrController,
                                                      [crydrViewBaseInstance.address,
                                                       managerGeneral,
                                                       0x0]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of crydrController');
    isThrows = await CrydrViewBaseJSAPI.setCrydrController(crydrViewBaseInstance.address,
                                                           managerGeneral,
                                                           controllerStubInstance02.address);


    await PausableJSAPI.unpauseContract(crydrViewBaseInstance.address, managerPause);
    const isPaused = await crydrViewBaseInstance.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    isThrows = await CheckExceptions.isContractThrows(CrydrViewBaseJSAPI.setCrydrController,
                                                      [crydrViewBaseInstance.address,
                                                       managerGeneral,
                                                       0x0]);
    global.assert.strictEqual(isThrows, true, 'configuration os crydrController should be prohibited if unpaused');
  });

  global.it('should test that functions fire events', async () => {
    await PausableJSAPI.pauseContract(crydrViewBaseInstance.address, managerPause);

    const blockNumber = global.web3.eth.blockNumber;
    await CrydrViewBaseJSAPI.setCrydrController(crydrViewBaseInstance.address,
                                                managerGeneral,
                                                controllerStubInstance02.address);

    const pastEvents = await CrydrViewBaseJSAPI
      .getCrydrControllerChangedEvents(crydrViewBaseInstance.address,
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
