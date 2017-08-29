import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise              = require('bluebird');
const ManageableRoutines   = require('../../lifecycle/Manageable');
const PausableRoutines     = require('../../lifecycle/Pausable');

const CrydrViewBaseInterface = global.artifacts.require('CrydrViewBaseInterface.sol');


export const deployCrydrView = async (deployer, crydrViewContractArtifact, owner, viewApiStandard) => {
  global.console.log('\tDeploying view of a crydr:');
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tviewApiStandard - ${viewApiStandard}`);

  await deployer.deploy(crydrViewContractArtifact, { from: owner });

  global.console.log('\tView of a crydr successfully deployed');
  return null;
};

export const deployCrydrViewsList = async (deployer, viewStandardToContractArtifact, owner) => {
  global.console.log(`\tDeploying ${viewStandardToContractArtifact.size} views of a crydr:`);
  global.console.log(`\t\towner - ${owner}`);
  const contractPromises = [];
  viewStandardToContractArtifact.forEach((contractArtifact, standardName) => contractPromises.push(
    deployCrydrView(deployer, contractArtifact, owner, standardName)));
  await Promise.all(contractPromises);
  global.console.log('\tViews of CryDR successfully deployed');
  return null;
};

export const setControllerOfCrydrView = async (crydrViewAddress, manager, crydrControllerAddress) => {
  global.console.log('\tSet controller of CryDR view:');
  global.console.log(`\t\tview - ${crydrViewAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);

  await submitTxAndWaitConfirmation(
    CrydrViewBaseInterface
      .at(crydrViewAddress)
      .setCrydrController
      .sendTransaction,
    [crydrControllerAddress, { from: manager }]);
  global.console.log('\tController of CryDR view successfully set');
  return null;
};

export const configureCrydrView = async (crydrViewAddress, owner, manager, crydrControllerAddress) => {
  global.console.log('  Configuring view of a crydr ...');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const managerPermissions = [
    'set_crydr_controller',
    'set_crydr_storage',
    'pause_contract',
    'unpause_contract'];

  await ManageableRoutines.enableManager(crydrViewAddress, owner, manager);
  await ManageableRoutines.grantManagerPermissions(crydrViewAddress, owner, manager, managerPermissions);
  await setControllerOfCrydrView(crydrViewAddress, manager, crydrControllerAddress);
  await PausableRoutines.unpauseContract(crydrViewAddress, manager);

  global.console.log('\tView of a crydr successfully configured');
  return null;
};


/**
 * Events
 */

export const getCrydrControllerChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrViewBaseInterface
    .at(contractAddress)
    .CrydrControllerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
