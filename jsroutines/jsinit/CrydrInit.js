// @flow

import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as CrydrStorageBaseInterfaceJSAPI from '../../contracts/crydr/storage/CrydrStorageBase/CrydrStorageBaseInterface.jsapi';
import * as CrydrControllerBaseInterfaceJSAPI from '../../contracts/crydr/controller/CrydrControllerBase/CrydrControllerBaseInterface.jsapi';
import * as CrydrControllerLicensedBaseInterfaceJSAPI from '../../contracts/crydr/controller/CrydrControllerLicensedBase/CrydrControllerLicensedBaseInterface.jsapi';
import * as CrydrViewBaseInterfaceJSAPI from '../../contracts/crydr/view/CrydrViewBase/CrydrViewBaseInterface.jsapi';

import { EthereumAccounts } from '../jsconfig/DeployConfig';

import * as CrydrStorageInit from './CrydrStorageInit';
import * as CrydrLicenseRegistryInit from './CrydrLicenseRegistryInit';
import * as CrydrControllerInit from './CrydrControllerInit';
import * as CrydrViewInit from './CrydrViewInit';


export const linkCrydrStorage = async (
  crydrStorageAddress,
  crydrControllerAddress,
  ethAccounts: EthereumAccounts
) => {
  global.console.log('\tLink crydr storage to controller...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  await CrydrStorageBaseInterfaceJSAPI
    .setCrydrController(crydrStorageAddress, ethAccounts.managerGeneral, crydrControllerAddress);
  await CrydrControllerBaseInterfaceJSAPI
    .setCrydrStorage(crydrControllerAddress, ethAccounts.managerGeneral, crydrStorageAddress);

  global.console.log('\tCrydr storage successfully linked');
  return null;
};

export const linkCrydrView = async (
  crydrControllerAddress,
  crydrViewAddress,
  crydrViewApiStandardName,
  ethAccounts: EthereumAccounts
) => {
  global.console.log('\tLink crydr view to controller...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);

  await CrydrViewBaseInterfaceJSAPI
    .setCrydrController(crydrViewAddress, ethAccounts.managerGeneral, crydrControllerAddress);
  await CrydrControllerBaseInterfaceJSAPI
    .setCrydrView(crydrControllerAddress, ethAccounts.managerGeneral, crydrViewAddress, crydrViewApiStandardName);

  global.console.log('\tCrydr view successfully linked');
  return null;
};

export const linkLicenseRegistry = async (
  licenseRegistryAddress,
  crydrControllerAddress,
  ethAccounts: EthereumAccounts
) => {
  global.console.log('\tLink license registry and controller...');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  await CrydrControllerLicensedBaseInterfaceJSAPI
    .setLicenseRegistry(crydrControllerAddress, ethAccounts.managerGeneral, licenseRegistryAddress);

  global.console.log('\tLicense registry and controller successfully linked');
  return null;
};


export const initCrydr = async (
  crydrStorageContractArtifact,
  crydrControllerContractArtifact,
  crydrViewContractArtifact,
  crydrViewApiStandardName,
  ethAccounts: EthereumAccounts
) => {
  global.console.log('\tDeploy and init JCash crydr...');
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);

  global.console.log('\tDeploying crydr contracts');
  await CrydrStorageInit.deployCrydrStorage(crydrStorageContractArtifact, ethAccounts);
  await CrydrControllerInit.deployCrydrController(crydrControllerContractArtifact, ethAccounts);
  await CrydrViewInit.deployCrydrView(crydrViewContractArtifact, ethAccounts);
  global.console.log('\tCrydr contracts successfully deployed');

  const crydrStorageInstance = await crydrStorageContractArtifact.deployed();
  const crydrStorageAddress = crydrStorageInstance.address;
  const crydrControllerInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerAddress = crydrControllerInstance.address;
  const crydrViewInstance = await crydrViewContractArtifact.deployed();
  const crydrViewAddress = crydrViewInstance.address;

  global.console.log('\tConfiguring crydr managers');
  await CrydrStorageInit.configureCrydrStorageManagers(crydrStorageAddress, ethAccounts);
  await CrydrControllerInit.configureCrydrControllerManagers(crydrControllerAddress, ethAccounts);
  await CrydrViewInit.configureCrydrViewManagers(crydrViewAddress, ethAccounts);
  global.console.log('\tCrydr managers successfully configured');

  global.console.log('\tLink crydr contracts');
  await linkCrydrStorage(crydrStorageAddress, crydrControllerAddress, ethAccounts);
  await linkCrydrView(crydrControllerAddress, crydrViewAddress, crydrViewApiStandardName, ethAccounts);
  global.console.log('\tCrydr contracts successfully linked');

  global.console.log('\tJCash crydr successfully initialized');
  return null;
};

export const initLicensedCrydr = async (
  crydrStorageContractArtifact,
  licenseRegistryArtifact,
  crydrControllerContractArtifact,
  crydrViewContractArtifact,
  crydrViewApiStandardName,
  ethAccounts: EthereumAccounts
) => {
  global.console.log('\tDeploy and init licensed JCash crydr...');

  await initCrydr(crydrStorageContractArtifact,
                  crydrControllerContractArtifact,
                  crydrViewContractArtifact,
                  crydrViewApiStandardName,
                  ethAccounts);

  global.console.log('\tDeploying license registry contract');
  await CrydrLicenseRegistryInit.deployLicenseRegistry(licenseRegistryArtifact, ethAccounts);
  global.console.log('\tLicense registry successfully deployed');

  const licenseRegistryInstance = await licenseRegistryArtifact.deployed();
  const licenseRegistryAddress = licenseRegistryInstance.address;
  const crydrControllerInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerAddress = crydrControllerInstance.address;

  global.console.log('\tConfiguring license managers');
  await CrydrLicenseRegistryInit.configureLicenseRegistryManagers(licenseRegistryAddress, ethAccounts);
  await CrydrControllerInit.configureCrydrControllerLicensedManagers(crydrControllerAddress, ethAccounts);
  global.console.log('\tLicense managers successfully configured');

  global.console.log('\tLink license registry and controller');
  await linkLicenseRegistry(licenseRegistryAddress, crydrControllerAddress, ethAccounts);
  global.console.log('\tLicense registry and controller successfully linked');

  global.console.log('\tLicensed JCash crydr successfully initialized');
  return null;
};


export const upauseCrydrContract = async (crydrContractArtifact, contractType, ethAccounts: EthereumAccounts) => {
  global.console.log(`\tUnpause ${contractType} of JCash crydr...`);

  const crydrContractInstance = await crydrContractArtifact.deployed();
  const crydrContractAddress = crydrContractInstance.address;

  await PausableJSAPI.unpauseContract(crydrContractAddress, ethAccounts.managerPause);

  global.console.log(`\t${contractType} of JCash crydr successfully unpaused`);
  return null;
};
