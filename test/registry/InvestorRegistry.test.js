/* eslint-disable no-multi-spaces */
const InvestorRegistry = global.artifacts.require('InvestorRegistry.sol');

const ManageableRoutines = require('../../routine/Manageable');


global.contract('InvestorRegistry', (accounts) => {
  const owner      = accounts[0];
  const manager    = accounts[1];
  const investor01 = accounts[3];

  let InvestorRegistryContract;

  global.beforeEach(async () => {
    InvestorRegistryContract = await InvestorRegistry.new({ from: owner });
    await ManageableRoutines.enableManager(InvestorRegistryContract.address, owner, manager);
    await ManageableRoutines.grantManagerPermissions(InvestorRegistryContract.address,
                                                     owner, manager, ['admit_investor', 'deny_investor']);
  });

  global.it('check InvestorRegistry contract', async () => {
    global.console.log(`\tInvestorRegistryContract: ${InvestorRegistryContract.address}`);
    global.assert.equal(InvestorRegistryContract.address === 0x0, false);

    let isInvestorAdmitted = await InvestorRegistryContract.isInvestorAdmitted.call(investor01);
    global.assert.equal(isInvestorAdmitted, false);

    await InvestorRegistryContract.admitInvestor.sendTransaction(investor01, { from: manager });
    isInvestorAdmitted = await InvestorRegistryContract.isInvestorAdmitted.call(investor01);
    global.assert.equal(isInvestorAdmitted, true);

    await InvestorRegistryContract.denyInvestor.sendTransaction(investor01, { from: manager });
    isInvestorAdmitted = await InvestorRegistryContract.isInvestorAdmitted.call(investor01);
    global.assert.equal(isInvestorAdmitted, false);
  });
});
