import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as CrydrViewBaseJSAPI from '../../contracts/crydr/view/CrydrViewBase/CrydrViewBase.jsapi';
import * as CrydrViewERC20NamedJSAPI from '../../contracts/crydr/view/CrydrViewERC20Named/CrydrViewERC20Named.jsapi';

import * as DeployConfig from '../jsconfig/DeployConfig';

import * as DeployUtils from '../util/DeployUtils';


export const deployCrydrView = async (crydrViewContractArtifact, contractOwner) => {
  global.console.log('\tDeploying view of a crydr.');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(crydrViewContractArtifact, contractOwner);

  global.console.log(`\tView of a crydr successfully deployed: ${contractAddress}`);
  return null;
};

export const configureCrydrViewManagers = async (crydrViewAddress) => {
  global.console.log('\tConfiguring managers of crydr view...');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);

  const { owner, managerPause, managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerPause - ${managerPause}`);
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await Promise.all(
    [
      await PausableJSAPI.grantManagerPermissions(crydrViewAddress, owner, managerPause),
      await ManageableJSAPI.enableManager(crydrViewAddress, owner, managerPause),

      await CrydrViewBaseJSAPI.grantManagerPermissions(crydrViewAddress, owner, managerGeneral),
      await CrydrViewERC20NamedJSAPI.grantManagerPermissions(crydrViewAddress, owner, managerGeneral),
      await ManageableJSAPI.enableManager(crydrViewAddress, owner, managerGeneral),
    ]
  );

  global.console.log('\tManagers of crydr view successfully configured');
  return null;
};
