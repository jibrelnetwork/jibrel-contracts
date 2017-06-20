const FiatToken          = artifacts.require('FiatToken.sol');

contract('FiatToken', (accounts) => {
  let fiatToken;

  const owner       = accounts[0];
  const manager     = accounts[1];
  const investor01 = accounts[2];
  const investor02 = accounts[3];
  const investor03 = accounts[4];

  beforeEach(async () => {
    fiatToken = await FiatToken.new({ from: owner });

    await fiatToken.enableManager.sendTransaction(manager, { from: owner });
    await fiatToken.grantManagerPermission.sendTransaction(manager, 'mint', { from: owner });
    await fiatToken.grantManagerPermission.sendTransaction(manager, 'burn', { from: owner });

    await fiatToken.mint.sendTransaction(investor01, 100, { from: manager });
  });

  it('should test that any investor is able to receive tokens', async () => {
    let balanceOfInvestor01;
    let balanceOfInvestor02;
    let balanceOfInvestor03;
    let isSpendingAllowed;

    balanceOfInvestor01 = await fiatToken.balanceOf.call(investor01);
    balanceOfInvestor02 = await fiatToken.balanceOf.call(investor02);
    balanceOfInvestor03 = await fiatToken.balanceOf.call(investor03);
    assert.equal(balanceOfInvestor01.toNumber(), 100);
    assert.equal(balanceOfInvestor02.toNumber(), 0);
    assert.equal(balanceOfInvestor03.toNumber(), 0);

    isSpendingAllowed = await fiatToken.isSpendingAllowed.call(investor01, investor02, 10);
    assert.equal(isSpendingAllowed, true);
    await fiatToken.transfer.sendTransaction(investor02, 10, { from: investor01 });

    balanceOfInvestor01 = await fiatToken.balanceOf.call(investor01);
    balanceOfInvestor02 = await fiatToken.balanceOf.call(investor02);
    assert.equal(balanceOfInvestor01.toNumber(), 90);
    assert.equal(balanceOfInvestor02.toNumber(), 10);

    isSpendingAllowed = await fiatToken.isSpendingAllowed.call(investor01, investor03, 10);
    assert.equal(isSpendingAllowed, true);

    await fiatToken.transfer.sendTransaction(investor03, 10, { from: investor01 });

    balanceOfInvestor01 = await fiatToken.balanceOf.call(investor01);
    balanceOfInvestor02 = await fiatToken.balanceOf.call(investor03);
    assert.equal(balanceOfInvestor01.toNumber(), 80);
    assert.equal(balanceOfInvestor02.toNumber(), 10);
  });

  // it('should test that only allowed investor is able to receive tokens', async function () {
  //   let balanceOfInvestor01;
  //   let balanceOfInvestor02;
  //   let balanceOfInvestor03;
  //   let isSpendingAllowed;
  //   let isExceptionThrown;
  //
  //   balanceOfInvestor01 = await fiatToken.balanceOf.call(investor01);
  //   balanceOfInvestor02 = await fiatToken.balanceOf.call(investor02);
  //   balanceOfInvestor03 = await fiatToken.balanceOf.call(investor03);
  //   assert.equal(balanceOfInvestor01.toNumber(), 100);
  //   assert.equal(balanceOfInvestor02.toNumber(), 0);
  //   assert.equal(balanceOfInvestor03.toNumber(), 0);
  //
  //   isSpendingAllowed = await fiatToken.isSpendingAllowed.call(investor01, investor02, 10);
  //   assert.equal(isSpendingAllowed, true);
  //   await fiatToken.transfer.sendTransaction(investor02, 10, {from: investor01});
  //
  //   balanceOfInvestor01 = await fiatToken.balanceOf.call(investor01);
  //   balanceOfInvestor02 = await fiatToken.balanceOf.call(investor02);
  //   assert.equal(balanceOfInvestor01.toNumber(), 90);
  //   assert.equal(balanceOfInvestor02.toNumber(), 10);
  //
  //   isSpendingAllowed = await fiatToken.isSpendingAllowed.call(investor01, investor03, 10);
  //   assert.equal(isSpendingAllowed, false);
  //
  //   isExceptionThrown = false;
  //   try {
  //     await fiatToken.transfer.sendTransaction(investor03, 10, {from: investor01});
  //   }
  //   catch (err) {
  //     isExceptionThrown = true;
  //   }
  //   assert.equal(isExceptionThrown, true);
  //
  //   balanceOfInvestor01 = await fiatToken.balanceOf.call(investor01);
  //   balanceOfInvestor02 = await fiatToken.balanceOf.call(investor03);
  //   assert.equal(balanceOfInvestor01.toNumber(), 90);
  //   assert.equal(balanceOfInvestor02.toNumber(), 0);
  // });
});
