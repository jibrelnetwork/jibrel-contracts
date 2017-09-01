/* eslint-disable no-multi-spaces */

global.artifacts = artifacts; // eslint-disable-line no-undef

const jUSDViewERC20 = global.artifacts.require('jUSDViewERC20.sol');
const JNTViewERC20  = global.artifacts.require('JNTViewERC20.sol');


global.contract('jUSDViewERC20Instance', async (accounts) => {
  const investor01 = accounts[3];
  const investor02 = accounts[4];
  const investor03 = accounts[5];
  const investor04 = accounts[6];

  global.it('should test that any investor is able to receive tokens', async () => {
    const JNTViewERC20Instance  = await JNTViewERC20.deployed();
    const jUSDViewERC20Instance = await jUSDViewERC20.deployed();


    let balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    let balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    let balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    let balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jUSDViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jUSDViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jUSDViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jUSDViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 0);
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 0);
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 0);


    await jUSDViewERC20Instance.transfer.sendTransaction(investor02, 10 * (10 ** 18),
                                                         { from: investor01, gas: 1000000 });

    balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 999 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jUSDViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jUSDViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jUSDViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jUSDViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 990 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 10 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 0);
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 0);


    await jUSDViewERC20Instance.transfer.sendTransaction(investor04, 5 * (10 ** 18), { from: investor02 });

    balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 999 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 999 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jUSDViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jUSDViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jUSDViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jUSDViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 990 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 5 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 0);
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 5 * (10 ** 18));
  });
});
