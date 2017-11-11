const OwnableDelegated = global.artifacts.require('OwnableDelegated.sol');

const UtilsTestRoutines  = require('../../routine/misc/UtilsTest');


global.contract('OwnableDelegated', (accounts) => {
  let ownableDelegatetContract;

  const owner1 = accounts[0];
  const owner2 = accounts[1];
  const owner3 = accounts[2];

  global.beforeEach(async () => {
    ownableDelegatetContract = await OwnableDelegated.new(owner1);
  });

  global.it('check OwnableDelegated cntract', async () => {

    global.console.log(`\townableDelegatetContract: ${ownableDelegatetContract.address}`);
    global.assert.notStrictEqual(ownableDelegatetContract.address, '0x0000000000000000000000000000000000000000');

    let contractOwner = await ownableDelegatetContract.getOwner.call();
    global.assert.strictEqual(contractOwner, owner1);

    await ownableDelegatetContract.createOwnershipOffer.sendTransaction(owner2, { from: owner1 });
    await ownableDelegatetContract.acceptOwnershipOffer.sendTransaction({ from: owner2 });
    contractOwner = await ownableDelegatetContract.getOwner.call();
    global.assert.strictEqual(contractOwner, owner2);

    await UtilsTestRoutines.checkContractThrows(ownableDelegatetContract.createOwnershipOffer.sendTransaction,
                                                [owner3, { from: owner1 }],
                                                'Only current owner should be able to create an ownership offer');

    await UtilsTestRoutines.checkContractThrows(ownableDelegatetContract.acceptOwnershipOffer.sendTransaction,
                                                [{ from: owner1 }],
                                                'Only new owner should be able to accept an ownership offer if it has been created');

    await UtilsTestRoutines.checkContractThrows(ownableDelegatetContract.acceptOwnershipOffer.sendTransaction,
                                                [{ from: owner2 }],
                                                'Only new owner should be able to accept an ownership offer if it has been created');

    await UtilsTestRoutines.checkContractThrows(ownableDelegatetContract.acceptOwnershipOffer.sendTransaction,
                                                [{ from: owner3 }],
                                                'Only new owner should be able to accept an ownership offer if it has been created');

    await ownableDelegatetContract.createOwnershipOffer.sendTransaction(owner3, { from: owner2 });

    await UtilsTestRoutines.checkContractThrows(ownableDelegatetContract.acceptOwnershipOffer.sendTransaction,
                                                [{ from: owner1 }],
                                                'Only new owner should be able to accept an ownership offer');

    await UtilsTestRoutines.checkContractThrows(ownableDelegatetContract.acceptOwnershipOffer.sendTransaction,
                                                [{ from: owner2 }],
                                                'Only new owner should be able to accept an ownership offer');
  });
});
