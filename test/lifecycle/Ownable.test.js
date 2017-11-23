const Ownable = global.artifacts.require('Ownable.sol');

const CheckExceptions  = require('../../test_util/CheckExceptions');


global.contract('Ownable', (accounts) => {
  let ownableContract;

  const owner1 = accounts[0];
  const owner2 = accounts[1];
  const owner3 = accounts[2];

  global.beforeEach(async () => {
    ownableContract = await Ownable.new(owner1);
  });

  global.it('check Ownable cotract', async () => {
    global.console.log(`\townableContract: ${ownableContract.address}`);
    global.assert.notStrictEqual(ownableContract.address, '0x0000000000000000000000000000000000000000');

    let contractOwner = await ownableContract.getOwner.call();
    global.assert.strictEqual(contractOwner, owner1);

    await ownableContract.createOwnershipOffer.sendTransaction(owner2, { from: owner1 });
    await ownableContract.acceptOwnershipOffer.sendTransaction({ from: owner2 });
    contractOwner = await ownableContract.getOwner.call();
    global.assert.strictEqual(contractOwner, owner2);

    await CheckExceptions.checkContractThrows(ownableContract.createOwnershipOffer.sendTransaction,
                                              [owner3, { from: owner1 }],
                                              'Only current owner should be able to create an ownership offer');

    await CheckExceptions.checkContractThrows(ownableContract.acceptOwnershipOffer.sendTransaction,
                                              [{ from: owner1 }],
                                              'Only new owner should be able to accept an ownership offer if it has been created');

    await CheckExceptions.checkContractThrows(ownableContract.acceptOwnershipOffer.sendTransaction,
                                              [{ from: owner2 }],
                                              'Only new owner should be able to accept an ownership offer if it has been created');

    await CheckExceptions.checkContractThrows(ownableContract.acceptOwnershipOffer.sendTransaction,
                                              [{ from: owner3 }],
                                              'Only new owner should be able to accept an ownership offer if it has been created');

    await ownableContract.createOwnershipOffer.sendTransaction(owner3, { from: owner2 });

    await CheckExceptions.checkContractThrows(ownableContract.acceptOwnershipOffer.sendTransaction,
                                              [{ from: owner1 }],
                                              'Only new owner should be able to accept an ownership offer');

    await CheckExceptions.checkContractThrows(ownableContract.acceptOwnershipOffer.sendTransaction,
                                              [{ from: owner2 }],
                                              'Only new owner should be able to accept an ownership offer');
  });
});
