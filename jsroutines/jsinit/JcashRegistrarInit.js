import * as DeployUtils from '../util/DeployUtils';

import * as JcashRegistrarJSAPI from '../jsapi/jcash/JcashRegistrar.jsapi';
import * as ManageableJSAPI from '../jsapi/lifecycle/Manageable';
import * as PausableJSAPI from '../jsapi/lifecycle/Pausable';


export const deployJcashRegistrar = async (jcashRegistrarArtifact, contractOwner) => {
  global.console.log('\tDeploying EthRegistrar');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(jcashRegistrarArtifact, contractOwner);

  global.console.log(`\tEthRegistrar successfully deployed: ${contractAddress}`);
  return null;
};

export const configureJcashRegistrar = async (jcashRegistrarAddress, contractOwner, managerPause, managerJcashReplenisher, managerJcashExchange) => {
  global.console.log('\tConfigure EthRegistrar contract:');

  global.console.log('\t\tSet manager address');
  await PausableJSAPI.grantManagerPermissions(jcashRegistrarAddress, contractOwner, managerPause);
  await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerPause);

  await JcashRegistrarJSAPI.grantReplenisherPermissions(jcashRegistrarAddress, contractOwner, managerJcashReplenisher);
  await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerJcashReplenisher);

  await JcashRegistrarJSAPI.grantExchangeManagerPermissions(jcashRegistrarAddress, contractOwner, managerJcashExchange);
  await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerJcashExchange);

  global.console.log('\t\tUnpause contract');
  await PausableJSAPI.unpauseContract(jcashRegistrarAddress, managerPause);

  global.console.log('\tJcashRegister successfully configured');
  return null;
};
