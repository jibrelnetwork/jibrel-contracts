const deploymentController = require('../deployment_controller');
const ManageableRoutines   = require('./Manageable');


// eslint-disable-next-line import/prefer-default-export
export const setJntPayableService = (network, owner, payableServiceAddress) => {
  global.console.log('\tSet JNT payable service');
  const permissions = [
    'jnt_payable_service'];
  return ManageableRoutines
    .enableManager(owner, payableServiceAddress,
                   deploymentController.getCrydrControllerAddress(network, 'JNT'))
    .then(() => ManageableRoutines
      .grantManagerPermissions(owner, payableServiceAddress,
                               deploymentController.getCrydrControllerAddress(network, 'JNT'),
                               permissions));
};


export const verifyPayableService = (network, payableServiceAddress) => {
  global.console.log('\tVerify JNTPayableService');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\tpayableService - ${payableServiceAddress}`);
  return ManageableRoutines
    .isManagerEnabled(payableServiceAddress, deploymentController.getCrydrControllerAddress(network, 'JNT'))
    .then((value) => {
      if (value !== true) { throw new Error('Expected that manager is enabled'); }
      return null;
    })
    .then(() => ManageableRoutines
      .isPermissionGranted(payableServiceAddress,
                           deploymentController.getCrydrControllerAddress(network, 'JNT'),
                           'jnt_payable_service'))
    .then((value) => {
      if (value !== true) { throw new Error('Expected that manager is granted with permission "jnt_payable_service"'); }
      return null;
    })
    .then(() => {
      global.console.log('\tJNTPayableService successfully verified');
      return null;
    });
};

