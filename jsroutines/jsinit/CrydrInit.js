// @flow

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

  await Promise.all(
    [
      CrydrStorageBaseInterfaceJSAPI
        .setCrydrController(crydrStorageAddress, ethAccounts.managerGeneral, crydrControllerAddress),
      CrydrControllerBaseInterfaceJSAPI
        .setCrydrStorage(crydrControllerAddress, ethAccounts.managerGeneral, crydrStorageAddress),
    ]
  );

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

  await Promise.all(
    [
      CrydrViewBaseInterfaceJSAPI
        .setCrydrController(crydrViewAddress, ethAccounts.managerGeneral, crydrControllerAddress),
      CrydrControllerBaseInterfaceJSAPI
        .setCrydrView(crydrControllerAddress, ethAccounts.managerGeneral, crydrViewAddress, crydrViewApiStandardName),
    ]
  );

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

  global.console.log('\tDeploying and configure crydr storage');
  const crydrStorageAddress = await CrydrStorageInit.deployCrydrStorage(crydrStorageContractArtifact, ethAccounts);
  await CrydrStorageInit.configureCrydrStorageManagers(crydrStorageAddress, ethAccounts);
  global.console.log('\tCrydr storage successfully deployed and configured');

  global.console.log('\tDeploying and configure crydr controller');
  const crydrControllerAddress = await CrydrControllerInit.deployCrydrController(crydrControllerContractArtifact, ethAccounts);
  await CrydrControllerInit.configureCrydrControllerManagers(crydrControllerAddress, ethAccounts);
  global.console.log('\tCrydr storage successfully deployed and configured');

  global.console.log('\tDeploying and configure crydr view');
  const crydrViewAddress = await CrydrViewInit.deployCrydrView(crydrViewContractArtifact, ethAccounts);
  await CrydrViewInit.configureCrydrViewManagers(crydrViewAddress, ethAccounts);
  global.console.log('\tCrydr view successfully deployed and configured');


  global.console.log('\tLink crydr contracts');
  await Promise.all(
    [
      linkCrydrStorage(crydrStorageAddress, crydrControllerAddress, ethAccounts),
      linkCrydrView(crydrControllerAddress, crydrViewAddress, crydrViewApiStandardName, ethAccounts),
    ]
  );

  global.console.log('\tCrydr contracts successfully linked');

  global.console.log('\tJCash crydr successfully initialized');
  return [crydrStorageAddress, crydrControllerAddress, crydrViewAddress];
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

  const contractAddresses = await initCrydr(crydrStorageContractArtifact,
                                            crydrControllerContractArtifact,
                                            crydrViewContractArtifact,
                                            crydrViewApiStandardName,
                                            ethAccounts);
  const crydrControllerAddress = contractAddresses[1];

  global.console.log('\tDeploying license registry contract');
  const licenseRegistryAddress = await CrydrLicenseRegistryInit.deployLicenseRegistry(licenseRegistryArtifact, ethAccounts);
  global.console.log('\tLicense registry successfully deployed');

  global.console.log('\tConfiguring license managers');
  await CrydrLicenseRegistryInit.configureLicenseRegistryManagers(licenseRegistryAddress, ethAccounts);
  await CrydrControllerInit.configureCrydrControllerLicensedManagers(crydrControllerAddress, ethAccounts);
  global.console.log('\tLicense managers successfully configured');

  global.console.log('\tLink license registry and controller');
  await linkLicenseRegistry(licenseRegistryAddress, crydrControllerAddress, ethAccounts);
  global.console.log('\tLicense registry and controller successfully linked');

  global.console.log('\tLicensed JCash crydr successfully initialized');
  return [contractAddresses[0], licenseRegistryAddress, contractAddresses[1], contractAddresses[2]];
};
