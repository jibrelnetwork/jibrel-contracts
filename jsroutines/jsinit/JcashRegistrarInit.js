import * as DeployUtils from '../util/DeployUtils';

import * as JcashRegistrarJSAPI from '../jsapi/jcash/JcashRegistrar.jsapi';
import * as ManageableJSAPI from '../jsapi/lifecycle/Manageable';
import * as PausableJSAPI from '../jsapi/lifecycle/Pausable';
import * as JNTPayableServiceInterfaceJSAPI from '../jsapi/crydr/jnt/JNTPayableServiceInterface';
import * as JNTControllerInterfaceJSAPI from '../jsapi/crydr/jnt/JNTControllerInterface';


export const deployJcashRegistrar = async (jcashRegistrarArtifact, contractOwner) => {
  global.console.log('\tDeploying EthRegistrar');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(jcashRegistrarArtifact, contractOwner);

  global.console.log(`\tEthRegistrar successfully deployed: ${contractAddress}`);
  return null;
};

export const configureManagers = async (
  jcashRegistrarAddress, contractOwner, managerPause, managerJcashReplenisher, managerJcashExchange) => {
  global.console.log('\tConfigure managers of JcashRegistrar contract:');

  await PausableJSAPI.grantManagerPermissions(jcashRegistrarAddress, contractOwner, managerPause);
  await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerPause);

  await JcashRegistrarJSAPI.grantReplenisherPermissions(jcashRegistrarAddress, contractOwner, managerJcashReplenisher);
  await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerJcashReplenisher);

  await JcashRegistrarJSAPI.grantExchangeManagerPermissions(jcashRegistrarAddress, contractOwner, managerJcashExchange);
  await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerJcashExchange);

  global.console.log('\tManagers of JcashRegistrar contract successfully configured');
  return null;
};

export const configureJNTConnection = async (
  jcashRegistrarAddress, contractOwner, jntControllerAddress, managerJNT, jntBeneficiary, transferCost) => {
  global.console.log('\tConfigure connections JcashRegistrar<->JNTController:');

  global.console.log('\tConfigure JNT manager');
  await JNTPayableServiceInterfaceJSAPI.grantManagerPermissions(jcashRegistrarAddress, contractOwner, managerJNT);
  await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerJNT);

  global.console.log('\tConfigure contract params');
  await JNTPayableServiceInterfaceJSAPI.setJntController(jcashRegistrarAddress, managerJNT, jntControllerAddress);
  await JNTPayableServiceInterfaceJSAPI.setJntBeneficiary(jcashRegistrarAddress, managerJNT, jntBeneficiary);
  await JNTPayableServiceInterfaceJSAPI.setActionPrice(jcashRegistrarAddress, managerJNT, 'transfer_eth', transferCost);
  await JNTPayableServiceInterfaceJSAPI.setActionPrice(jcashRegistrarAddress, managerJNT, 'transfer_token', transferCost);

  global.console.log('\tAllow JcashRegistrar charge JNT');
  await JNTControllerInterfaceJSAPI.grantManagerPermissions(jntControllerAddress, contractOwner, jcashRegistrarAddress);
  await ManageableJSAPI.enableManager(jntControllerAddress, contractOwner, jcashRegistrarAddress);

  global.console.log('\tConnection JcashRegistrar<->JNTController successfully configured');
  return null;
};
