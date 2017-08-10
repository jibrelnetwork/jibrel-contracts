const Migrations = global.artifacts.require('Migrations.sol');


global.contract('Migrations', (accounts) => {
  let migrationsContract;

  const owner1 = accounts[0];
  const owner2 = accounts[0];

  global.beforeEach(async () => {
    migrationsContract = await Migrations.new({ from: owner1 });
  });

  global.it('check Migrations contract', async () => {
    global.console.log(`\tmigrationsContract: ${migrationsContract.address}`);
    global.assert.equal(migrationsContract.address == 0x0, false);

    let contractOwner = await migrationsContract.getOwner.call();
    global.assert.equal(contractOwner, owner2);

    let lastCompletedMigration = await migrationsContract.getLastCompletedMigration.call();
    global.assert.equal(lastCompletedMigration.toNumber(), 0);

    await migrationsContract.setCompleted.sendTransaction(1, { from: owner1 });
    lastCompletedMigration = await migrationsContract.getLastCompletedMigration.call();
    global.assert.equal(lastCompletedMigration.toNumber(), 1);

    await migrationsContract.setCompleted.sendTransaction(2, { from: owner2 });
    lastCompletedMigration = await migrationsContract.getLastCompletedMigration.call();
    global.assert.equal(lastCompletedMigration.toNumber(), 1,
      'It should not be changed the last_completed_migration if setCompleted called by any account other than the owner');
  });
});
