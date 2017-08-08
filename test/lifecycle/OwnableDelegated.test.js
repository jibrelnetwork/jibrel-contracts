const OwnableDelegated = global.artifacts.require('OwnableDelegated.sol');


global.contract('OwnableDelegated', (accounts) => {
  let ownableDelegatetContract;

  const owner1 = accounts[0];
  const owner2 = accounts[1];

  global.beforeEach(async () => {
    ownableDelegatetContract = await OwnableDelegated.new(owner1);
  });

  global.it('check OwnableDelegated cntract', async () => {

    global.console.log(`\townableDelegatetContract: ${ownableDelegatetContract.address}`);
    global.assert.equal(ownableDelegatetContract.address == 0x0, false);

    let contractOwner = await ownableDelegatetContract.getOwner.call();
    global.assert.equal(contractOwner, owner1);

    await ownableDelegatetContract.transferOwnership.sendTransaction(owner2, { from: owner1 });
    contractOwner = await ownableDelegatetContract.getOwner.call();
    global.assert.equal(contractOwner, owner2);

    let isTrowWrongOwner = false;
    await ownableDelegatetContract.transferOwnership.sendTransaction(owner1, { from: owner1 }).catch(() => {
      isTrowWrongOwner = true;
    });
    contractOwner = await ownableDelegatetContract.getOwner.call();
    global.assert.equal(isTrowWrongOwner == true && contractOwner == owner2, true, 'It should throw an exception if transferOwnership called by any account other than the owner');
  });
});
