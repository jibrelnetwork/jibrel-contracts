const assertThrows = require('../../../jsroutines/util/assertThrows');
const { getAccounts } = require('../../../jsroutines/jsconfig/DeployConfig');

const Migrations = artifacts.require('Migrations');
const JNTController = artifacts.require('JNTController');
const JNTViewERC20 = artifacts.require('JNTViewERC20');

const investorBalance = 15 * (10 ** 18);
const transferBalance = 10 * (10 ** 18);

contract('JNT Integration tests', (accounts) => {
  const { managerGeneral, managerMint, testInvestor1, testInvestor2 } = getAccounts(accounts);

  it('should test minting of JNT', async () => {
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const balanceInitial = await JNTViewERC20Instance.balanceOf(testInvestor1);
    await JNTControllerInstance.mint(testInvestor1, investorBalance, { from: managerMint });
    const balanceAfterMint = await JNTViewERC20Instance.balanceOf(testInvestor1);

    assert(balanceAfterMint.eq(balanceInitial.add(investorBalance)));
  });

  it('should test burning of JNT', async () => {
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const balanceInitial = await JNTViewERC20Instance.balanceOf(testInvestor1);

    await JNTControllerInstance.mint(testInvestor1, investorBalance, { from: managerMint });
    const balanceAfterMint = await JNTViewERC20Instance.balanceOf(testInvestor1);
    assert(balanceAfterMint.eq(balanceInitial.add(investorBalance)));

    await JNTControllerInstance.burn(testInvestor1, investorBalance, { from: managerMint });
    const balanceAfterBurn = await JNTViewERC20Instance.balanceOf(testInvestor1);
    assert(balanceAfterBurn.eq(balanceInitial));
  });

  it('should test minting and burning of JNT', async () => {
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    // no special meaning to use jntmanagerGeneral. Just an account without JNT
    const balanceInitial = await JNTViewERC20Instance.balanceOf(managerGeneral);
    assert(balanceInitial.eq(0));

    await JNTControllerInstance.mint(managerGeneral, investorBalance, { from: managerMint });
    const balanceAfterMint = await JNTViewERC20Instance.balanceOf(managerGeneral);
    assert(balanceAfterMint.eq(investorBalance));

    await JNTControllerInstance.burn(managerGeneral, investorBalance, { from: managerMint });
    const balanceAfterBurn = await JNTViewERC20Instance.balanceOf(managerGeneral);
    assert(balanceAfterBurn.eq(0));
  });

  it('should test transfers of JNT', async () => {
    const MigrationsInstance = await Migrations.deployed();
    const JNTControllerInstance = await JNTController.deployed();
    const JNTViewERC20Instance = await JNTViewERC20.deployed();

    const lastMigration = await MigrationsInstance.getLastCompletedMigration.call();

    await JNTControllerInstance.mint(testInvestor1, investorBalance, { from: managerMint });

    const balanceInitial1 = await JNTViewERC20Instance.balanceOf(testInvestor1);
    const balanceInitial2 = await JNTViewERC20Instance.balanceOf(testInvestor2);

    if (lastMigration.lt(4)) {
      // erc20 not unpaused yet
      await assertThrows(
        JNTViewERC20Instance.transfer(testInvestor2, transferBalance, { from: testInvestor1 }),
        'Should not be possible to transfer tokens',
      );

      const balanceAfter1 = await JNTViewERC20Instance.balanceOf(testInvestor1);
      const balanceAfter2 = await JNTViewERC20Instance.balanceOf(testInvestor2);

      assert(balanceAfter1.eq(balanceInitial1));
      assert(balanceAfter2.eq(balanceInitial2));
    } else {
      // erc20 view is unpaused
      await JNTViewERC20Instance.transfer(testInvestor2, transferBalance, { from: testInvestor1 });

      const balanceAfter1 = await JNTViewERC20Instance.balanceOf(testInvestor1);
      const balanceAfter2 = await JNTViewERC20Instance.balanceOf(testInvestor2);

      assert(balanceAfter1.eq(balanceInitial1.sub(transferBalance)));
      assert(balanceAfter2.eq(balanceInitial2.add(transferBalance)));
    }
  });
});
