import { submitTxAndWaitConfirmation } from '../../../routine/misc/SubmitTx';

const Ownable           = global.artifacts.require('Ownable.sol');

const UtilsTestRoutines = require('../../../routine/misc/UtilsTest');


global.contract('Ownable', (accounts) => {
  let ownableContract;

  global.beforeEach(async () => {
    ownableContract = await Ownable.new();
  });

  global.it('should have an owner', async () => {
    const owner = await ownableContract.owner();
    global.assert.notStrictEqual(owner, '0x0000000000000000000000000000000000000000');
  });

  global.it('changes owner after transfer', async () => {
    const other = accounts[1];

    await submitTxAndWaitConfirmation(ownableContract.transferOwnership.sendTransaction, [other]);

    const owner = await ownableContract.owner.call();

    global.assert.strictEqual(owner, other);
  });

  global.it('should prevent non-owners from transfering', async () => {
    const other = accounts[2];
    const owner = await ownableContract.owner.call();
    global.assert.notStrictEqual(owner, other);

    await UtilsTestRoutines.checkContractThrows(ownableContract.transferOwnership.sendTransaction,
                                                [other, { from: other }],
                                                'It should not be possible to transfer ownership');
  });

  global.it('should guard ownership against stuck state', async () => {
    const originalOwner = await ownableContract.owner.call();

    await UtilsTestRoutines.checkContractThrows(ownableContract.transferOwnership.sendTransaction,
                                                [null, { from: originalOwner }],
                                                'It should not be possible to transfer ownership');
  });
});
