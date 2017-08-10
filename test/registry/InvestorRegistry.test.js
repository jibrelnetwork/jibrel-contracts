/* eslint-disable no-multi-spaces */
const InvestorRegistry      = global.artifacts.require('InvestorRegistry.sol');

global.contract('InvestorRegistry', (accounts) => {
  const owner = accounts[0];
  const manager = accounts[1];
  const investor01 = accounts[3];

  let InvestorRegistryContract;

  global.beforeEach(async () => {
    InvestorRegistryContract = await InvestorRegistry.new({ from: owner });
  });

  global.it('check InvestorRegistry contract', async () => {

    global.console.log(`\tInvestorRegistryContract: ${InvestorRegistryContract.address}`);
    global.assert.equal(InvestorRegistryContract.address === 0x0, false);

    await InvestorRegistryContract.grantManagerPermission.sendTransaction(manager, 'admit_investor', { from: owner });
    const isManagerAllowed = await InvestorRegistryContract.isManagerAllowed.call(manager, 'admit_investor');
    global.assert.equal(isManagerAllowed, false);

    let isInvestorAdmitted = await InvestorRegistryContract.isInvestorAdmitted.call(investor01);
    global.assert.equal(isInvestorAdmitted, false);

    await InvestorRegistryContract.admitInvestor.sendTransaction(investor01, { from: owner });
    isInvestorAdmitted = await InvestorRegistryContract.isInvestorAdmitted.call(investor01);
    global.assert.equal(isInvestorAdmitted, true);

    await InvestorRegistryContract.denyInvestor.sendTransaction(investor01, { from: owner });
    isInvestorAdmitted = await InvestorRegistryContract.isInvestorAdmitted.call(investor01);
    global.assert.equal(isInvestorAdmitted, false);
  });
});
