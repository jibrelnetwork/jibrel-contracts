const InvestorRepository = artifacts.require('InvestorRepository.sol');

contract('InvestorRepository', (accounts) => {
  let investorsRepo;

  const owner      = accounts[0];
  const manager    = accounts[1];
  const investor01 = accounts[2];

  beforeEach(async () => {
    investorsRepo = await InvestorRepository.new({ from: owner });
    await investorsRepo.enableManager.sendTransaction(manager, { from: owner });
    await investorsRepo.grantManagerPermission.sendTransaction(manager, 'enable_investor', { from: owner });
    await investorsRepo.grantManagerPermission.sendTransaction(manager, 'disable_investor', { from: owner });
    await investorsRepo.grantManagerPermission.sendTransaction(manager, 'grant_license', { from: owner });
    await investorsRepo.grantManagerPermission.sendTransaction(manager, 'cancel_license', { from: owner });
  });

  it('should add investor, licenses and check permissions', async () => {
    let isInvestorAdmitted;
    let isInvestorGranted;

    isInvestorAdmitted = await investorsRepo.isInvestorAdmitted.call(investor01);
    assert.equal(isInvestorAdmitted, false);
    await investorsRepo.admitInvestor.sendTransaction(investor01, { from: manager });
    isInvestorAdmitted = await investorsRepo.isInvestorAdmitted.call(investor01);
    assert.equal(isInvestorAdmitted, true);

    isInvestorGranted = await investorsRepo.isInvestorGranted.call(investor01, 'license_01');
    assert.equal(isInvestorGranted, false);
    await investorsRepo.grantInvestorLicense.sendTransaction(investor01, 'license_01', { from: manager });
    isInvestorGranted = await investorsRepo.isInvestorGranted.call(investor01, 'license_01');
    assert.equal(isInvestorGranted, true);

    isInvestorGranted = await investorsRepo.isInvestorGranted.call(investor01, 'license_02');
    assert.equal(isInvestorGranted, false);
    await investorsRepo.grantInvestorLicense.sendTransaction(investor01, 'license_02', { from: manager });
    isInvestorGranted = await investorsRepo.isInvestorGranted.call(investor01, 'license_02');
    assert.equal(isInvestorGranted, true);

    isInvestorGranted = await investorsRepo.isInvestorGranted.call(investor01, 'license_02');
    assert.equal(isInvestorGranted, true);
    await investorsRepo.cancelInvestorLicense.sendTransaction(investor01, 'license_02', { from: manager });
    isInvestorGranted = await investorsRepo.isInvestorGranted.call(investor01, 'license_02');
    assert.equal(isInvestorGranted, false);

    isInvestorGranted = await investorsRepo.isInvestorGranted.call(investor01, 'license_01');
    assert.equal(isInvestorGranted, true);
    isInvestorAdmitted = await investorsRepo.isInvestorAdmitted.call(investor01);
    assert.equal(isInvestorAdmitted, true);
    await investorsRepo.denyInvestor.sendTransaction(investor01, 'license_02', { from: manager });
    isInvestorGranted = await investorsRepo.isInvestorGranted.call(investor01, 'license_01');
    assert.equal(isInvestorGranted, false);
    isInvestorAdmitted = await investorsRepo.isInvestorAdmitted.call(investor01);
    assert.equal(isInvestorAdmitted, false);
  });
});
