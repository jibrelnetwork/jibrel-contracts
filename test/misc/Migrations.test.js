const Migrations = global.artifacts.require('Migrations.sol');


global.contract('Migrations', (accounts) => {
  let migrationsInstance;

  const owner   = accounts[0];
  const nonOwner = accounts[1];

  global.beforeEach(async () => {
    migrationsInstance = await Migrations.new({ from: owner });
  });

  global.it('check Migrations contract', async () => {
    global.console.log(`\tmigrationsInstance: ${migrationsInstance.address}`);
    global.assert.notStrictEqual(migrationsInstance.address, '0x0000000000000000000000000000000000000000');

    const contractOwner = await migrationsInstance.owner.call();
    global.assert.strictEqual(contractOwner, owner);

    let lastCompletedMigration = await migrationsInstance.last_completed_migration.call();
    global.assert.strictEqual(lastCompletedMigration.toNumber(), 0);

    await migrationsInstance.setCompleted.sendTransaction(1, { from: owner });
    lastCompletedMigration = await migrationsInstance.last_completed_migration.call();
    global.assert.strictEqual(lastCompletedMigration.toNumber(), 1);

    await migrationsInstance.setCompleted.sendTransaction(2, { from: nonOwner });
    lastCompletedMigration = await migrationsInstance.last_completed_migration.call();
    global.assert.strictEqual(lastCompletedMigration.toNumber(), 1,
                              'Only owner should be able to change completed migration ');
  });
});
