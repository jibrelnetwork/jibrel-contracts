const CrydrStorage = global.artifacts.require('CrydrStorage.sol');

const PausableTestSuite = require('../../../test_suit/lifecycle/Pausable');


global.contract('CrydrStorage is Pausable', (accounts) => {
  global.it('should test that contract is pausable and unpausable', async () => {
    await PausableTestSuite.testContractIsPausable(CrydrStorage, [], accounts);
  });
});
