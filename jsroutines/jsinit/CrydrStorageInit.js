// @flow

import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as CrydrStorageBaseJSAPI from '../../contracts/crydr/storage/CrydrStorageBase/CrydrStorageBase.jsapi';

import { EthereumAccounts } from '../jsconfig/DeployConfig';
import * as SubmitTx from '../util/SubmitTx';
import * as DeployUtils from '../util/DeployUtils';


export const deployCrydrStorage = async (crydrStorageContractArtifact, ethAccounts: EthereumAccounts) => {
  global.console.log('\tDeploying storage of a crydr.');

  const contractAddress = await DeployUtils.deployContract(crydrStorageContractArtifact, ethAccounts.owner);
  await SubmitTx.syncTxNonceWithBlockchain(ethAccounts.owner);

  global.console.log(`\tStorage of a crydr successfully deployed: ${contractAddress}`);
  return contractAddress;
};

export const configureCrydrStorageManagers = async (crydrStorageAddress, ethAccounts: EthereumAccounts) => {
  global.console.log('\tConfiguring managers of crydr storage...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);

  await Promise.all(
    [
      PausableJSAPI.grantManagerPermissions(crydrStorageAddress, ethAccounts.owner, ethAccounts.managerPause),
      ManageableJSAPI.enableManager(crydrStorageAddress, ethAccounts.owner, ethAccounts.managerPause),

      CrydrStorageBaseJSAPI.grantManagerPermissions(crydrStorageAddress, ethAccounts.owner, ethAccounts.managerGeneral),
      ManageableJSAPI.enableManager(crydrStorageAddress, ethAccounts.owner, ethAccounts.managerGeneral),
    ]
  );

  global.console.log('\tManagers of crydr storage successfully configured');
  return null;
};
