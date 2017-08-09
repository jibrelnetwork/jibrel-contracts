/* eslint-disable no-multi-spaces */
global.artifacts = artifacts;

const CrydrControllerNoLicense   = global.artifacts.require('CrydrControllerNoLicense.sol');

global.contract('CrydrControllerNoLicense', (accounts) => {
  const owner = accounts[0];
  const investor_01 = accounts[3];
  const investor_02 = accounts[4];
  const investor_03 = accounts[5];

  let CrydrControllerNoLicenseContract;

  global.beforeEach(async () => {
    CrydrControllerNoLicenseContract = await CrydrControllerNoLicense.new({ from: owner });
  });

  global.it('check member functions', async () => {

    global.assert.equal(CrydrControllerNoLicenseContract.address === 0x0, false);

    let isRegulated = await CrydrControllerNoLicenseContract.isRegulated.call();
    global.assert.equal(isRegulated,false);

    let isReceivingAllowed = await CrydrControllerNoLicenseContract.isReceivingAllowed.call(investor_01, 10 * (10 ** 18));
    global.assert.equal(isReceivingAllowed, true);

    let isSpendingAllowed = await CrydrControllerNoLicenseContract.isSpendingAllowed.call(investor_01, 10 * (10 ** 18));
    global.assert.equal(isSpendingAllowed, true);

    let isTransferAllowed = await CrydrControllerNoLicenseContract.isTransferAllowed.call(investor_01, investor_02, 10 * (10 ** 18));
    global.assert.equal(isTransferAllowed, true);

    let isApproveAllowed = await CrydrControllerNoLicenseContract.isApproveAllowed.call(investor_01, investor_02, 10 * (10 ** 18));
    global.assert.equal(isApproveAllowed, true);

    let isApprovedSpendingAllowed = await CrydrControllerNoLicenseContract.isApprovedSpendingAllowed.call(investor_01, investor_02, 10 * (10 ** 18));
    global.assert.equal(isApprovedSpendingAllowed, true);

    let isTransferFromAllowed = await CrydrControllerNoLicenseContract.isTransferFromAllowed.call(investor_01, investor_02, investor_03, 10 * (10 ** 18));
    global.assert.equal(isTransferFromAllowed, true);
  });
});
