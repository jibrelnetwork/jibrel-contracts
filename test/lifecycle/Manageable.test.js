const Manageable = global.artifacts.require('Manageable.sol');


global.contract('Manageable', (accounts) => {
  let manageableContract;

  const owner   = accounts[0];
  const manager = accounts[1];

  global.beforeEach(async () => {
    manageableContract = await Manageable.new({ from: owner });
  });

  global.it('should add manager and check permissions', async () => {
    let isManagerEnabled;
    let isManagerAllowed;

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, false);
    await manageableContract.enableManager.sendTransaction(manager, { from: owner });
    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);

    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isManagerAllowed, false);
    await manageableContract.grantManagerPermission.sendTransaction(manager, 'permission_01', { from: owner });
    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isManagerAllowed, true);

    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isManagerAllowed, false);
    await manageableContract.grantManagerPermission.sendTransaction(manager, 'permission_02', { from: owner });
    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isManagerAllowed, true);

    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isManagerAllowed, true);
    await manageableContract.revokeManagerPermission.sendTransaction(manager, 'permission_02', { from: owner });
    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isManagerAllowed, false);

    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isManagerAllowed, true);
    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);
    await manageableContract.disableManager.sendTransaction(manager, { from: owner });
    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isManagerAllowed, false);
    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, false);
  });

  // todo add tests that check exceptions for not-authorised actions
});
