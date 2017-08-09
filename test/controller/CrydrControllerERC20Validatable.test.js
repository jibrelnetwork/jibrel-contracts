/* eslint-disable no-multi-spaces */
global.artifacts = artifacts;

const CrydrControllerERC20Validatable   = global.artifacts.require('CrydrControllerERC20Validatable.sol');
const InvestorRegistry                  = global.artifacts.require('InvestorRegistry.sol');

global.contract('CrydrControllerERC20Validatable', (accounts) => {
  const owner = accounts[0];
  const manager = accounts[1];

  let CrydrControllerERC20ValidatableContract;
  let InvestorRegistryContract;

  global.beforeEach(async () => {
    CrydrControllerERC20ValidatableContract = await CrydrControllerERC20Validatable.new({ from: owner });
    InvestorRegistryContract                = await InvestorRegistry.new({ from: owner });
  });

  global.it('check member functions', async () => {
    global.assert.equal(CrydrControllerERC20ValidatableContract.address === 0x0 ||
      InvestorRegistryContract.address === 0x0, false);

    let investorRegistry = await CrydrControllerERC20ValidatableContract.getInvestorsRegistry.call();
    global.assert.equal(investorRegistry, 0x0);

    await CrydrControllerERC20ValidatableContract.enableManager.sendTransaction(manager, { from: owner });
    let isManagerEnabled = await CrydrControllerBaseContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);

    let isTrow = false;
    await CrydrControllerERC20ValidatableContract.setInvestorsRegistry
      .sendTransaction(InvestorRegistryContract.address, { from: manager })
      .catch( () => {
        isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should trow an exception if the manager don\'t have \'set_investors_registry\' permission');

    await CrydrControllerERC20ValidatableContract.grantManagerPermission.sendTransaction(manager, 'set_investors_registry', { from: owner })
    isTrow = false;
    await CrydrControllerERC20ValidatableContract.setInvestorsRegistry
      .sendTransaction(0x0, { from: manager })
      .catch( () => {
        isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should trow an exception if InvestorRegistry address is invalid');

    isTrow = false;
    await CrydrControllerERC20ValidatableContract.unpause.sendTransaction().catch( () => {
      isTrow = true;
    });
    global.assert.equal(isTrow, true, 'It should throw an exception if unpause called by any account other than the manager');
    let isPaused = await CrydrControllerBaseContract.getPaused.call();
    global.assert.equal(isPaused, true);

    await CrydrControllerERC20ValidatableContract.setInvestorsRegistry
      .sendTransaction(InvestorRegistryContract.address, { from: manager });
    investorRegistry = await CrydrControllerERC20ValidatableContract.getInvestorsRegistry.call();
    global.assert.equal(investorRegistry, InvestorRegistryContract.address);

    await CrydrControllerERC20ValidatableContract.grantManagerPermission.sendTransaction(manager, 'unpause_contract', { from: owner });
    await CrydrControllerERC20ValidatableContract.unpause.sendTransaction({ from: manager });
    isPaused = await CrydrControllerERC20ValidatableContract.getPaused.call();
    global.assert.equal(isPaused, false);
  });
});
