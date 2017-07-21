const deploymentController = require('../deployment_controller');
const crydrStorageRoutines = require('../routine/CrydrStorageBaseInterface');
const crydrControllerRoutines = require('../routine/CrydrControllerBaseInterface');
const crydrViewRoutines = require('../routine/CrydrViewBaseInterface');
const CryDRRegistryRoutines = require('../routine/CryDRRegistry');


export const deployCrydrContracts = (network, owner, crydrSymbol,
                                     crydrStorageContract, crydrControllerContract, viewStandardToContract) => {
  global.console.log(`\tDeploying components of a crydr ${crydrSymbol}`);
  return crydrStorageRoutines.deployCrydrStorage(network, owner, crydrSymbol, crydrStorageContract)
    .then(() => crydrControllerRoutines.deployCrydrController(network, owner, crydrSymbol, crydrControllerContract))
    .then(() => crydrViewRoutines.deployCrydrViewsList(network, owner, crydrSymbol, viewStandardToContract))
    .then(() => { deploymentController.logStorage(network); })
    .then(() => {
      global.console.log(`\tComponents of a crydr ${crydrSymbol} successfully deployed`);
      return null;
    });
};

export const deployAndConfigureCrydr = (network, owner, manager, crydrSymbol, crydrName,
                                        crydrStorageContract, crydrControllerContract, crydrViewERC20Contract,
                                        isConnectToInvestorRegistry, isConnectToJNT, jntPrices) => {
  global.console.log(`\tStart to deploy and configure crydr ${crydrSymbol}`);
  return deployCrydrContracts(network, owner, crydrSymbol,
                              crydrStorageContract, crydrControllerContract,
                              new Map([['erc20', crydrViewERC20Contract]]))
    .then(() => crydrStorageRoutines.configureCrydrStorage(network, owner, manager, crydrSymbol))
    .then(() => crydrControllerRoutines.configureCrydrController(network, owner, manager, crydrSymbol, ['erc20'],
                                                                 isConnectToInvestorRegistry,
                                                                 isConnectToJNT, jntPrices))
    .then(() => crydrViewRoutines.configureCrydrView(network, owner, manager, crydrSymbol, 'erc20'))
    .then(() => CryDRRegistryRoutines.registerCrydr(network, manager, crydrSymbol, crydrName))
    .then(() => {
      global.console.log(`\tCrydr ${crydrSymbol} successfully deployed and configured`);
      return null;
    });
};

// todo register crydr in registry
