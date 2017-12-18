const Migrations = global.artifacts.require('Migrations.sol');
const JNTController = global.artifacts.require('JNTController.sol');
const JNTViewERC20 = global.artifacts.require('JNTViewERC20.sol');

const controllerMintableJSAPI = require('../../../jsroutines/jsapi/crydr/controller/CrydrControllerMintableInterface');
const ERC20InterfaceJSAPI = require('../../../jsroutines/jsapi/crydr/view/ERC20Interface');

const DeployConfig = require('../../../jsroutines/jsconfig/DeployConfig');

const CheckExceptions = require('../../../jsroutines/util/CheckExceptions');


global.contract('JNT Integration tests', (accounts) => {
  DeployConfig.setAccounts(accounts);
  const { managerGeneral, managerMint, testInvestor1, testInvestor2 } = DeployConfig.getAccounts();

  global.it('should test minting of JNT', async () => {
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const balanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);

    await controllerMintableJSAPI.mint(JNTControllerInstance.address, managerMint, testInvestor1, 15 * (10 ** 18));

    const balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    global.assert.strictEqual(balanceChanged.toNumber(), balanceInitial.toNumber() + (15 * (10 ** 18)));
  });

  global.it('should test burning of JNT', async () => {
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const balanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);

    await controllerMintableJSAPI.mint(JNTControllerInstance.address, managerMint, testInvestor1, 15 * (10 ** 18));

    let balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    global.assert.strictEqual(balanceChanged.toNumber(), balanceInitial.toNumber() + (15 * (10 ** 18)));

    await controllerMintableJSAPI.burn(JNTControllerInstance.address, managerMint, testInvestor1, 15 * (10 ** 18));

    balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    global.assert.strictEqual(balanceChanged.toNumber(), balanceInitial.toNumber());
  });

  global.it('should test minting and burning of JNT', async () => {
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    // no special meaning to use jntmanagerGeneral. Just an account without JNT
    const balanceInitial = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, managerGeneral);
    global.assert.strictEqual(balanceInitial.toNumber(), 0);

    await controllerMintableJSAPI.mint(JNTControllerInstance.address, managerMint, managerGeneral, 15 * (10 ** 18));

    let balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, managerGeneral);
    global.assert.strictEqual(balanceChanged.toNumber(), (15 * (10 ** 18)));

    await controllerMintableJSAPI.burn(JNTControllerInstance.address, managerMint, managerGeneral, 15 * (10 ** 18));

    balanceChanged = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, managerGeneral);
    global.assert.strictEqual(balanceChanged.toNumber(), 0);
  });

  global.it('should test transfers of JNT', async () => {
    const MigrationsInstance = await Migrations.deployed();
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const lastMigration = await MigrationsInstance.getLastCompletedMigration.call();

    await controllerMintableJSAPI.mint(JNTControllerInstance.address, managerMint, testInvestor1, 50 * (10 ** 18));

    const balanceInitialInvestor1 = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor1);
    const balanceInitialInvestor2 = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address, testInvestor2);

    if (lastMigration.toNumber() <= 3) {
      // erc20 not unpaused yet
      await CheckExceptions.checkContractThrows(
        ERC20InterfaceJSAPI.transfer,
        [JNTViewERC20Instance.address, testInvestor1,
         testInvestor2, 10 * (10 ** 18)],
        'Should not be possible to transfer tokens');

      const balanceChangedInvestor1 = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                          testInvestor1);
      const balanceChangedInvestor2 = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                          testInvestor2);
      global.assert.strictEqual(balanceChangedInvestor1.toNumber(),
                                balanceInitialInvestor1.toNumber());
      global.assert.strictEqual(balanceChangedInvestor2.toNumber(),
                                balanceInitialInvestor2.toNumber());
    } else {
      // erc20 view is unpaused
      await ERC20InterfaceJSAPI.transfer(JNTViewERC20Instance.address, testInvestor1,
                                         testInvestor2, 10 * (10 ** 18));

      const balanceChangedInvestor1 = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                          testInvestor1);
      const balanceChangedInvestor2 = await ERC20InterfaceJSAPI.balanceOf(JNTViewERC20Instance.address,
                                                                          testInvestor2);
      global.assert.strictEqual(balanceChangedInvestor1.toNumber(),
                                balanceInitialInvestor1.toNumber() - (10 * (10 ** 18)));
      global.assert.strictEqual(balanceChangedInvestor2.toNumber(),
                                balanceInitialInvestor2.toNumber() + (10 * (10 ** 18)));
    }
  });
});
