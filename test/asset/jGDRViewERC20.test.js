/* eslint-disable no-multi-spaces */

global.artifacts = artifacts; // eslint-disable-line no-undef

const CrydrERC20ValidatableInterface = global.artifacts.require('CrydrERC20ValidatableInterface.sol');
const jGDRViewERC20                  = global.artifacts.require('jGDRViewERC20.sol');
const jGDRViewERC20Validatable       = global.artifacts.require('jGDRViewERC20Validatable.sol');
const JNTViewERC20                   = global.artifacts.require('JNTViewERC20.sol');


global.contract('jGDRViewERC20Instance', (accounts) => {
  const investor01 = accounts[3];
  const investor02 = accounts[4];
  const investor03 = accounts[5];
  const investor04 = accounts[6];

  global.it('should test that it is possible to receive admittance data', async () => {
    const jGDRViewERC20ValidatableInstance = await jGDRViewERC20Validatable.deployed();
    const jGDRViewERC20ValidatableAddress = jGDRViewERC20ValidatableInstance.address;
    const ValidatableInstance  = CrydrERC20ValidatableInterface.at(jGDRViewERC20ValidatableAddress);

    let isReceivingAllowed = await ValidatableInstance.isReceivingAllowed.call(investor01, 0);
    let isSpendingAllowed  = await ValidatableInstance.isSpendingAllowed.call(investor01, 0);
    global.assert.strictEqual(isReceivingAllowed, true);
    global.assert.strictEqual(isSpendingAllowed, true);

    isReceivingAllowed = await ValidatableInstance.isReceivingAllowed.call(investor02, 0);
    isSpendingAllowed  = await ValidatableInstance.isSpendingAllowed.call(investor02, 0);
    global.assert.strictEqual(isReceivingAllowed, true);
    global.assert.strictEqual(isSpendingAllowed, true);

    isReceivingAllowed = await ValidatableInstance.isReceivingAllowed.call(investor03, 0);
    isSpendingAllowed  = await ValidatableInstance.isSpendingAllowed.call(investor03, 0);
    global.assert.strictEqual(isReceivingAllowed, true);
    global.assert.strictEqual(isSpendingAllowed, true);

    isReceivingAllowed = await ValidatableInstance.isReceivingAllowed.call(investor04, 0);
    isSpendingAllowed  = await ValidatableInstance.isSpendingAllowed.call(investor04, 0);
    global.assert.strictEqual(isReceivingAllowed, false);
    global.assert.strictEqual(isSpendingAllowed, false);
  });

  global.it('should test that only licensed investor is able to receive tokens', async () => {
    const JNTViewERC20Instance = await JNTViewERC20.deployed();
    const jGDRViewERC20Instance = await jGDRViewERC20.deployed();


    let balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    let balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    let balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    let balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jGDRViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jGDRViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jGDRViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jGDRViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 0);
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 0);
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 0);


    await jGDRViewERC20Instance.transfer.sendTransaction(investor02, 10 * (10 ** 18),
                                                         { from: investor01, gas: 1000000 });

    balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 999 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jGDRViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jGDRViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jGDRViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jGDRViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 990 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 10 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 0);
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 0);

    let isCaught = false;
    try {
      await jGDRViewERC20Instance.transfer.sendTransaction(investor04, 5 * (10 ** 18), { from: investor02 });
    } catch (err) {
      if (err.message.includes('is not a function')) { throw err; }
      isCaught = true;
    }
    global.assert.strictEqual(isCaught, true);

    balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 999 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jGDRViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jGDRViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jGDRViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jGDRViewERC20Instance.balanceOf.call(investor04);
    global.assert.strictEqual(balanceOfInvestor01.toNumber(), 990 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor02.toNumber(), 10 * (10 ** 18));
    global.assert.strictEqual(balanceOfInvestor03.toNumber(), 0);
    global.assert.strictEqual(balanceOfInvestor04.toNumber(), 0);
  });
});
