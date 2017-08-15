const crydrStorageGeneralRoutines = require('./storage/CrydrStorageGeneral');
const crydrControllerRoutines     = require('./controller/CrydrControllerBaseInterface');
const crydrViewRoutines           = require('./view/CrydrViewBaseInterface');
const CryDRRegistryRoutines       = require('../registry/CryDRRegistry');

const CryDRRegistry = global.artifacts.require('CryDRRegistry.sol');


export const deployCrydrContracts = async (deployer, owner,
                                           crydrStorageContractArtifact,
                                           crydrControllerContractArtifact,
                                           viewStandardToContractArtifact) => {
  global.console.log('\tDeploying components of a crydr');
  await crydrStorageGeneralRoutines.deployCrydrStorage(deployer, crydrStorageContractArtifact, owner);
  await crydrControllerRoutines.deployCrydrController(deployer, crydrControllerContractArtifact, owner);
  await crydrViewRoutines.deployCrydrViewsList(deployer, viewStandardToContractArtifact, owner);
  global.console.log('\tComponents of a crydr successfully deployed');
  return null;
};

export const deployAndConfigureCrydr = async (deployer, owner, manager,
                                              crydrSymbol, crydrName,
                                              crydrStorageContractArtifact,
                                              crydrControllerContractArtifact,
                                              viewStandardToContractArtifact,
                                              isConnectToInvestorRegistry,
                                              isConnectToJNT, jntPrices) => {
  global.console.log(`\tStart to deploy and configure crydr ${crydrSymbol}`);
  await deployCrydrContracts(deployer, owner,
                             crydrStorageContractArtifact,
                             crydrControllerContractArtifact,
                             viewStandardToContractArtifact);

  const crydrStorageInstance          = await crydrStorageContractArtifact.deployed();
  const crydrControllerInstance       = await crydrControllerContractArtifact.deployed();
  const viewStandardToContractAddress = new Map();

  const viewStandardsArray = Array.from(viewStandardToContractArtifact.keys());
  const promisesArray      = viewStandardsArray.map(
    (viewStandardName) => viewStandardToContractArtifact.get(viewStandardName).deployed());
  const viewInstancesArray = await Promise.all(promisesArray);
  viewStandardsArray.forEach(
    (viewStandardName, i) => viewStandardToContractAddress.set(viewStandardName, viewInstancesArray[i].address));


  await crydrStorageGeneralRoutines.configureCrydrStorage(crydrStorageInstance.address, owner, manager,
                                                          crydrControllerInstance.address);

  await crydrControllerRoutines.configureCrydrController(crydrControllerInstance.address, owner, manager,
                                                         crydrStorageInstance.address,
                                                         viewStandardToContractAddress,
                                                         isConnectToInvestorRegistry,
                                                         isConnectToJNT, jntPrices);

  const viewsConfiguration = Array.from(viewStandardToContractAddress.values()).map(
    async (viewAddress) => {
      await crydrViewRoutines.configureCrydrView(viewAddress, owner, manager,
                                                 crydrControllerInstance.address);
    });
  await Promise.all(viewsConfiguration);


  const crydrRegistryInstance = await CryDRRegistry.deployed();
  await CryDRRegistryRoutines.registerCrydr(crydrRegistryInstance.address, manager,
                                            crydrSymbol, crydrName, crydrControllerInstance.address);

  global.console.log(`\tCrydr ${crydrSymbol} successfully deployed and configured`);
  return null;
};

// todo register crydr in registry
