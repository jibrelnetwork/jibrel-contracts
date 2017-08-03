require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/utils/GlobalConfig');
const SubmitTx = require('../routine/utils/SubmitTx');

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

const JNTController                  = global.artifacts.require('JNTController.sol');

const crydrGeneralRoutines           = require('../routine/CrydrGeneral');
const JNTControllerInterfaceRoutines = require('../routine/JNTControllerInterface');


/* Deploy and configure fiat CryDRs */

const jntPrices = new Map(
  [['transfer', Math.pow(10, 18)], ['transferFrom', Math.pow(10, 18)], ['approve', Math.pow(10, 18)]]); // eslint-disable-line no-restricted-properties

const deployJUSD = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jUSD', 'United States dollar',
                                               jUSDStorage, jUSDController, jUSDViewERC20,
                                               false, true, jntPrices);

const deployJEUR = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jEUR', 'Euro',
                                               jEURStorage, jEURController, jEURViewERC20,
                                               false, true, jntPrices);

const deployJGBP = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jGBP', 'Pound sterling',
                                               jGBPStorage, jGBPController, jGBPViewERC20,
                                               false, true, jntPrices);

const deployJAED = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jAED', 'United Arab Emirates dirham',
                                               jAEDStorage, jAEDController, jAEDViewERC20,
                                               false, true, jntPrices);

const deployJRUB = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jRUB', 'Russian ruble',
                                               jRUBStorage, jRUBController, jRUBViewERC20,
                                               false, true, jntPrices);

const deployJCNY = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jCNY', 'Chinese yuan',
                                               jCNYStorage, jCNYController, jCNYViewERC20,
                                               false, true, jntPrices);

const deployJTBill = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jTBill', 'Treasure bill',
                                               jTBillStorage, jTBillController, jTBillViewERC20,
                                               true, true, jntPrices);

const deployJGDR = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jGDR', 'Global depositary receipt',
                                               jGDRStorage, jGDRController, jGDRViewERC20,
                                               true, true, jntPrices);


/* Migration routine */

const migrationRoutine = async (deployer, owner, manager) => {
  await deployJUSD(deployer, owner, manager);
  await deployJEUR(deployer, owner, manager);
  await deployJGBP(deployer, owner, manager);
  await deployJAED(deployer, owner, manager);
  await deployJRUB(deployer, owner, manager);
  await deployJCNY(deployer, owner, manager);
  await deployJTBill(deployer, owner, manager);
  await deployJGDR(deployer, owner, manager);
};

const verifyRoutine = async () => {
  global.console.log(' Verify Deployed CryDRs');

  const jntControllerInstance = await JNTController.deployed();
  const jntControllerAddress = jntControllerInstance.address;

  let payableServiceInstance;

  payableServiceInstance = await jUSDController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);

  payableServiceInstance = await jEURController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);

  payableServiceInstance = await jGBPController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);

  payableServiceInstance = await jAEDController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);

  payableServiceInstance = await jRUBController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);

  payableServiceInstance = await jCNYController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);

  payableServiceInstance = await jTBillController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);

  payableServiceInstance = await jGDRController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);
};

/* Migration */

module.exports = (deployer, network, accounts) => {
  GlobalConfig.setWeb3(web3); // eslint-disable-line no-undef
  if (network === 'development') {
    SubmitTx.setDefaultWaitParams(
      {
        minConfirmations:   0,
        pollingInterval:    50,
        maxTimeoutMillisec: 60 * 1000,
        maxTimeoutBlocks:   5,
      });
  }

  const owner   = accounts[1];
  const manager = accounts[2];

  global.console.log('  Start migration');
  global.console.log('  Accounts:');
  global.console.log(`\towner: ${owner}`);
  global.console.log(`\tmanager: ${manager}`);

  deployer
    .then(() => migrationRoutine(deployer, owner, manager))
    .then(() => verifyRoutine());
};
