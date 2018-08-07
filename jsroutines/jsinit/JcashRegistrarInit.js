import * as DeployUtils from '../util/DeployUtils';

import * as OwnableJSAPI from '../../contracts/lifecycle/Ownable/Ownable.jsapi';
import * as OwnableInterfaceJSAPI from '../../contracts/lifecycle/Ownable/OwnableInterface.jsapi';
import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as JNTPayableServiceInterfaceJSAPI from '../../contracts/crydr/jnt/JNTPayableService/JNTPayableServiceInterface.jsapi';
import * as JNTPayableServiceJSAPI from '../../contracts/crydr/jnt/JNTPayableService/JNTPayableService.jsapi';
import * as JNTControllerJSAPI from '../../contracts/jnt/JNTController.jsapi';
import * as JcashRegistrarJSAPI from '../../contracts/jcash/JcashRegistrar/JcashRegistrar.jsapi';


export const deployJcashRegistrar = async (jcashRegistrarArtifact, contractOwner) => {
  global.console.log('\tDeploying EthRegistrar');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(jcashRegistrarArtifact, contractOwner);

  global.console.log(`\tEthRegistrar successfully deployed: ${contractAddress}`);
  return null;
};

export const configureManagers = async (
  jcashRegistrarAddress, contractOwner, managerPause, managerJcashReplenisher, managerJcashExchange) => {
  global.console.log('\tConfigure managers of JcashRegistrar contract:');

  await Promise.all(
    [
      await PausableJSAPI.grantManagerPermissions(jcashRegistrarAddress, contractOwner, managerPause),
      await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerPause),

      await JcashRegistrarJSAPI.grantReplenisherPermissions(jcashRegistrarAddress, contractOwner, managerJcashReplenisher),
      await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerJcashReplenisher),

      await JcashRegistrarJSAPI.grantExchangeManagerPermissions(jcashRegistrarAddress, contractOwner, managerJcashExchange),
      await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerJcashExchange),
    ]
  );

  global.console.log('\tManagers of JcashRegistrar contract successfully configured');
  return null;
};

export const verifyManagers = async (
  jcashRegistrarAddress, contractOwner, managerPause, managerJcashReplenisher, managerJcashExchange
) => {
  const isVerified1 = await OwnableInterfaceJSAPI.verifyOwner(jcashRegistrarAddress, contractOwner);
  const isVerified2 = await PausableJSAPI.verifyManagerPermissions(jcashRegistrarAddress, managerPause);
  const isVerified3 = await JcashRegistrarJSAPI.verifyReplenisherPermissions(jcashRegistrarAddress, managerJcashReplenisher);
  const isVerified4 = await JcashRegistrarJSAPI.verifyExchangeManagerPermissions(jcashRegistrarAddress, managerJcashExchange);

  return (isVerified1 === true
    && isVerified2 === true
    && isVerified3 === true
    && isVerified4 === true);
};

export const configureJNTConnection = async (
  jcashRegistrarAddress, contractOwner, jntControllerAddress, managerJNT, jntBeneficiary, transferCost
) => {
  global.console.log('\tConfigure connections JcashRegistrar<->JNTController:');

  global.console.log('\tConfigure JNT manager');
  await Promise.all(
    [
      await JNTPayableServiceJSAPI.grantManagerPermissions(jcashRegistrarAddress, contractOwner, managerJNT),
      await ManageableJSAPI.enableManager(jcashRegistrarAddress, contractOwner, managerJNT),
    ]
  );

  global.console.log('\tConfigure contract params');
  await Promise.all(
    [
      await JNTPayableServiceInterfaceJSAPI.setJntController(jcashRegistrarAddress, managerJNT, jntControllerAddress),
      await JNTPayableServiceInterfaceJSAPI.setJntBeneficiary(jcashRegistrarAddress, managerJNT, jntBeneficiary),
      await JNTPayableServiceInterfaceJSAPI.setActionPrice(jcashRegistrarAddress, managerJNT, 'transfer_eth', transferCost),
      await JNTPayableServiceInterfaceJSAPI.setActionPrice(jcashRegistrarAddress, managerJNT, 'transfer_token', transferCost),
    ]
  );

  global.console.log('\tAllow JcashRegistrar charge JNT');
  await Promise.all(
    [
      await JNTControllerJSAPI.grantManagerPermissions(jntControllerAddress, contractOwner, jcashRegistrarAddress),
      await ManageableJSAPI.enableManager(jntControllerAddress, contractOwner, jcashRegistrarAddress),
    ]);

  global.console.log('\tConnection JcashRegistrar<->JNTController successfully configured');
  return null;
};

export const verifyJNTConnection = async (
  jcashRegistrarAddress, jntControllerAddress, managerJNT, jntBeneficiary, transferCost
) => {
  global.console.log('\tVerify JNT manager');
  const isVerified1 = await JNTPayableServiceJSAPI.verifyManagerPermissions(jcashRegistrarAddress, managerJNT);


  global.console.log('\tVerify contract params');

  const receivedJntController = await JNTPayableServiceInterfaceJSAPI.getJntController(jcashRegistrarAddress);
  const isVerified2 = (receivedJntController === jntControllerAddress);
  if (isVerified2 !== true) {
    global.console.log(`\t\tERROR: JNT controller "${receivedJntController}" configured for the contract "${jcashRegistrarAddress}" does not match expected value "${jntControllerAddress}"`);
  }

  const receivedJntBeneficiary = await JNTPayableServiceInterfaceJSAPI.getJntBeneficiary(jcashRegistrarAddress);
  const isVerified3 = (receivedJntBeneficiary === jntBeneficiary);
  if (isVerified3 !== true) {
    global.console.log(`\t\tERROR: JNT beneficiary "${receivedJntBeneficiary}" configured for the contract "${jcashRegistrarAddress}" does not match expected value "${jntBeneficiary}"`);
  }

  const receivedTransferEthPrice = await JNTPayableServiceInterfaceJSAPI.getActionPrice(jcashRegistrarAddress, 'transfer_eth');
  const isVerified4 = (receivedTransferEthPrice.toNumber() === transferCost);
  if (isVerified4 !== true) {
    global.console.log(`\t\tERROR: Cost of ETH transfer "${receivedTransferEthPrice}" configured for the contract "${jcashRegistrarAddress}" does not match expected value "${transferCost}"`);
  }

  const receivedTransferTokenPrice = await JNTPayableServiceInterfaceJSAPI.getActionPrice(jcashRegistrarAddress, 'transfer_token');
  const isVerified5 = (receivedTransferTokenPrice.toNumber() === transferCost);
  if (isVerified5 !== true) {
    global.console.log(`\t\tERROR: Cost of token transfer "${receivedTransferEthPrice}" configured for the contract "${jcashRegistrarAddress}" does not match expected value "${transferCost}"`);
  }


  global.console.log('\tVerify that JcashRegistrar is allowed to charge JNT');
  const isVerified6 = await JNTControllerJSAPI.verifyManagerPermissions(jntControllerAddress, jcashRegistrarAddress);


  return (isVerified1 === true
    && isVerified2 === true
    && isVerified3 === true
    && isVerified4 === true
    && isVerified5 === true
    && isVerified6 === true);
};
