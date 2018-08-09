// @flow

import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as CrydrControllerBaseJSAPI from '../../contracts/crydr/controller/CrydrControllerBase/CrydrControllerBase.jsapi';
import * as CrydrControllerBlockableJSAPI from '../../contracts/crydr/controller/CrydrControllerBlockable/CrydrControllerBlockable.jsapi';
import * as CrydrControllerMintableJSAPI from '../../contracts/crydr/controller/CrydrControllerMintable/CrydrControllerMintable.jsapi';
import * as CrydrControllerForcedTransferJSAPI from '../../contracts/crydr/controller/CrydrControllerForcedTransfer/CrydrControllerForcedTransfer.jsapi';
import * as CrydrControllerLicensedBaseJSAPI from '../../contracts/crydr/controller/CrydrControllerLicensedBase/CrydrControllerLicensedBase.jsapi';

import { EthereumAccounts } from '../jsconfig/DeployConfig';
import * as DeployUtils from '../util/DeployUtils';


export const deployCrydrController = async (crydrControllerContractArtifact, ethAccounts: EthereumAccounts) => {
  global.console.log('\tDeploying controller of a crydr');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(crydrControllerContractArtifact, ethAccounts.owner);

  global.console.log(`\tController of a crydr successfully deployed: ${contractAddress}`);
  return contractAddress;
};

export const configureCrydrControllerManagers = async (crydrControllerAddress, ethAccounts: EthereumAccounts) => {
  global.console.log('\tConfiguring managers of crydr controller...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  await Promise.all(
    [
      PausableJSAPI.grantManagerPermissions(crydrControllerAddress, ethAccounts.owner, ethAccounts.managerPause),
      ManageableJSAPI.enableManager(crydrControllerAddress, ethAccounts.owner, ethAccounts.managerPause),

      CrydrControllerBaseJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                       ethAccounts.owner, ethAccounts.managerGeneral),
      ManageableJSAPI.enableManager(crydrControllerAddress, ethAccounts.owner, ethAccounts.managerGeneral),

      CrydrControllerBlockableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                            ethAccounts.owner, ethAccounts.managerBlock),
      ManageableJSAPI.enableManager(crydrControllerAddress, ethAccounts.owner, ethAccounts.managerBlock),

      CrydrControllerMintableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                           ethAccounts.owner, ethAccounts.managerMint),
      ManageableJSAPI.enableManager(crydrControllerAddress, ethAccounts.owner, ethAccounts.managerMint),

      CrydrControllerForcedTransferJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                                 ethAccounts.owner, ethAccounts.managerForcedTransfer),
      ManageableJSAPI.enableManager(crydrControllerAddress, ethAccounts.owner, ethAccounts.managerForcedTransfer),
    ]
  );

  global.console.log('\tManagers of crydr controller successfully configured');
  return null;
};

export const configureCrydrControllerLicensedManagers = async (crydrControllerAddress, ethAccounts: EthereumAccounts) => {
  global.console.log('\tConfiguring managers of licensed crydr controller...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tethAccounts.owner - ${ethAccounts.owner}`);
  global.console.log(`\t\tethAccounts.managerGeneral - ${ethAccounts.managerGeneral}`);

  await CrydrControllerLicensedBaseJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                                 ethAccounts.owner, ethAccounts.managerGeneral);
  // assumed manager has been enabled already
  // await ManageableJSAPI.enableManager(crydrControllerAddress, ethAccounts.owner, ethAccounts.managerGeneral);

  global.console.log('\tManagers of licensed crydr controller successfully configured');
  return null;
};
