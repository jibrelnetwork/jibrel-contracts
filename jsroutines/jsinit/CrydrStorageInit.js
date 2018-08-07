import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as CrydrStorageBaseJSAPI from '../../contracts/crydr/storage/CrydrStorageBase/CrydrStorageBase.jsapi';

import * as DeployConfig from '../jsconfig/DeployConfig';

import * as DeployUtils from '../util/DeployUtils';


export const deployCrydrStorage = async (crydrStorageContractArtifact, contractOwner) => {
  global.console.log('\tDeploying storage of a crydr.');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(crydrStorageContractArtifact, contractOwner);

  global.console.log(`\tStorage of a crydr successfully deployed: ${contractAddress}`);

  return null;
};

export const configureCrydrStorageManagers = async (crydrStorageAddress) => {
  global.console.log('\tConfiguring managers of crydr storage...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);

  const { owner, managerPause, managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerPause - ${managerPause}`);
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await Promise.all(
    [
      await PausableJSAPI.grantManagerPermissions(crydrStorageAddress, owner, managerPause),
      await ManageableJSAPI.enableManager(crydrStorageAddress, owner, managerPause),

      await CrydrStorageBaseJSAPI.grantManagerPermissions(crydrStorageAddress, owner, managerGeneral),
      await ManageableJSAPI.enableManager(crydrStorageAddress, owner, managerGeneral),
    ]
  );

  global.console.log('\tManagers of crydr storage successfully configured');
  return null;
};
