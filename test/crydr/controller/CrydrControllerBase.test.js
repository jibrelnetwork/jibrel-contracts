const CrydrControllerBase = global.artifacts.require('CrydrControllerBase.sol');
const CrydrStorage        = global.artifacts.require('CrydrStorage.sol');
const CrydrViewBase       = global.artifacts.require('CrydrViewBase.sol');

const PausableJSAPI            = require('../../../jsapi/lifecycle/Pausable');
const CrydrControllerBaseJSAPI = require('../../../jsapi/crydr/controller/CrydrControllerBaseInterface');

const GlobalConfig = require('../../../migrations/init/GlobalConfig');
const CrydrControllerInit = require('../../../migrations/init/CrydrControllerInit');

const CheckExceptions = require('../../../test_util/CheckExceptions');


global.contract('CrydrControllerBase', (accounts) => {
  let crydrControllerBaseContract;
  let crydrStorageContract;
  let crydrViewBaseContract;

  let crydrStorageContractStub01;
  let crydrViewBaseContractStub01;


  GlobalConfig.setAccounts(accounts);
  const { owner, managerGeneral, managerPause, testInvestor1 } = GlobalConfig.getAccounts();


  const viewStandard = 'TestView';
  const assetID = 'jASSET';

  const viewStandardStub01 = 'TestViewStub01';

  global.beforeEach(async () => {
    crydrControllerBaseContract = await CrydrControllerBase.new(assetID, { from: owner });
    crydrStorageContract = await CrydrStorage.new(assetID, { from: owner });
    crydrViewBaseContract = await CrydrViewBase.new(assetID, viewStandard, { form: owner });

    crydrStorageContractStub01 = await CrydrStorage.new(assetID, { from: owner });
    crydrViewBaseContractStub01 = await CrydrViewBase.new(assetID, viewStandardStub01, { form: owner });

    global.console.log('\tContracts deployed for tests CrydrControllerBase:');
    global.console.log(`\t\tcrydrControllerBaseContract: ${crydrControllerBaseContract.address}`);
    global.console.log(`\t\tcrydrStorageContract: ${crydrStorageContract.address}`);
    global.console.log(`\t\tcrydrViewBaseContract: ${crydrViewBaseContract.address}`);
    global.console.log(`\t\tcrydrStorageContractStub01: ${crydrStorageContractStub01.address}`);
    global.console.log(`\t\tcrydrViewBaseContractStub01: ${crydrViewBaseContractStub01.address}`);

    await CrydrControllerInit.configureCrydrControllerManagers(crydrControllerBaseContract.address);
  });

  global.it('should test that view is configurable', async () => {
    let isPaused = await crydrControllerBaseContract.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Expected that contract is paused');


    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrView,
                                              [crydrControllerBaseContract.address, testInvestor1,
                                               crydrViewBaseContract.address, viewStandard],
                                              'Only manager should be able to add a CrydrView');

    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrView,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               0x0, viewStandard],
                                              'Should be a valid address of CrydrView');

    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrView,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               crydrViewBaseContract.address, ''],
                                              'viewAPIviewStandard could not be empty');


    await CrydrControllerBaseJSAPI.setCrydrView(crydrControllerBaseContract.address, managerGeneral,
                                                crydrViewBaseContract.address, viewStandard);

    let crydrViewAddressReceived = await crydrControllerBaseContract.getCrydrView.call(viewStandard);
    global.assert.strictEqual(crydrViewAddressReceived, crydrViewBaseContract.address);


    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrView,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               crydrViewBaseContractStub01.address, viewStandard],
                                              'Should be a different view name');

    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrView,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               crydrViewBaseContract.address, viewStandardStub01],
                                              'Should be a different view address');

    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.removeCrydrView,
                                              [crydrControllerBaseContract.address, testInvestor1,
                                               viewStandard],
                                              'Only manager should be able to remove a CrydrView');

    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.removeCrydrView,
                                              [crydrControllerBaseContract.address, testInvestor1,
                                               ''],
                                              'viewAPIviewStandard could not be empty');

    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.removeCrydrView,
                                              [crydrControllerBaseContract.address, testInvestor1,
                                               'xxx'],
                                              'viewAPIviewStandard must be known');


    await PausableJSAPI.unpauseContract(crydrControllerBaseContract.address, managerPause);

    isPaused = await crydrControllerBaseContract.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrView,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               crydrViewBaseContractStub01.address, viewStandard],
                                              'It should no be possible to set crydrView if contract is unpaused');

    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.removeCrydrView,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               viewStandard],
                                              'It should no be possible to remove a view if contract is unpaused');


    crydrViewAddressReceived = await crydrControllerBaseContract.getCrydrView.call(viewStandard);
    global.assert.strictEqual(crydrViewAddressReceived, crydrViewBaseContract.address);
  });


  global.it('should test that storage is configurable', async () => {
    let isPaused = await crydrControllerBaseContract.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Expected that contract is paused');


    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrStorage,
                                              [crydrControllerBaseContract.address, testInvestor1,
                                               crydrStorageContract.address],
                                              'Only manager should be able to set CrydrStorage');

    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrStorage,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               0x0],
                                              'Should be a valid address of CrydrStorage');


    await CrydrControllerBaseJSAPI.setCrydrStorage(crydrControllerBaseContract.address, managerGeneral,
                                                   crydrStorageContract.address);

    let crydrStorageAddressReceived = await CrydrControllerBaseJSAPI
      .getCrydrStorage(crydrControllerBaseContract.address);
    global.assert.strictEqual(crydrStorageAddressReceived, crydrStorageContract.address);


    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrStorage,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               crydrStorageContract.address],
                                              'Should be a different storage address');


    await PausableJSAPI.unpauseContract(crydrControllerBaseContract.address, managerPause);

    isPaused = await crydrControllerBaseContract.getPaused.call();
    global.assert.strictEqual(isPaused, false, 'Expected that contract is unpaused');


    await CheckExceptions.checkContractThrows(CrydrControllerBaseJSAPI.setCrydrStorage,
                                              [crydrControllerBaseContract.address, managerGeneral,
                                               crydrStorageContractStub01.address],
                                              'It should no be possible to set storage if contract is unpaused');


    crydrStorageAddressReceived = await crydrControllerBaseContract.getCrydrStorage.call();
    global.assert.strictEqual(crydrStorageAddressReceived, crydrStorageContract.address);
  });


  global.it('should test that functions fire events', async () => {
    let blockNumber = global.web3.eth.blockNumber;
    await CrydrControllerBaseJSAPI.setCrydrStorage(crydrControllerBaseContract.address, managerGeneral,
                                                   crydrStorageContract.address);
    const crydrStorageAddress = crydrStorageContract.address;
    let pastEvents = await CrydrControllerBaseJSAPI
      .getCrydrStorageChangedEvents(crydrControllerBaseContract.address,
                                    {
                                      crydrStorageAddress,
                                    },
                                    {
                                      fromBlock: blockNumber + 1,
                                      toBlock:   blockNumber + 1,
                                      address:   managerGeneral,
                                    });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = global.web3.eth.blockNumber;
    await CrydrControllerBaseJSAPI.setCrydrView(crydrControllerBaseContract.address, managerGeneral,
                                                crydrViewBaseContract.address, viewStandard);
    const crydrViewAddress = crydrViewBaseContract.address;
    pastEvents = await CrydrControllerBaseJSAPI
      .getCrydrViewAddedEvents(crydrControllerBaseContract.address,
                               {
                                 viewStandard, crydrViewAddress,
                               },
                               {
                                 fromBlock: blockNumber + 1,
                                 toBlock:   blockNumber + 1,
                                 address:   managerGeneral,
                               });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = global.web3.eth.blockNumber;
    await CrydrControllerBaseJSAPI.removeCrydrView(crydrControllerBaseContract.address, managerGeneral,
                                                   viewStandard);
    pastEvents = await CrydrControllerBaseJSAPI
      .getCrydrViewRemovedEvents(crydrControllerBaseContract.address,
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
