import { BN } from 'bn.js';

import * as PausableInterfaceJSAPI            from '../../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as CrydrControllerBaseInterfaceJSAPI from '../../../contracts/crydr/controller/CrydrControllerBase/CrydrControllerBaseInterface.jsapi';

import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';
import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';

import * as CrydrControllerInit from '../../../jsroutines/jsinit/CrydrControllerInit';

const CrydrControllerBaseMock = global.artifacts.require('CrydrControllerBaseMock.sol');
const JCashCrydrStorage = global.artifacts.require('JCashCrydrStorage.sol');
const CrydrViewBaseMock = global.artifacts.require('CrydrViewBaseMock.sol');


global.contract('CrydrControllerBase', (accounts) => {
  TxConfig.setWeb3(global.web3);

  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();


  let crydrControllerBaseInstance;
  let crydrStorageInstance;
  let crydrViewBaseInstance;

  let crydrStorageInstanceStub01;
  let crydrViewBaseInstanceStub01;


  const viewStandard = 'TestView';
  const assetID = 'jASSET';

  const viewStandardStub01 = 'TestViewStub01';

  global.beforeEach(async () => {
    crydrControllerBaseInstance = await CrydrControllerBaseMock.new(assetID, { from: ethAccounts.owner });
    crydrStorageInstance = await JCashCrydrStorage.new(assetID, { from: ethAccounts.owner });
    crydrViewBaseInstance = await CrydrViewBaseMock.new(assetID, viewStandard, { from: ethAccounts.owner });

    crydrStorageInstanceStub01 = await JCashCrydrStorage.new(assetID, { from: ethAccounts.owner });
    crydrViewBaseInstanceStub01 = await CrydrViewBaseMock.new(assetID, viewStandardStub01, { from: ethAccounts.owner });

    global.console.log('\tContracts deployed for tests CrydrControllerBase:');
    global.console.log(`\t\tcrydrControllerBaseInstance: ${crydrControllerBaseInstance.address}`);
    global.console.log(`\t\tcrydrStorageInstance: ${crydrStorageInstance.address}`);
    global.console.log(`\t\tcrydrViewBaseInstance: ${crydrViewBaseInstance.address}`);
    global.console.log(`\t\tcrydrStorageInstanceStub01: ${crydrStorageInstanceStub01.address}`);
    global.console.log(`\t\tcrydrViewBaseInstanceStub01: ${crydrViewBaseInstanceStub01.address}`);

    await CrydrControllerInit.configureCrydrControllerManagers(crydrControllerBaseInstance.address, ethAccounts);
  });

  global.it('should test that view is configurable', async () => {
    let isPaused = await PausableInterfaceJSAPI.getPaused(crydrControllerBaseInstance.address);
    global.assert.strictEqual(isPaused, true, 'Expected that contract is paused');


    let isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                          [crydrControllerBaseInstance.address, ethAccounts.testInvestor1,
                                                           crydrViewBaseInstance.address, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to add a CrydrView');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                       0x0, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of CrydrView');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                       crydrViewBaseInstance.address, '']);
    global.assert.strictEqual(isThrows, true, 'viewAPIviewStandard could not be empty');


    await CrydrControllerBaseInterfaceJSAPI.setCrydrView(crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                         crydrViewBaseInstance.address, viewStandard);

    let crydrViewAddressReceived = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrViewAddress(crydrControllerBaseInstance.address, viewStandard);
    global.assert.strictEqual(crydrViewAddressReceived, crydrViewBaseInstance.address);


    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                       crydrViewBaseInstanceStub01.address, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'Should be a different view name');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                       crydrViewBaseInstance.address, viewStandardStub01]);
    global.assert.strictEqual(isThrows, true, 'Should be a different view address');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.removeCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.testInvestor1, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to remove a CrydrView');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.removeCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.testInvestor1, '']);
    global.assert.strictEqual(isThrows, true, 'viewAPIviewStandard could not be empty');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.removeCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.testInvestor1, 'xxx']);
    global.assert.strictEqual(isThrows, true, 'viewAPIviewStandard must be known');


    await PausableInterfaceJSAPI.unpauseContract(crydrControllerBaseInstance.address, ethAccounts.managerPause);

    isPaused = await PausableInterfaceJSAPI.getPaused(crydrControllerBaseInstance.address);
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                       crydrViewBaseInstanceStub01.address, viewStandard]);
    global.assert.strictEqual(isThrows, true, 'It should no be possible to set crydrView if contract is unpaused');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.removeCrydrView,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
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
                                                          [crydrControllerBaseInstance.address, ethAccounts.testInvestor1,
                                                           crydrStorageInstance.address]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to set CrydrStorage');

    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrStorage,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral, 0x0]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of CrydrStorage');


    await CrydrControllerBaseInterfaceJSAPI.setCrydrStorage(crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                            crydrStorageInstance.address);

    let crydrStorageAddressReceived = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrStorageAddress(crydrControllerBaseInstance.address);
    global.assert.strictEqual(crydrStorageAddressReceived, crydrStorageInstance.address);


    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrStorage,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                       crydrStorageInstance.address]);
    global.assert.strictEqual(isThrows, true, 'Should be a different storage address');


    await PausableInterfaceJSAPI.unpauseContract(crydrControllerBaseInstance.address, ethAccounts.managerPause);

    isPaused = await crydrControllerBaseInstance.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    isThrows = await CheckExceptions.isContractThrows(CrydrControllerBaseInterfaceJSAPI.setCrydrStorage,
                                                      [crydrControllerBaseInstance.address, ethAccounts.managerGeneral,
                                                       crydrStorageInstanceStub01.address]);
    global.assert.strictEqual(isThrows, true, 'It should no be possible to set storage if contract is unpaused');


    crydrStorageAddressReceived = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrStorageAddress(crydrControllerBaseInstance.address);
    global.assert.strictEqual(crydrStorageAddressReceived, crydrStorageInstance.address);
  });


  global.it('should test that functions fire events', async () => {
    let blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await CrydrControllerBaseInterfaceJSAPI.setCrydrStorage(crydrControllerBaseInstance.address,
                                                            ethAccounts.managerGeneral,
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
                                      address:   ethAccounts.managerGeneral,
                                    });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await CrydrControllerBaseInterfaceJSAPI.setCrydrView(crydrControllerBaseInstance.address,
                                                         ethAccounts.managerGeneral,
                                                         crydrViewBaseInstance.address,
                                                         viewStandard);
    const crydrViewAddress = crydrViewBaseInstance.address;
    pastEvents = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrViewAddedEvents(crydrControllerBaseInstance.address,
                               {
                                 viewStandard, crydrViewAddress,
                               },
                               {
                                 fromBlock: blockNumber + 1,
                                 toBlock:   blockNumber + 1,
                                 address:   ethAccounts.managerGeneral,
                               });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await CrydrControllerBaseInterfaceJSAPI.removeCrydrView(crydrControllerBaseInstance.address,
                                                            ethAccounts.managerGeneral,
                                                            viewStandard);
    pastEvents = await CrydrControllerBaseInterfaceJSAPI
      .getCrydrViewRemovedEvents(crydrControllerBaseInstance.address,
                                 {
                                   viewStandard, crydrViewAddress,
                                 },
                                 {
                                   fromBlock: blockNumber + 1,
                                   toBlock:   blockNumber + 1,
                                   address:   ethAccounts.managerGeneral,
                                 });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
