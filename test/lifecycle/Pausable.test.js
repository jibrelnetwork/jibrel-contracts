const Pausable = global.artifacts.require('Pausable.sol');
const PausableMock = global.artifacts.require('PausableMock.sol');

const ManageableJSAPI = require('../../jsapi/lifecycle/Manageable');

const PausableTestSuite = require('../../test_suit/lifecycle/Pausable');


global.contract('Pausable', (accounts) => {
  global.it('should test that contract is pausable and unpausable', async () => {
    await PausableTestSuite.testContractIsPausable(Pausable, [], accounts);
  });

  global.it('should test that modifiers work as expected', async () => {
    const ownerAddress   = accounts[0];
    const managerAddress = accounts[1];

    const pausableContract = await PausableMock.new({ from: ownerAddress });

    await ManageableJSAPI.grantManagerPermissions(pausableContract.address, ownerAddress, managerAddress,
                                                  ['pause_contract', 'unpause_contract']);
    await ManageableJSAPI.enableManager(pausableContract.address, ownerAddress, managerAddress);


    let contractCounter = await pausableContract.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 0);

    await PausableTestSuite.assertWhenContractPaused(pausableContract.address,
                                                     managerAddress,
                                                     pausableContract.worksWhenContractPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 10);

    await PausableTestSuite.assertWhenContractNotPaused(pausableContract.address,
                                                        managerAddress,
                                                        pausableContract.worksWhenContractNotPaused.sendTransaction);
    contractCounter = await pausableContract.counter.call();
    global.assert.strictEqual(contractCounter.toNumber(), 11);
  });
});
