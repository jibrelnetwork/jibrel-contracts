import { submitTxAndWaitConfirmation } from '../../routine/misc/SubmitTx';

const Pausable         = global.artifacts.require('Pausable.sol');
const PausableUnittest = global.artifacts.require('PausableUnittest.sol');

const ManageableRoutines = require('../../routine/lifecycle/Manageable');

const PausableTestSuite = require('../../test_suit/lifecycle/Pausable');


global.contract('Pausable', (accounts) => {
  global.it('should test that contract is pausable and unpausable', async () => {
    await PausableTestSuite.testContractIsPausable(Pausable, [], accounts);
  });

  global.it('should test that modifiers work as expected', async () => {
    const owner   = accounts[0];
    const manager = accounts[1];

    const pausableContract = await PausableUnittest.new({ from: owner });

    await ManageableRoutines.grantManagerPermissions(pausableContract.address, owner, manager,
                                                     ['pause_contract', 'unpause_contract']);
    await ManageableRoutines.enableManager(pausableContract.address, owner, manager);


    let contractCounter = await pausableContract.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 0);

    await PausableTestSuite.assertWhenContractPaused(pausableContract.address,
                                                     manager,
                                                     pausableContract.worksWhenContractPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 10);

    await PausableTestSuite.assertWhenContractNotPaused(pausableContract.address,
                                                        manager,
                                                        pausableContract.worksWhenContractNotPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 11);
  });
});
