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

    let isThrow = false;
    await manageableContract.isManagerEnabled.call(0x0).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true,
      'It should throw an exception if enableManager called by any account other than the owner or if manager address is invalid');

    isThrow = false;
    await manageableContract.enableManager.sendTransaction(0x0, { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if manager address is invalid');

    isThrow = false;
    await manageableContract.enableManager.sendTransaction(manager, { from: manager }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if enableManager called by any account other than the owner');

    isThrow = false;
    await manageableContract.disableManager.sendTransaction(0x0, { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if manager address is invalid');

    isThrow = false;
    await manageableContract.disableManager.sendTransaction(manager, { from: manager }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if disableManager called by any account other than the owner');

    isThrow = false;
    await manageableContract.isManagerAllowed.sendTransaction(0x0, 'permission_01', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if manager address is invalid or name of manager permission is invalid');

    isThrow = false;
    await manageableContract.isManagerAllowed.sendTransaction(0x0, 'permission_01', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if manager address is invalid');

    isThrow = false;
    await manageableContract.isManagerAllowed.sendTransaction(manager, '', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if name of manager permission is invalid');

    isThrow = false;
    await manageableContract.isPermissionGranted.sendTransaction(0x0, 'permission_01', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if manager address is invalid or name of manager permission is invalid');

    isThrow = false;
    await manageableContract.isPermissionGranted.sendTransaction(0x0, 'permission_01', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if manager address is invalid');

    isThrow = false;
    await manageableContract.isPermissionGranted.sendTransaction(manager, '', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if name of manager permission is invalid');

    isThrow = false;
    await manageableContract.grantManagerPermission.sendTransaction(0x0, 'permission_01', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if manager address is invalid');

    isThrow = false;
    await manageableContract.grantManagerPermission.sendTransaction(manager, '', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if name of manager permission is invalid');

    isThrow = false;
    await manageableContract.grantManagerPermission.sendTransaction(manager, 'permission_01', { from: manager }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if grantManagerPermission called by any account other than the owner');

    isThrow = false;
    await manageableContract.revokeManagerPermission.sendTransaction(0x0, 'permission_01', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if manager address is invalid');

    isThrow = false;
    await manageableContract.revokeManagerPermission.sendTransaction(manager, '', { from: owner }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if name of manager permission is invalid');

    isThrow = false;
    await manageableContract.revokeManagerPermission.sendTransaction(manager, 'permission_01', { from: manager }).catch(() => {
      isThrow = true;
    });
    global.assert.equal(isThrow, true, 'It should throw an exception if revokeManagerPermission called by any account other than the owner');

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
});
