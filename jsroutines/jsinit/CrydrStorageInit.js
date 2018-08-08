// @flow

import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as CrydrStorageBaseJSAPI from '../../contracts/crydr/storage/CrydrStorageBase/CrydrStorageBase.jsapi';

import { EthereumAccounts } from '../jsconfig/DeployConfig';
import * as DeployUtils from '../util/DeployUtils';


export const deployCrydrStorage = async (crydrStorageContractArtifact, ethAccounts: EthereumAccounts) => {
  global.console.log('\tDeploying storage of a crydr.');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(crydrStorageContractArtifact, ethAccounts.owner);

  global.console.log(`\tStorage of a crydr successfully deployed: ${contractAddress}`);

  return null;
};

export const configureCrydrStorageManagers = async (crydrStorageAddress, ethAccounts: EthereumAccounts) => {
  global.console.log('\tConfiguring managers of crydr storage...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);

  await Promise.all(
    [
      await PausableJSAPI.grantManagerPermissions(crydrStorageAddress, ethAccounts.owner, ethAccounts.managerPause),
      await ManageableJSAPI.enableManager(crydrStorageAddress, ethAccounts.owner, ethAccounts.managerPause),

      await CrydrStorageBaseJSAPI.grantManagerPermissions(crydrStorageAddress, ethAccounts.owner, ethAccounts.managerGeneral),
      await ManageableJSAPI.enableManager(crydrStorageAddress, ethAccounts.owner, ethAccounts.managerGeneral),
    ]
  );

  global.console.log('\tManagers of crydr storage successfully configured');
  return null;
};
