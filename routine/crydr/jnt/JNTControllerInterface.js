const ManageableRoutines   = require('../../lifecycle/Manageable');


// eslint-disable-next-line import/prefer-default-export
export const setJntPayableService = async (jntControllerAddress, owner, payableServiceAddress) => {
  global.console.log('\tSet JNT payable service');
  global.console.log(`\t\tjntControllerAddress - ${jntControllerAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tpayableServiceAddress - ${payableServiceAddress}`);
  const permissions = ['jnt_payable_service'];
  await ManageableRoutines.enableManager(jntControllerAddress, owner, payableServiceAddress);
  await ManageableRoutines.grantManagerPermissions(jntControllerAddress, owner, payableServiceAddress, permissions);
};


export const verifyPayableService = async (jntControllerAddress, payableServiceAddress) => {
  global.console.log('\tVerify JNTPayableService');
  global.console.log(`\t\tjntControllerAddress - ${jntControllerAddress}`);
  global.console.log(`\t\tpayableService - ${payableServiceAddress}`);

  const isEnabled = await ManageableRoutines.isManagerEnabled(jntControllerAddress, payableServiceAddress);
  if (isEnabled !== true) { throw new Error('Expected that manager is enabled'); }
  const isGranted = await ManageableRoutines.isPermissionGranted(jntControllerAddress,
                                                                 payableServiceAddress,
                                                                 'jnt_payable_service');
  if (isGranted !== true) { throw new Error('Expected that manager is granted with permission "jnt_payable_service"'); }
  global.console.log('\tJNTPayableService successfully verified');
  return null;
};

