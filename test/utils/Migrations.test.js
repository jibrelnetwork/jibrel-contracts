const Migrations = global.artifacts.require('Migrations.sol');


global.contract('Migrations', (accounts) => {
  let migrationsContract;

  const owner   = accounts[0];
  const nonOwner = accounts[1];

  global.beforeEach(async () => {
    migrationsContract = await Migrations.new({ from: owner });
  });

  global.it('check Migrations contract', async () => {
    global.console.log(`\tmigrationsContract: ${migrationsContract.address}`);
    global.assert.notStrictEqual(migrationsContract.address, '0x0000000000000000000000000000000000000000');

    const contractOwner = await migrationsContract.getOwner.call();
    global.assert.strictEqual(contractOwner, owner);

    let lastCompletedMigration = await migrationsContract.getLastCompletedMigration.call();
    global.assert.strictEqual(lastCompletedMigration.toNumber(), 0);

    await migrationsContract.setCompleted.sendTransaction(1, { from: owner });
    lastCompletedMigration = await migrationsContract.getLastCompletedMigration.call();
    global.assert.strictEqual(lastCompletedMigration.toNumber(), 1);

    await migrationsContract.setCompleted.sendTransaction(2, { from: nonOwner });
    lastCompletedMigration = await migrationsContract.getLastCompletedMigration.call();
    global.assert.strictEqual(lastCompletedMigration.toNumber(), 1, 'Only owner should be able to change completed migration ');
  });
});
