import { submitTxAndWaitConfirmation } from '../../../routine/misc/SubmitTx';

const Ownable           = global.artifacts.require('Ownable.sol');

const UtilsTestRoutines = require('../../../routine/misc/UtilsTest');


global.contract('Ownable', (accounts) => {
  const owner01 = accounts[1];
  const owner02 = accounts[2];
  const owner03 = accounts[3];
  let ownableContract;

  global.beforeEach(async () => {
    ownableContract = await Ownable.new({ from: owner01 });
  });

  global.it('should have an owner', async () => {
    const contractOwner = await ownableContract.owner();
    global.assert.strictEqual(contractOwner, owner01);
  });

  global.it('changes owner after transfer', async () => {
    await submitTxAndWaitConfirmation(ownableContract.transferOwnership.sendTransaction, [owner02, { from: owner01 }]);

    const contractOwner = await ownableContract.owner.call();

    global.assert.strictEqual(contractOwner, owner02);
  });

  global.it('should prevent non-owners from transfering', async () => {
    const contractOwner = await ownableContract.owner.call();
    global.assert.notStrictEqual(contractOwner, owner03);

    await UtilsTestRoutines.checkContractThrows(ownableContract.transferOwnership.sendTransaction,
                                                [owner03, { from: owner03 }],
                                                'It should not be possible to transfer ownership');
  });

  global.it('should guard ownership against stuck state', async () => {
    let contractOwner = await ownableContract.owner.call();

    await submitTxAndWaitConfirmation(ownableContract.transferOwnership.sendTransaction, [0, { from: contractOwner }]);
    contractOwner = await ownableContract.owner.call();

    global.assert.notStrictEqual(contractOwner, 0, 'It should not be possible to transfer ownership');
  });
});
