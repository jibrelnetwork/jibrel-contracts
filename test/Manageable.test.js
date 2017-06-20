const Manageable = artifacts.require('Manageable.sol');

contract('Manageable', (accounts) => {
  let manageableContract;

  const owner = accounts[0];
  const manager = accounts[1];

  beforeEach(async () => {
    manageableContract = await Manageable.new({ from: owner });
  });

  it('should add manager and check permissions', async () => {
    let isManagerEnabled;
    let isManagerAllowed;

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    assert.equal(isManagerEnabled, false);
    await manageableContract.enableManager.sendTransaction(manager, { from: owner });
    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    assert.equal(isManagerEnabled, true);

    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    assert.equal(isManagerAllowed, false);
    await manageableContract.grantManagerPermission.sendTransaction(manager, 'permission_01', { from: owner });
    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    assert.equal(isManagerAllowed, true);

    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    assert.equal(isManagerAllowed, false);
    await manageableContract.grantManagerPermission.sendTransaction(manager, 'permission_02', { from: owner });
    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    assert.equal(isManagerAllowed, true);

    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    assert.equal(isManagerAllowed, true);
    await manageableContract.cancelManagerPermission.sendTransaction(manager, 'permission_02', { from: owner });
    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    assert.equal(isManagerAllowed, false);

    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    assert.equal(isManagerAllowed, true);
    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    assert.equal(isManagerEnabled, true);
    await manageableContract.disableManager.sendTransaction(manager, 'permission_02', { from: owner });
    isManagerAllowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    assert.equal(isManagerAllowed, false);
    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    assert.equal(isManagerEnabled, false);
  });
});
