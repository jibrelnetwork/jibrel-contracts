// @flow

import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI from '../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as CrydrViewBaseJSAPI from '../../contracts/crydr/view/CrydrViewBase/CrydrViewBase.jsapi';
import * as CrydrViewERC20NamedJSAPI from '../../contracts/crydr/view/CrydrViewERC20Named/CrydrViewERC20Named.jsapi';

import { EthereumAccounts } from '../jsconfig/DeployConfig';
import * as DeployUtils from '../util/DeployUtils';


export const deployCrydrView = async (crydrViewContractArtifact, ethAccounts: EthereumAccounts) => {
  global.console.log('\tDeploying view of a crydr.');

  const contractAddress = await DeployUtils.deployContract(crydrViewContractArtifact, ethAccounts.owner);

  global.console.log(`\tView of a crydr successfully deployed: ${contractAddress}`);
  return contractAddress;
};

export const configureCrydrViewManagers = async (crydrViewAddress, ethAccounts: EthereumAccounts) => {
  global.console.log('\tConfiguring managers of crydr view...');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);

  await Promise.all(
    [
      PausableJSAPI.grantManagerPermissions(crydrViewAddress, ethAccounts.owner, ethAccounts.managerPause),
      ManageableJSAPI.enableManager(crydrViewAddress, ethAccounts.owner, ethAccounts.managerPause),

      CrydrViewBaseJSAPI.grantManagerPermissions(crydrViewAddress, ethAccounts.owner, ethAccounts.managerGeneral),
      CrydrViewERC20NamedJSAPI.grantManagerPermissions(crydrViewAddress, ethAccounts.owner, ethAccounts.managerGeneral),
      ManageableJSAPI.enableManager(crydrViewAddress, ethAccounts.owner, ethAccounts.managerGeneral),
    ]
  );

  global.console.log('\tManagers of crydr view successfully configured');
  return null;
};
