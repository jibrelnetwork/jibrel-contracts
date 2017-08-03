/* eslint-disable no-multi-spaces */

global.artifacts = artifacts; // eslint-disable-line no-undef

const CrydrViewERC20ValidatableInterface = global.artifacts.require('CrydrViewERC20ValidatableInterface.sol');
const jGDRViewERC20                      = global.artifacts.require('jGDRViewERC20.sol');
const JNTViewERC20                       = global.artifacts.require('JNTViewERC20.sol');


global.contract('jGDRViewERC20Instance', (accounts) => {
  const investor01 = accounts[3];
  const investor02 = accounts[4];
  const investor03 = accounts[5];
  const investor04 = accounts[6];

  global.it('should test that it is possible to receive admittance data', async () => {
    const jGDRViewERC20Instance = await jGDRViewERC20.deployed();
    const jGDRViewERC20Address = jGDRViewERC20Instance.address;
    const ValidatableInstance  = CrydrViewERC20ValidatableInterface.at(jGDRViewERC20Address);

    let isReceivingAllowed = await ValidatableInstance.isReceivingAllowed.call(investor01, 0);
    let isSpendingAllowed  = await ValidatableInstance.isSpendingAllowed.call(investor01, 0);
    global.assert.equal(isReceivingAllowed, true);
    global.assert.equal(isSpendingAllowed, true);

    isReceivingAllowed = await ValidatableInstance.isReceivingAllowed.call(investor02, 0);
    isSpendingAllowed  = await ValidatableInstance.isSpendingAllowed.call(investor02, 0);
    global.assert.equal(isReceivingAllowed, true);
    global.assert.equal(isSpendingAllowed, true);

    isReceivingAllowed = await ValidatableInstance.isReceivingAllowed.call(investor03, 0);
    isSpendingAllowed  = await ValidatableInstance.isSpendingAllowed.call(investor03, 0);
    global.assert.equal(isReceivingAllowed, true);
    global.assert.equal(isSpendingAllowed, true);

    isReceivingAllowed = await ValidatableInstance.isReceivingAllowed.call(investor04, 0);
    isSpendingAllowed  = await ValidatableInstance.isSpendingAllowed.call(investor04, 0);
    global.assert.equal(isReceivingAllowed, false);
    global.assert.equal(isSpendingAllowed, false);
  });

  global.it('should test that any investor is able to receive tokens', async () => {
    const JNTViewERC20Instance = JNTViewERC20.deployed();
    const jGDRViewERC20Instance = jGDRViewERC20.deployed();


    let balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    let balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    let balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    let balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jGDRViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jGDRViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jGDRViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jGDRViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 0);
    global.assert.equal(balanceOfInvestor03.toNumber(), 0);
    global.assert.equal(balanceOfInvestor04.toNumber(), 0);


    await jGDRViewERC20Instance.transfer.sendTransaction(investor02, 10 * (10 ** 18),
                                                         { from: investor01, gas: 1000000 });

    balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 999 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jGDRViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jGDRViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jGDRViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jGDRViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 990 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 10 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 0);
    global.assert.equal(balanceOfInvestor04.toNumber(), 0);

    let isCaught = false;
    try {
      await jGDRViewERC20Instance.transfer.sendTransaction(investor04, 5 * (10 ** 18), { from: investor02 });
    } catch (err) {
      if (err.message.includes('is not a function')) { throw err; }
      isCaught = true;
    }
    global.assert.equal(isCaught, true);

    balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 999 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jGDRViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jGDRViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jGDRViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jGDRViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 990 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 10 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 0);
    global.assert.equal(balanceOfInvestor04.toNumber(), 0);
  });
});
