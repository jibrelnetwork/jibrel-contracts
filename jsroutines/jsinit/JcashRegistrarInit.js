import * as DeployUtils from '../util/DeployUtils';

import * as JcashRegistrarJSAPI from '../jsapi/jcash/JcashRegistrar.jsapi';


export const deployJcashRegistrar = async (jcashRegistrarArtifact, contractOwner) => {
  global.console.log('\tDeploying EthRegistrar');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(jcashRegistrarArtifact, contractOwner);

  global.console.log(`\tEthRegistrar successfully deployed: ${contractAddress}`);
  return null;
};

export const configureJcashRegistrar = async (jcashRegistrarAddress, contractOwner, contractManager, contractReplenisher) => {
  global.console.log('\tConfigure EthRegistrar contract:');

  global.console.log('\t\tSet manager address');
  await JcashRegistrarJSAPI.changeManager(jcashRegistrarAddress, contractOwner, contractManager);
  global.console.log('\t\tUnpause contract');
  await JcashRegistrarJSAPI.unpause(jcashRegistrarAddress, contractOwner);
  global.console.log('\t\tSet replenisher address');
  await JcashRegistrarJSAPI.enableReplenisher(jcashRegistrarAddress, contractManager, contractReplenisher);

  global.console.log('\tEthRegister successfully configured');
  return null;
};
