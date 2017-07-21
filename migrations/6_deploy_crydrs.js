global.artifacts = artifacts; // eslint-disable-line no-undef

const jUSDStorage    = global.artifacts.require('jUSDStorage.sol');
const jUSDController = global.artifacts.require('jUSDController.sol');
const jUSDViewERC20  = global.artifacts.require('jUSDViewERC20.sol');

const jEURStorage    = global.artifacts.require('jEURStorage.sol');
const jEURController = global.artifacts.require('jEURController.sol');
const jEURViewERC20  = global.artifacts.require('jEURViewERC20.sol');

const jGBPStorage    = global.artifacts.require('jGBPStorage.sol');
const jGBPController = global.artifacts.require('jGBPController.sol');
const jGBPViewERC20  = global.artifacts.require('jGBPViewERC20.sol');

const jAEDStorage    = global.artifacts.require('jAEDStorage.sol');
const jAEDController = global.artifacts.require('jAEDController.sol');
const jAEDViewERC20  = global.artifacts.require('jAEDViewERC20.sol');

const jRUBStorage    = global.artifacts.require('jRUBStorage.sol');
const jRUBController = global.artifacts.require('jRUBController.sol');
const jRUBViewERC20  = global.artifacts.require('jRUBViewERC20.sol');

const jCNYStorage    = global.artifacts.require('jCNYStorage.sol');
const jCNYController = global.artifacts.require('jCNYController.sol');
const jCNYViewERC20  = global.artifacts.require('jCNYViewERC20.sol');

const jTBillStorage    = global.artifacts.require('jTBillStorage.sol');
const jTBillController = global.artifacts.require('jTBillController.sol');
const jTBillViewERC20  = global.artifacts.require('jTBillViewERC20.sol');

const jGDRStorage    = global.artifacts.require('jGDRStorage.sol');
const jGDRController = global.artifacts.require('jGDRController.sol');
const jGDRViewERC20  = global.artifacts.require('jGDRViewERC20.sol');

const deploymentController           = require('../deployment_controller');
const crydrGeneralRoutines           = require('../routine/CrydrGeneral');
const JNTControllerInterfaceRoutines = require('../routine/JNTControllerInterface');


/* Deploy and configure fiat CryDRs */

const jntPrices = new Map(
  [['transfer', Math.pow(10, 18)], ['transferFrom', Math.pow(10, 18)], ['approve', Math.pow(10, 18)]]); // eslint-disable-line no-restricted-properties

const deployJUSD = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'jUSD', 'United States dollar',
                                               jUSDStorage, jUSDController, jUSDViewERC20,
                                               false, true, jntPrices);

const deployJEUR = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'jEUR', 'Euro',
                                               jEURStorage, jEURController, jEURViewERC20,
                                               false, true, jntPrices);

const deployJGBP = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'jGBP', 'Pound sterling',
                                               jGBPStorage, jGBPController, jGBPViewERC20,
                                               false, true, jntPrices);

const deployJAED = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'jAED', 'United Arab Emirates dirham',
                                               jAEDStorage, jAEDController, jAEDViewERC20,
                                               false, true, jntPrices);

const deployJRUB = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'jRUB', 'Russian ruble',
                                               jRUBStorage, jRUBController, jRUBViewERC20,
                                               false, true, jntPrices);

const deployJCNY = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'jCNY', 'Chinese yuan',
                                               jCNYStorage, jCNYController, jCNYViewERC20,
                                               false, true, jntPrices);

const deployJTBill = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'jTBill', 'Treasure bill',
                                               jTBillStorage, jTBillController, jTBillViewERC20,
                                               true, true, jntPrices);

const deployJGDR = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'jGDR', 'Global depositary receipt',
                                               jGDRStorage, jGDRController, jGDRViewERC20,
                                               true, true, jntPrices);


/* Migration routine */

const migrationRoutine = (network, owner, manager) =>
  deployJUSD(network, owner, manager)
    .then(() => deployJEUR(network, owner, manager))
    .then(() => deployJGBP(network, owner, manager))
    .then(() => deployJAED(network, owner, manager))
    .then(() => deployJRUB(network, owner, manager))
    .then(() => deployJCNY(network, owner, manager))
    .then(() => deployJTBill(network, owner, manager))
    .then(() => deployJGDR(network, owner, manager))
    .then(() => { deploymentController.logStorage(network); });

const verifyRoutine = (network) =>
  JNTControllerInterfaceRoutines
    .verifyPayableService(network, deploymentController.getCrydrControllerAddress(network, 'jUSD'))
    .then(() => JNTControllerInterfaceRoutines
      .verifyPayableService(network, deploymentController.getCrydrControllerAddress(network, 'jEUR')))
    .then(() => JNTControllerInterfaceRoutines
      .verifyPayableService(network, deploymentController.getCrydrControllerAddress(network, 'jGBP')))
    .then(() => JNTControllerInterfaceRoutines
      .verifyPayableService(network, deploymentController.getCrydrControllerAddress(network, 'jAED')))
    .then(() => JNTControllerInterfaceRoutines
      .verifyPayableService(network, deploymentController.getCrydrControllerAddress(network, 'jRUB')))
    .then(() => JNTControllerInterfaceRoutines
      .verifyPayableService(network, deploymentController.getCrydrControllerAddress(network, 'jCNY')))
    .then(() => JNTControllerInterfaceRoutines
      .verifyPayableService(network, deploymentController.getCrydrControllerAddress(network, 'jTBill')))
    .then(() => JNTControllerInterfaceRoutines
      .verifyPayableService(network, deploymentController.getCrydrControllerAddress(network, 'jGDR')));


/* Migration */

module.exports = (deployer, network, accounts) => {
  const owner   = accounts[1];
  const manager = accounts[2];

  global.console.log('  Start migration');
  deployer
    .then(() => migrationRoutine(network, owner, manager))
    .then(() => verifyRoutine(network));
};
