const Pausable = global.artifacts.require('Pausable.sol');
const PausableMock = global.artifacts.require('PausableMock.sol');

const ManageableJSAPI = require('../../jsroutines/jsapi/lifecycle/Manageable');
const PausableJSAPI   = require('../../jsroutines/jsapi/lifecycle/Pausable');

const PausableTestSuite = require('../../jsroutines/test_suit/lifecycle/Pausable');

const DeployConfig = require('../../jsroutines/jsconfig/DeployConfig');


global.contract('Pausable', (accounts) => {
  global.it('should test that contract is pausable and unpausable', async () => {
    DeployConfig.setAccounts(accounts);

    await PausableTestSuite.testContractIsPausable(Pausable, []);
  });

  global.it('should test that modifiers work as expected', async () => {
    DeployConfig.setAccounts(accounts);
    const { owner, managerPause } = DeployConfig.getAccounts();

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
