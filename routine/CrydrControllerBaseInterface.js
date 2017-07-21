const CrydrControllerBaseInterface    = global.artifacts.require('CrydrControllerBaseInterface.sol');
const JNTPayableServiceInterface      = global.artifacts.require('JNTPayableServiceInterface.sol');
const JNTPayableServiceERC20Interface = global.artifacts.require('JNTPayableServiceERC20Interface.sol');
const CrydrControllerERC20Validatable = global.artifacts.require('CrydrControllerERC20ValidatableManagerInterface.sol');

const deploymentController           = require('../deployment_controller');
const ManageableRoutines             = require('./Manageable');
const PausableRoutines               = require('./Pausable');
const JNTControllerInterfaceRoutines = require('../routine/JNTControllerInterface');


export const deployCrydrController = (network, owner, crydrSymbol, crydrControllerContract) => {
  global.console.log('\tDeploying controller of a crydr:');
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);
  return crydrControllerContract.new({ from: owner })
    .then((value) => {
      global.console.log(`\tController of a crydr ${crydrSymbol} successfully deployed: ${value.address}`);
      deploymentController.setCrydrControllerAddress(network, crydrSymbol, value.address);
      return null;
    });
};

export const setStorageOfCrydrController = (manager, crydrStorageAddress, crydrControllerAddress) => {
  global.console.log('\tSet storage of CryDR controller:');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  return CrydrControllerBaseInterface
    .at(crydrControllerAddress)
    .setCrydrStorage
    .sendTransaction(crydrStorageAddress, { from: manager })
    .then(() => {
      global.console.log('\tStorage of CryDR controller successfully set');
      return null;
    });
};

export const setViewsOfCrydrController = (manager, crydrControllerAddress, crydrViewsStandardToAddresses) => {
  global.console.log(`\tSet ${crydrViewsStandardToAddresses.size} views of CryDR controller:`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tviews - ${JSON.stringify(crydrViewsStandardToAddresses)}`);
  const contractPromises = [];
  crydrViewsStandardToAddresses.forEach((crydrViewAddress, crydrViewStandard) => {
    const newPromise = CrydrControllerBaseInterface
      .at(crydrControllerAddress)
      .setCrydrView
      .sendTransaction(crydrViewStandard, crydrViewAddress, { from: manager });
    contractPromises.push(newPromise);
  });
  return Promise
    .all(contractPromises)
    .then(() => {
      global.console.log('\tViews of CryDR controller successfully set');
      return null;
    });
};

export const setInvestorsRegistry = (network, manager, crydrControllerAddress) => {
  global.console.log('\tSet investor registry for crydr controller:');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydr controller - ${crydrControllerAddress}`);
  const investorRegistryAddress = deploymentController.getInvestorRegistryAddress(network);
  return CrydrControllerERC20Validatable
    .at(crydrControllerAddress)
    .setInvestorsRegistry
    .sendTransaction(investorRegistryAddress, { from: manager })
    .then(() => {
      global.console.log('\tInvestor registry of CryDR controller successfully set');
      return null;
    });
};

export const setJNTController = (
  manager, crydrControllerAddress, jntControllerAddress, jntBeneficiaryAddress, jntPrices) => {
  global.console.log('\tSet JNT controller:');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydr controller - ${crydrControllerAddress}`);
  global.console.log(`\t\tjnt controller - ${jntControllerAddress}`);
  global.console.log(`\t\tjnt beneficiary - ${jntBeneficiaryAddress}`);
  global.console.log(`\t\tjnt prices - ${JSON.stringify(jntPrices)}`);
  const contractPromises = [
    JNTPayableServiceInterface
      .at(crydrControllerAddress)
      .setJntController
      .sendTransaction(jntControllerAddress, { from: manager }),
    JNTPayableServiceInterface
      .at(crydrControllerAddress)
      .setJntBeneficiary
      .sendTransaction(jntBeneficiaryAddress, { from: manager }),
    JNTPayableServiceERC20Interface
      .at(crydrControllerAddress)
      .setJntPrice
      .sendTransaction(jntPrices.get('transfer'),
                       jntPrices.get('transferFrom'),
                       jntPrices.get('approve'),
                       { from: manager }),
  ];
  return Promise
    .all(contractPromises)
    .then(() => {
      global.console.log('\tJNT controller of CryDR controller successfully set');
      return null;
    });
};


export const configureCrydrController = (network, owner, manager, crydrSymbol, viewsStandardsList,
                                         isConnectToInvestorRegistry, isConnectToJNT, jntPrices) => {
  global.console.log(`  Configuring controller of a crydr ${crydrSymbol} ...`);
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);

  const crydrStorageAddress    = deploymentController.getCrydrStorageAddress(network, crydrSymbol);
  const crydrControllerAddress = deploymentController.getCrydrControllerAddress(network, crydrSymbol);
  const jntController          = isConnectToJNT ? deploymentController.getCrydrControllerAddress(network, 'JNT') : null;

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

  const crydrViewsStandardToAddresses = new Map();
  viewsStandardsList.forEach((standardName) => {
    crydrViewsStandardToAddresses.set(
      standardName,
      deploymentController.getCrydrViewAddress(network, crydrSymbol, standardName));
  });

  return ManageableRoutines.enableManager(owner, manager, crydrControllerAddress)
    .then(() => ManageableRoutines.grantManagerPermissions(owner, manager, crydrControllerAddress, managerPermissions))
    .then(() => setStorageOfCrydrController(manager, crydrStorageAddress, crydrControllerAddress))
    .then(() => setViewsOfCrydrController(manager, crydrControllerAddress, crydrViewsStandardToAddresses))
    .then(() => {
      if (isConnectToInvestorRegistry) {
        return setInvestorsRegistry(network, manager, crydrControllerAddress);
      }
      return null;
    })
    .then(() => {
      if (isConnectToJNT) {
        return setJNTController(manager, crydrControllerAddress, jntController, crydrControllerAddress, jntPrices)
          .then(() => JNTControllerInterfaceRoutines.setJntPayableService(network, owner, crydrControllerAddress));
      }
      return null;
    })
    .then(() => PausableRoutines.unpauseContract(manager, crydrControllerAddress))
    .then(() => {
      global.console.log('\tController of CryDR successfully configured');
      return null;
    });
};
