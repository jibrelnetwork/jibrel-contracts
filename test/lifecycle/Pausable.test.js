import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableJSAPI   from '../../contracts/lifecycle/Pausable/Pausable.jsapi';

import * as TxConfig from '../../jsroutines/jsconfig/TxConfig';

import * as PausableTestSuite from '../../jsroutines/test_suit/lifecycle/Pausable';

const PausableMockV1 = global.artifacts.require('PausableMockV1.sol');
const PausableMockV2 = global.artifacts.require('PausableMockV2.sol');


global.contract('Pausable', (accounts) => {
  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();

  global.it('should test that contract is pausable and unpausable', async () => {
    await PausableTestSuite.testContractIsPausable(PausableMockV1, []);
  });

  global.it('should test that modifiers work as expected', async () => {
    const pausableInstance = await PausableMockV2.new({ from: ethAccounts.owner });
    const pausableInstanceAddress = pausableInstance.address;

    await PausableJSAPI.grantManagerPermissions(pausableInstanceAddress, ethAccounts.owner, ethAccounts.managerPause);
    await ManageableJSAPI.enableManager(pausableInstanceAddress, ethAccounts.owner, ethAccounts.managerPause);

    let contractCounter = await pausableInstance.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 0);

    await PausableTestSuite.assertWhenContractPaused(pausableInstanceAddress,
                                                     ethAccounts.managerPause,
                                                     pausableInstance.worksWhenContractPaused.sendTransaction);
    contractCounter = await pausableInstance.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 10);

    await PausableTestSuite.assertWhenContractNotPaused(pausableInstanceAddress,
                                                        ethAccounts.managerPause,
                                                        pausableInstance.worksWhenContractNotPaused.sendTransaction);
    contractCounter = await pausableInstance.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 11);
  });
});
