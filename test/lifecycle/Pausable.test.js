const PausableMockV1 = global.artifacts.require('PausableMockV1.sol');
const PausableMockV2 = global.artifacts.require('PausableMockV2.sol');

import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI   from '../../contracts/lifecycle/Pausable/Pausable.jsapi';

import * as PausableTestSuite from '../../jsroutines/test_suit/lifecycle/Pausable';

import * as DeployConfig from '../../jsroutines/jsconfig/DeployConfig';


global.contract('Pausable', (accounts) => {
  global.it('should test that contract is pausable and unpausable', async () => {
    DeployConfig.setAccounts(accounts);

    await PausableTestSuite.testContractIsPausable(PausableMockV1, []);
  });

  global.it('should test that modifiers work as expected', async () => {
    DeployConfig.setAccounts(accounts);
    const { owner, managerPause } = DeployConfig.getAccounts();

    const pausableInstance = await PausableMockV2.new({ from: owner });
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
