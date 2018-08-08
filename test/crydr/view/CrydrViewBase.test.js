import * as PausableInterfaceJSAPI from '../../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as CrydrViewBaseInterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewBase/CrydrViewBaseInterface.jsapi';

import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';
import * as DeployConfig from '../../../jsroutines/jsconfig/DeployConfig';
import * as CrydrViewInit from '../../../jsroutines/jsinit/CrydrViewInit';

import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';

const CrydrViewBaseMock = global.artifacts.require('CrydrViewBaseMock.sol');
const CrydrControllerERC20Stub = global.artifacts.require('CrydrControllerERC20Stub.sol');


global.contract('CrydrViewBase', (accounts) => {
  let crydrViewBaseInstance;
  let controllerStubInstance01;
  let controllerStubInstance02;

  DeployConfig.setEthAccounts(accounts);
  const ethAccounts = DeployConfig.getEthAccounts();

  const viewStandard = 'testName';
  const viewStandardHash = '0x698c8efcda9e563cf153563941b60fc5ac88336fc58d361eb0888686fadb9976';
  const assetID = 'jASSET';


  global.beforeEach(async () => {
    crydrViewBaseInstance = await CrydrViewBaseMock.new(assetID, viewStandard, { from: ethAccounts.owner });
    controllerStubInstance01 = await CrydrControllerERC20Stub.new(assetID,
                                                                  crydrViewBaseInstance.address,
                                                                  { from: ethAccounts.owner });
    controllerStubInstance02 = await CrydrControllerERC20Stub.new(assetID,
                                                                  crydrViewBaseInstance.address,
                                                                  { from: ethAccounts.owner });


    global.console.log('\tContracts deployed for tests CrydrViewBase:');
    global.console.log(`\t\tcrydrViewBaseInstance: ${crydrViewBaseInstance.address}`);
    global.console.log(`\t\tcontrollerStubInstance01: ${controllerStubInstance01}`);
    global.console.log(`\t\tcontrollerStubInstance02: ${controllerStubInstance02}`);

    global.console.log('\tStart to configure test contracts:');
    await CrydrViewInit.configureCrydrViewManagers(crydrViewBaseInstance.address, ethAccounts);
    await CrydrViewBaseInterfaceJSAPI.setCrydrController(crydrViewBaseInstance.address,
                                                         ethAccounts.managerGeneral,
                                                         controllerStubInstance01.address);
    await PausableInterfaceJSAPI.unpauseContract(crydrViewBaseInstance.address, ethAccounts.managerPause);


    global.console.log('\tStart to verify configuration of test contracts:');
    const controllerAddress = await CrydrViewBaseInterfaceJSAPI.getCrydrController(crydrViewBaseInstance.address);
    global.assert.strictEqual(controllerAddress, controllerStubInstance01.address,
                              'Expected that view configured properly');
    const isPaused = await PausableInterfaceJSAPI.getPaused(crydrViewBaseInstance.address);
    global.assert.strictEqual(isPaused, false, 'Expected that contract is paused');
  });

  global.it('should test basic getters', async () => {
    const viewName = await CrydrViewBaseInterfaceJSAPI.getCrydrViewStandardName(crydrViewBaseInstance.address);
    global.assert.strictEqual(viewName, viewStandard);

    const viewNameHash = await CrydrViewBaseInterfaceJSAPI.getCrydrViewStandardNameHash(crydrViewBaseInstance.address);
    global.assert.strictEqual(viewNameHash, viewStandardHash);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    await PausableInterfaceJSAPI.pauseContract(crydrViewBaseInstance.address, ethAccounts.managerPause);


    let isThrows = await CheckExceptions.isContractThrows(CrydrViewBaseInterfaceJSAPI.setCrydrController,
                                                          [crydrViewBaseInstance.address,
                                                           ethAccounts.testInvestor1,
                                                           controllerStubInstance02.address]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to set crydrController');
    isThrows = await CheckExceptions.isContractThrows(CrydrViewBaseInterfaceJSAPI.setCrydrController,
                                                      [crydrViewBaseInstance.address,
                                                       ethAccounts.managerGeneral,
                                                       0x0]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of crydrController');
    await CrydrViewBaseInterfaceJSAPI.setCrydrController(crydrViewBaseInstance.address,
                                                         ethAccounts.managerGeneral,
                                                         controllerStubInstance02.address);


    await PausableInterfaceJSAPI.unpauseContract(crydrViewBaseInstance.address, ethAccounts.managerPause);
    const isPaused = await crydrViewBaseInstance.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    isThrows = await CheckExceptions.isContractThrows(CrydrViewBaseInterfaceJSAPI.setCrydrController,
                                                      [crydrViewBaseInstance.address,
                                                       ethAccounts.managerGeneral,
                                                       0x0]);
    global.assert.strictEqual(isThrows, true, 'configuration os crydrController should be prohibited if unpaused');
  });

  global.it('should test that functions fire events', async () => {
    await PausableInterfaceJSAPI.pauseContract(crydrViewBaseInstance.address, ethAccounts.managerPause);

    const blockNumber = await AsyncWeb3.getBlockNumber();
    await CrydrViewBaseInterfaceJSAPI.setCrydrController(crydrViewBaseInstance.address,
                                                         ethAccounts.managerGeneral,
                                                         controllerStubInstance02.address);

    const pastEvents = await CrydrViewBaseInterfaceJSAPI
      .getCrydrControllerChangedEvents(crydrViewBaseInstance.address,
                                       {
                                         crydrcontroller: controllerStubInstance02.address,
                                       },
                                       {
                                         fromBlock: blockNumber + 1,
                                         toBlock:   blockNumber + 1,
                                         address:   ethAccounts.managerGeneral,
                                       });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
