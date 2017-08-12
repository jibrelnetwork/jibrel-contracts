const crydrStorageGeneralRoutines = require('./storage/CrydrStorageGeneral');
const crydrControllerRoutines     = require('./controller/CrydrControllerBaseInterface');
const crydrViewRoutines           = require('./view/CrydrViewBaseInterface');
const CryDRRegistryRoutines       = require('../registry/CryDRRegistry');

const CryDRRegistry = global.artifacts.require('CryDRRegistry.sol');


export const deployCrydrContracts = async (deployer, owner,
                                           crydrStorageContractObject,
                                           crydrControllerContractObject,
                                           viewStandardToContractObject) => {
  global.console.log('\tDeploying components of a crydr');
  await crydrStorageGeneralRoutines.deployCrydrStorage(deployer, crydrStorageContractObject, owner);
  await crydrControllerRoutines.deployCrydrController(deployer, crydrControllerContractObject, owner);
  await crydrViewRoutines.deployCrydrViewsList(deployer, viewStandardToContractObject, owner);
  global.console.log('\tComponents of a crydr successfully deployed');
  return null;
};

export const deployAndConfigureCrydr = async (deployer, owner, manager,
                                              crydrSymbol, crydrName,
                                              crydrStorageContractObject,
                                              crydrControllerContractObject,
                                              crydrViewERC20Contract,
                                              isConnectToInvestorRegistry,
                                              isConnectToJNT, jntPrices) => {
  global.console.log(`\tStart to deploy and configure crydr ${crydrSymbol}`);
  await deployCrydrContracts(deployer, owner,
                             crydrStorageContractObject,
                             crydrControllerContractObject,
                             new Map([['erc20', crydrViewERC20Contract]]));
  const crydrStorageInstance = await crydrStorageContractObject.deployed();
  const crydrControllerInstance = await crydrControllerContractObject.deployed();
  const crydrViewERC20Instance = await crydrViewERC20Contract.deployed();

  await crydrStorageGeneralRoutines.configureCrydrStorage(crydrStorageInstance.address, owner, manager,
                                                          crydrControllerInstance.address);
  await crydrControllerRoutines.configureCrydrController(crydrControllerInstance.address, owner, manager,
                                                         crydrStorageInstance.address,
                                                         new Map([['erc20', crydrViewERC20Instance.address]]),
                                                         isConnectToInvestorRegistry,
                                                         isConnectToJNT, jntPrices);
  await crydrViewRoutines.configureCrydrView(crydrViewERC20Instance.address, owner, manager,
                                             crydrStorageInstance.address,
                                             crydrControllerInstance.address);

  const crydrRegistryInstance = await CryDRRegistry.deployed();
  await CryDRRegistryRoutines.registerCrydr(crydrRegistryInstance.address, manager,
                                            crydrSymbol, crydrName, crydrControllerInstance.address);
  global.console.log(`\tCrydr ${crydrSymbol} successfully deployed and configured`);
  return null;
};

// todo register crydr in registry
