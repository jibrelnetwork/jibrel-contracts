// @flow

import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as CrydrLicenseRegistryManagementJSAPI from '../../contracts/crydr/license/CrydrLicenseRegistry.jsapi';

import * as TxConfig from '../jsconfig/TxConfig';
import * as SubmitTx from '../util/SubmitTx';
import * as DeployUtils from '../util/DeployUtils';


export const deployLicenseRegistry = async (licenseRegistryArtifact, ethAccounts: TxConfig.EthereumAccounts) => {
  global.console.log('\tDeploying license registry of a crydr.');

  const contractAddress = await DeployUtils.deployContract(licenseRegistryArtifact, ethAccounts.owner);
  await SubmitTx.syncTxNonceWithBlockchain(ethAccounts.owner);

  global.console.log(`\tLicense registry of a crydr successfully deployed: ${contractAddress}`);
  return contractAddress;
};

export const configureLicenseRegistryManagers = async (licenseRegistryAddress, ethAccounts: TxConfig.EthereumAccounts) => {
  global.console.log('\tConfiguring managers of license registry...');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);

  await Promise.all(
    [
      PausableJSAPI.grantManagerPermissions(licenseRegistryAddress, ethAccounts.owner, ethAccounts.managerPause),
      ManageableJSAPI.enableManager(licenseRegistryAddress, ethAccounts.owner, ethAccounts.managerPause),

      CrydrLicenseRegistryManagementJSAPI.grantManagerPermissions(licenseRegistryAddress, ethAccounts.owner, ethAccounts.managerLicense),
      ManageableJSAPI.enableManager(licenseRegistryAddress, ethAccounts.owner, ethAccounts.managerLicense),
    ]
  );
  global.console.log('\tManagers of license registry successfully configured');
  return null;
};
