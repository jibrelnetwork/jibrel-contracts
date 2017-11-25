const Pausable = global.artifacts.require('Pausable.sol');
const PausableMock = global.artifacts.require('PausableMock.sol');

const ManageableJSAPI = require('../../jsapi/lifecycle/Manageable');
const PausableJSAPI   = require('../../jsapi/lifecycle/Pausable');

const PausableTestSuite = require('../../test_suit/lifecycle/Pausable');

const GlobalConfig = require('../../migrations/init/GlobalConfig');


global.contract('Pausable', (accounts) => {
  global.it('should test that contract is pausable and unpausable', async () => {
    GlobalConfig.setAccounts(accounts);

    await PausableTestSuite.testContractIsPausable(Pausable, []);
  });

  global.it('should test that modifiers work as expected', async () => {
    GlobalConfig.setAccounts(accounts);
    const { owner, managerPause } = GlobalConfig.getAccounts();

    const pausableInstance = await PausableMock.new({ from: owner });
    const pausableInstanceAddress = pausableInstance.address;

    await PausableJSAPI.grantManagerPermissions(pausableInstanceAddress, owner, managerPause);
    await ManageableJSAPI.enableManager(pausableInstanceAddress, owner, managerPause);

    let contractCounter = await pausableInstance.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 0);

    await PausableTestSuite.assertWhenContractPaused(pausableInstanceAddress,
                                                     managerPause,
                                                     pausableInstance.worksWhenContractPaused.sendTransaction);
    contractCounter = await pausableInstance.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 10);

    await PausableTestSuite.assertWhenContractNotPaused(pausableInstanceAddress,
                                                        managerPause,
                                                        pausableInstance.worksWhenContractNotPaused.sendTransaction);
    contractCounter = await pausableInstance.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 11);
  });
});
