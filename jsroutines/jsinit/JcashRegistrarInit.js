// @flow

import * as OwnableInterfaceJSAPI from '../../contracts/lifecycle/Ownable/OwnableInterface.jsapi';
import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as CrydrControllerLicensedERC20JSAPI from '../../contracts/crydr/controller/CrydrControllerLicensedERC20/CrydrControllerLicensedERC20.jsapi';
import * as JNTControllerJSAPI from '../../contracts/jnt/JNTController.jsapi';
import * as JNTPayableServiceInterfaceJSAPI from '../../contracts/crydr/jnt/JNTPayableService/JNTPayableServiceInterface.jsapi';
import * as JNTPayableServiceJSAPI from '../../contracts/crydr/jnt/JNTPayableService/JNTPayableService.jsapi';
import * as JcashRegistrarJSAPI from '../../contracts/jcash/JcashRegistrar/JcashRegistrar.jsapi';

import * as DeployUtils from '../util/DeployUtils';

import * as TxConfig from '../jsconfig/TxConfig';
import * as SubmitTx from '../util/SubmitTx';


export const deployJcashRegistrar = async (jcashRegistrarArtifact, ethAccounts: TxConfig.EthereumAccounts) => {
  global.console.log('\tDeploying JcashRegistrar');

  const contractAddress = await DeployUtils.deployContract(jcashRegistrarArtifact, ethAccounts.owner);
  await SubmitTx.syncTxNonceWithBlockchain(ethAccounts.owner);

  global.console.log(`\tJcashRegistrar successfully deployed: ${contractAddress}`);
  return contractAddress;
};

export const configureManagers = async (jcashRegistrarAddress, ethAccounts: TxConfig.EthereumAccounts) => {
  global.console.log('\tConfigure managers of JcashRegistrar contract:');

  await Promise.all(
    [
      PausableJSAPI.grantManagerPermissions(jcashRegistrarAddress, ethAccounts.owner, ethAccounts.managerPause),
      ManageableJSAPI.enableManager(jcashRegistrarAddress, ethAccounts.owner, ethAccounts.managerPause),

      JcashRegistrarJSAPI.grantReplenisherPermissions(jcashRegistrarAddress, ethAccounts.owner, ethAccounts.managerJcashReplenisher),
      ManageableJSAPI.enableManager(jcashRegistrarAddress, ethAccounts.owner, ethAccounts.managerJcashReplenisher),

      JcashRegistrarJSAPI.grantExchangeManagerPermissions(jcashRegistrarAddress, ethAccounts.owner, ethAccounts.managerJcashExchange),
      ManageableJSAPI.enableManager(jcashRegistrarAddress, ethAccounts.owner, ethAccounts.managerJcashExchange),
    ]
  );

  global.console.log('\tManagers of JcashRegistrar contract successfully configured');
  return null;
};

export const verifyManagers = async (jcashRegistrarAddress, ethAccounts: TxConfig.EthereumAccounts) => {
  const isVerified1 = await OwnableInterfaceJSAPI.verifyOwner(jcashRegistrarAddress, ethAccounts.owner);
  const isVerified2 = await PausableJSAPI.verifyManagerPermissions(jcashRegistrarAddress, ethAccounts.managerPause);
  const isVerified3 = await JcashRegistrarJSAPI.verifyReplenisherPermissions(jcashRegistrarAddress, ethAccounts.managerJcashReplenisher);
  const isVerified4 = await JcashRegistrarJSAPI.verifyExchangeManagerPermissions(jcashRegistrarAddress, ethAccounts.managerJcashExchange);

  return (isVerified1 === true
    && isVerified2 === true
    && isVerified3 === true
    && isVerified4 === true);
};

export const configureJNTConnection = async (jcashRegistrarAddress, jntControllerAddress, ethAccounts: TxConfig.EthereumAccounts, transferCost) => {
  global.console.log('\tConfigure connections JcashRegistrar<->JNTController:');

  global.console.log('\tConfigure JNT manager');
  await Promise.all(
    [
      JNTPayableServiceJSAPI.grantManagerPermissions(jcashRegistrarAddress, ethAccounts.owner, ethAccounts.managerJNT),
      ManageableJSAPI.enableManager(jcashRegistrarAddress, ethAccounts.owner, ethAccounts.managerJNT),
    ]
  );

  global.console.log('\tConfigure contract params');
  await Promise.all(
    [
      JNTPayableServiceInterfaceJSAPI.setJntController(jcashRegistrarAddress, ethAccounts.managerJNT, jntControllerAddress),
      JNTPayableServiceInterfaceJSAPI.setJntBeneficiary(jcashRegistrarAddress, ethAccounts.managerJNT, ethAccounts.jntBeneficiary),
      JNTPayableServiceInterfaceJSAPI.setActionPrice(jcashRegistrarAddress, ethAccounts.managerJNT, 'transfer_eth', transferCost),
      JNTPayableServiceInterfaceJSAPI.setActionPrice(jcashRegistrarAddress, ethAccounts.managerJNT, 'transfer_token', transferCost),
    ]
  );

  global.console.log('\tAllow JcashRegistrar charge JNT');
  await Promise.all(
    [
      JNTControllerJSAPI.grantManagerPermissions(jntControllerAddress, ethAccounts.owner, jcashRegistrarAddress),
      ManageableJSAPI.enableManager(jntControllerAddress, ethAccounts.owner, jcashRegistrarAddress),
    ]
  );

  global.console.log('\tConnection JcashRegistrar<->JNTController successfully configured');
  return null;
};

export const verifyJNTConnection = async (jcashRegistrarAddress, jntControllerAddress, ethAccounts: TxConfig.EthereumAccounts, transferCost) => {
  global.console.log('\tVerify JNT manager', jcashRegistrarAddress, jntControllerAddress, ethAccounts: TxConfig.EthereumAccounts, transferCost);
  const isVerified1 = await JNTPayableServiceJSAPI.verifyManagerPermissions(jcashRegistrarAddress, ethAccounts.managerJNT);

  global.console.log('\tVerify contract params');

  const receivedJntController = await JNTPayableServiceInterfaceJSAPI.getJntController(jcashRegistrarAddress);
  const isVerified2 = (receivedJntController === jntControllerAddress);
  if (isVerified2 !== true) {
    global.console.log(`\t\tERROR: JNT controller "${receivedJntController}" configured for the contract "${jcashRegistrarAddress}" does not match expected value "${jntControllerAddress}"`);
  }

  const receivedJntBeneficiary = await JNTPayableServiceInterfaceJSAPI.getJntBeneficiary(jcashRegistrarAddress);
  const isVerified3 = (receivedJntBeneficiary === ethAccounts.jntBeneficiary);
  if (isVerified3 !== true) {
    global.console.log(`\t\tERROR: JNT beneficiary "${receivedJntBeneficiary}" configured for the contract "${jcashRegistrarAddress}" does not match expected value "${ethAccounts.jntBeneficiary}"`);
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

export const configureJcashTokenLicenses = async (jcashRegistrarAddress, tokenLicenseRegistryAddress, ethAccounts: TxConfig.EthereumAccounts) => {
  global.console.log('\tConfigure token licenses for JcashRegistrar and replenisher:');

  await Promise.all(
    [
      CrydrControllerLicensedERC20JSAPI.grantUserLicensesAndAdmit(tokenLicenseRegistryAddress,
                                                                  ethAccounts.managerLicense,
                                                                  jcashRegistrarAddress),
      CrydrControllerLicensedERC20JSAPI.grantUserLicensesAndAdmit(tokenLicenseRegistryAddress,
                                                                  ethAccounts.managerLicense,
                                                                  ethAccounts.managerJcashReplenisher),
    ]
  );

  global.console.log('\tToken licenses for JcashRegistrar and replenisher successfully configured');
  return null;
};
