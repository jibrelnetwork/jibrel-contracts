import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const CrydrControllerBaseInterface    = global.artifacts.require('CrydrControllerBaseInterface.sol');
const JNTPayableServiceInterface      = global.artifacts.require('JNTPayableServiceInterface.sol');
const JNTPayableServiceERC20Interface = global.artifacts.require('JNTPayableServiceERC20Interface.sol');
const CrydrControllerERC20ValidatableInterface = global.artifacts.require('CrydrControllerERC20ValidatableInterface.sol');
const InvestorRegistry = global.artifacts.require('InvestorRegistry.sol');

const ManageableRoutines             = require('../../lifecycle/Manageable');
const PausableRoutines               = require('../../lifecycle/Pausable');
const JNTControllerInterfaceRoutines = require('../../crydr/jnt/JNTControllerInterface');

const JNTController = global.artifacts.require('JNTController.sol');


export const deployCrydrController = async (deployer, crydrControllerContractArtifact, owner) => {
  global.console.log('\tDeploying controller of a crydr:');
  global.console.log(`\t\towner - ${owner}`);

  await deployer.deploy(crydrControllerContractArtifact, { from: owner });

  global.console.log('\tController of a crydr successfully deployed');
  return null;
};

export const setStorageOfCrydrController = async (crydrControllerAddress, manager, crydrStorageAddress) => {
  global.console.log('\tSet storage of CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBaseInterface
      .at(crydrControllerAddress)
      .setCrydrStorage
      .sendTransaction,
    [crydrStorageAddress, { from: manager }]);
  global.console.log('\tStorage of CryDR controller successfully set');
  return null;
};

export const setViewsOfCrydrController = async (crydrControllerAddress, manager, crydrViewStandardToAddress) => {
  global.console.log(`\tSet ${crydrViewStandardToAddress.size} views of CryDR controller:`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tviews - ${JSON.stringify(crydrViewStandardToAddress)}`);
  const contractPromises = [];
  crydrViewStandardToAddress.forEach((crydrViewAddress, crydrViewStandard) => {
    const newPromise = submitTxAndWaitConfirmation(
      CrydrControllerBaseInterface
        .at(crydrControllerAddress)
        .setCrydrView
        .sendTransaction,
      [crydrViewStandard, crydrViewAddress, { from: manager }]);
    contractPromises.push(newPromise);
  });
  await Promise.all(contractPromises);
  global.console.log('\tViews of CryDR controller successfully set');
  return null;
};

export const setInvestorsRegistry = async (crydrControllerAddress, manager, investorRegistryAddress) => {
  global.console.log('\tSet investor registry for crydr controller:');
  global.console.log(`\t\tcrydr controller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerERC20ValidatableInterface
      .at(crydrControllerAddress)
      .setInvestorsRegistry
      .sendTransaction,
    [investorRegistryAddress, { from: manager }]);
  global.console.log('\tInvestor registry of CryDR controller successfully set');
  return null;
};

export const setJNTController = (crydrControllerAddress, manager,
                                 jntControllerAddress, jntBeneficiaryAddress, jntPrices) => {
  global.console.log('\tSet JNT controller:');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydr controller - ${crydrControllerAddress}`);
  global.console.log(`\t\tjnt controller - ${jntControllerAddress}`);
  global.console.log(`\t\tjnt beneficiary - ${jntBeneficiaryAddress}`);
  global.console.log(`\t\tjnt prices - ${JSON.stringify(jntPrices)}`);
  const contractPromises = [
    submitTxAndWaitConfirmation(
      JNTPayableServiceInterface
        .at(crydrControllerAddress)
        .setJntController
        .sendTransaction,
      [jntControllerAddress, { from: manager }]),
    submitTxAndWaitConfirmation(
      JNTPayableServiceInterface
        .at(crydrControllerAddress)
        .setJntBeneficiary
        .sendTransaction,
      [jntBeneficiaryAddress, { from: manager }]),
    submitTxAndWaitConfirmation(
      JNTPayableServiceERC20Interface
        .at(crydrControllerAddress)
        .setJntPrice
        .sendTransaction,
      [jntPrices.get('transfer'),
       jntPrices.get('transferFrom'),
       jntPrices.get('approve'),
       { from: manager }]),
  ];
  return Promise
    .all(contractPromises)
    .then(() => {
      global.console.log('\tJNT controller of CryDR controller successfully set');
      return null;
    });
};


export const configureCrydrController = async (crydrControllerAddress,
                                               owner, manager,
                                               crydrStorageAddress,
                                               crydrViewStandardToAddress, // standard name -> address
                                               isConnectToInvestorRegistry,
                                               isConnectToJNT, jntPrices) => {
  global.console.log('  Configuring controller of a crydr ...');
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);

  const managerPermissions = [
    'pause_contract',
    'unpause_contract',
    'set_crydr_storage',
    'set_crydr_view',
    'remove_crydr_view',
    'mint_crydr',
    'burn_crydr'];
  if (isConnectToInvestorRegistry) {
    managerPermissions.push('set_investors_registry');
  }
  if (isConnectToJNT) {
    managerPermissions.push('set_jnt_controller');
    managerPermissions.push('set_jnt_beneficiary');
    managerPermissions.push('set_jnt_price');
  }

  const investorRegistryInstance = await InvestorRegistry.deployed();

  await ManageableRoutines.enableManager(crydrControllerAddress, owner, manager);
  await ManageableRoutines.grantManagerPermissions(crydrControllerAddress, owner, manager, managerPermissions);
  await setStorageOfCrydrController(crydrControllerAddress, manager, crydrStorageAddress);
  await setViewsOfCrydrController(crydrControllerAddress, manager, crydrViewStandardToAddress);
  if (isConnectToInvestorRegistry) {
    await setInvestorsRegistry(crydrControllerAddress, manager, investorRegistryInstance.address);
  }
  if (isConnectToJNT) {
    const JNTControllerInstance = await JNTController.deployed();
    await setJNTController(crydrControllerAddress, manager,
                           JNTControllerInstance.address, crydrControllerAddress, jntPrices);
    await JNTControllerInterfaceRoutines.setJntPayableService(JNTControllerInstance.address, owner,
                                                              crydrControllerAddress);
  }
  await PausableRoutines.unpauseContract(crydrControllerAddress, manager);
  global.console.log('\tController of CryDR successfully configured');
  return null;
};


/**
 * Events
 */

export const getCrydrStorageChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterface
    .at(contractAddress)
    .CrydrStorageChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getCrydrViewAddedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterface
    .at(contractAddress)
    .CrydrViewAddedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getCrydrViewRemovedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterface
    .at(contractAddress)
    .CrydrViewRemovedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
