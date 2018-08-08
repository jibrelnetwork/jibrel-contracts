const CrydrControllerBaseMock = global.artifacts.require('CrydrControllerBaseMock.sol');
const JCashCrydrStorage = global.artifacts.require('JCashCrydrStorage.sol');
const CrydrViewBaseMock = global.artifacts.require('CrydrViewBaseMock.sol');

import * as PausableInterfaceJSAPI            from '../../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as CrydrControllerBaseInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerBase/CrydrControllerBaseInterface.jsapi';

import * as DeployConfig from '../../../jsroutines/jsconfig/DeployConfig';
import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';
import * as CrydrControllerInit from '../../../jsroutines/jsinit/CrydrControllerInit';

import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';


global.contract('CrydrControllerBase', (accounts) => {
  let crydrControllerBaseInstance;
  let crydrStorageInstance;
  let crydrViewBaseInstance;

  let crydrStorageInstanceStub01;
  let crydrViewBaseInstanceStub01;


  DeployConfig.setAccounts(accounts);
  const { owner, managerGeneral, managerPause, testInvestor1 } = DeployConfig.getAccounts();


  const viewStandard = 'TestView';
  const assetID = 'jASSET';

  const viewStandardStub01 = 'TestViewStub01';

  global.beforeEach(async () => {
    crydrControllerBaseInstance = await CrydrControllerBaseMock.new(assetID, { from: owner });
    crydrStorageInstance = await JCashCrydrStorage.new(assetID, { from: owner });
    crydrViewBaseInstance = await CrydrViewBaseMock.new(assetID, viewStandard, { form: owner });

    crydrStorageInstanceStub01 = await JCashCrydrStorage.new(assetID, { from: owner });
    crydrViewBaseInstanceStub01 = await CrydrViewBaseMock.new(assetID, viewStandardStub01, { form: owner });

    global.console.log('\tContracts deployed for tests CrydrControllerBase:');
    global.console.log(`\t\tcrydrControllerBaseInstance: ${crydrControllerBaseInstance.address}`);
    global.console.log(`\t\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.console.log(`\t\tcrydrViewBaseInstance: ${crydrViewBaseInstance.address}`);
    global.console.log(`\t\tcrydrStorageInstanceStub01: ${crydrStorageInstanceStub01.address}`);
    global.console.log(`\t\tcrydrViewBaseInstanceStub01: ${crydrViewBaseInstanceStub01.address}`);

    await CrydrControllerInit.configureCrydrControllerManagers(crydrControllerBaseInstance.address);
  });

  global.it('should test that view is configurable', async () => {
    let isPaused = await PausableInterfaceJSAPI.getPaused(crydrControllerBaseInstance.address);
    global.assert.strictEqual(isPaused, true, 'Expected that contract is paused');


    let isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                          [crydrControllerBaseInstance.address, testInvestor1,
                                                           crydrViewBaseInstance.address, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to add a CrydrView');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, managerGeneral,
                                                       0x0, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of CrydrView');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, managerGeneral,
                                                       crydrViewBaseInstance.address, '']);
    global.assert.strictEqual(isThrows, true, 'viewAPIviewStandard could not be empty');


    await CrydrControllerBaseInterfaceJSAPI.setCrydrView(crydrControllerBaseInstance.address, managerGeneral,
                                                         crydrViewBaseInstance.address, viewStandard);

    let crydrViewAddressReceived = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrViewAddress(crydrControllerBaseInstance.address, viewStandard);
    global.assert.strictEqual(crydrViewAddressReceived, crydrViewBaseInstance.address);


    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, managerGeneral,
                                                       crydrViewBaseInstanceStub01.address, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'Should be a different view name');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, managerGeneral,
                                                       crydrViewBaseInstance.address, viewStandardStub01]);
    global.assert.strictEqual(isThrows, true, 'Should be a different view address');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.removeCrydrView,
                                                      [crydrControllerBaseInstance.address, testInvestor1, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to remove a CrydrView');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.removeCrydrView,
                                                      [crydrControllerBaseInstance.address, testInvestor1, '']);
    global.assert.strictEqual(isThrows, true, 'viewAPIviewStandard could not be empty');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.removeCrydrView,
                                                      [crydrControllerBaseInstance.address, testInvestor1, 'xxx']);
    global.assert.strictEqual(isThrows, true, 'viewAPIviewStandard must be known');


    await PausableInterfaceJSAPI.unpauseContract(crydrControllerBaseInstance.address, managerPause);

    isPaused = await PausableInterfaceJSAPI.getPaused(crydrControllerBaseInstance.address);
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, managerGeneral,
                                                       crydrViewBaseInstanceStub01.address, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'It should no be possible to set crydrView if contract is unpaused');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.removeCrydrView,
                                                      [crydrControllerBaseInstance.address, managerGeneral,
                                                       viewStandard]);
    global.assert.strictEqual(isThrows, true, 'It should no be possible to remove a view if contract is unpaused');


    crydrViewAddressReceived = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrViewAddress(crydrControllerBaseInstance.address, viewStandard);
    global.assert.strictEqual(crydrViewAddressReceived, crydrViewBaseInstance.address);
  });


  global.it('should test that storage is configurable', async () => {
    let isPaused = await crydrControllerBaseInstance.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Expected that contract is paused');


    let isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrStorage,
                                                          [crydrControllerBaseInstance.address, testInvestor1,
                                                           crydrStorageInstance.address]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to set CrydrStorage');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrStorage,
                                                      [crydrControllerBaseInstance.address, managerGeneral, 0x0]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of CrydrStorage');


    await CrydrControllerBaseInterfaceJSAPI.setCrydrStorage(crydrControllerBaseInstance.address, managerGeneral,
                                                            crydrStorageInstance.address);

    let crydrStorageAddressReceived = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrStorageAddress(crydrControllerBaseInstance.address);
    global.assert.strictEqual(crydrStorageAddressReceived, crydrStorageInstance.address);


    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrStorage,
                                                      [crydrControllerBaseInstance.address, managerGeneral,
                                                       crydrStorageInstance.address]);
    global.assert.strictEqual(isThrows, true, 'Should be a different storage address');


    await PausableInterfaceJSAPI.unpauseContract(crydrControllerBaseInstance.address, managerPause);

    isPaused = await crydrControllerBaseInstance.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrStorage,
                                                      [crydrControllerBaseInstance.address, managerGeneral,
                                                       crydrStorageInstanceStub01.address]);
    global.assert.strictEqual(isThrows, true, 'It should no be possible to set storage if contract is unpaused');


    crydrStorageAddressReceived = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrStorageAddress(crydrControllerBaseInstance.address);
    global.assert.strictEqual(crydrStorageAddressReceived, crydrStorageInstance.address);
  });


  global.it('should test that functions fire events', async () => {
    let blockNumber = await AsyncWeb3.getBlockNumber();
    await CrydrControllerBaseInterfaceJSAPI.setCrydrStorage(crydrControllerBaseInstance.address, managerGeneral,
                                                            crydrStorageInstance.address);
    const crydrStorageAddress = crydrStorageInstance.address;
    let pastEvents = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrStorageChangedEvents(crydrControllerBaseInstance.address,
                                    {
                                      crydrStorageAddress,
                                    },
                                    {
                                      fromBlock: blockNumber + 1,
                                      toBlock:   blockNumber + 1,
                                      address:   managerGeneral,
                                    });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = await AsyncWeb3.getBlockNumber();
    await CrydrControllerBaseInterfaceJSAPI.setCrydrView(crydrControllerBaseInstance.address, managerGeneral,
                                                         crydrViewBaseInstance.address, viewStandard);
    const crydrViewAddress = crydrViewBaseInstance.address;
    pastEvents = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrViewAddedEvents(crydrControllerBaseInstance.address,
                               {
                                 viewStandard, crydrViewAddress,
                               },
                               {
                                 fromBlock: blockNumber + 1,
                                 toBlock:   blockNumber + 1,
                                 address:   managerGeneral,
                               });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = await AsyncWeb3.getBlockNumber();
    await CrydrControllerBaseInterfaceJSAPI.removeCrydrView(crydrControllerBaseInstance.address, managerGeneral,
                                                            viewStandard);
    pastEvents = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrViewRemovedEvents(crydrControllerBaseInstance.address,
                                 {
                                   viewStandard, crydrViewAddress,
                                 },
                                 {
                                   fromBlock: blockNumber + 1,
                                   toBlock:   blockNumber + 1,
                                   address:   managerGeneral,
                                 });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
