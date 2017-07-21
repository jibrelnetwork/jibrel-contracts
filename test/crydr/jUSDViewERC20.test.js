/* eslint-disable no-multi-spaces */

global.artifacts = artifacts; // eslint-disable-line no-undef

const CrydrViewERC20ValidatableInterface = global.artifacts.require('CrydrViewERC20ValidatableInterface.sol');
const jUSDViewERC20                      = global.artifacts.require('jUSDViewERC20.sol');
const JNTViewERC20                       = global.artifacts.require('JNTViewERC20.sol');

const deploymentController = require('../../deployment_controller');


global.contract('jUSDViewERC20Instance', (accounts) => {
  const investor01 = accounts[3];
  const investor02 = accounts[4];
  const investor03 = accounts[5];
  const investor04 = accounts[6];

  global.it('should test that it is possible to receive admittance data', async () => {
    const jUSDViewERC20Address = deploymentController.getCrydrViewAddress(global.deployer.network, 'jUSD', 'erc20');
    const ValidatableInstance  = CrydrViewERC20ValidatableInterface.at(jUSDViewERC20Address);

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
    global.assert.equal(isReceivingAllowed, true);
    global.assert.equal(isSpendingAllowed, true);
  });

  global.it('should test that any investor is able to receive tokens', async () => {
    const JNTViewERC20Address  = deploymentController.getCrydrViewAddress(global.deployer.network, 'JNT', 'erc20');
    const JNTViewERC20Instance = JNTViewERC20.at(JNTViewERC20Address);

    const jUSDViewERC20Address  = deploymentController.getCrydrViewAddress(global.deployer.network, 'jUSD', 'erc20');
    const jUSDViewERC20Instance = jUSDViewERC20.at(jUSDViewERC20Address);


    let balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    let balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    let balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    let balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jUSDViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jUSDViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jUSDViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jUSDViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 0);
    global.assert.equal(balanceOfInvestor03.toNumber(), 0);
    global.assert.equal(balanceOfInvestor04.toNumber(), 0);


    await jUSDViewERC20Instance.transfer.sendTransaction(investor02, 10 * (10 ** 18),
                                                         { from: investor01, gas: 1000000 });

    balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 999 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jUSDViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jUSDViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jUSDViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jUSDViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 990 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 10 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 0);
    global.assert.equal(balanceOfInvestor04.toNumber(), 0);


    await jUSDViewERC20Instance.transfer.sendTransaction(investor04, 5 * (10 ** 18), { from: investor02 });

    balanceOfInvestor01 = await JNTViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await JNTViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await JNTViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await JNTViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 999 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 999 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 1000 * (10 ** 18));
    global.assert.equal(balanceOfInvestor04.toNumber(), 1000 * (10 ** 18));

    balanceOfInvestor01 = await jUSDViewERC20Instance.balanceOf.call(investor01);
    balanceOfInvestor02 = await jUSDViewERC20Instance.balanceOf.call(investor02);
    balanceOfInvestor03 = await jUSDViewERC20Instance.balanceOf.call(investor03);
    balanceOfInvestor04 = await jUSDViewERC20Instance.balanceOf.call(investor04);
    global.assert.equal(balanceOfInvestor01.toNumber(), 990 * (10 ** 18));
    global.assert.equal(balanceOfInvestor02.toNumber(), 5 * (10 ** 18));
    global.assert.equal(balanceOfInvestor03.toNumber(), 0);
    global.assert.equal(balanceOfInvestor04.toNumber(), 5 * (10 ** 18));
  });
});
