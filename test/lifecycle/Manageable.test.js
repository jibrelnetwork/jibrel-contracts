const assertThrows = require('../../jsroutines/util/assertThrows');
const { getAccounts } = require('../../jsroutines/jsconfig/DeployConfig');

const ManageableMock = artifacts.require('ManageableMock');

const perm01 = 'permission_01';
const perm02 = 'permission_02';
const permInvalid = '';

async function checkFlags(instance, managerGeneral, flags) {
  const [
    isManagerEnabledFlag,
    isPermission01GrantedFlag,
    isPermission02GrantedFlag,
    isPermission01AllowedFlag,
    isPermission02AllowedFlag,
  ] = flags;

  const isManagerEnabled = await instance.isManagerEnabled(managerGeneral);
  assert.strictEqual(isManagerEnabled, isManagerEnabledFlag);

  const isPermission01Granted = await instance.isPermissionGranted(managerGeneral, perm01);
  assert.strictEqual(isPermission01Granted, isPermission01GrantedFlag);

  const isPermission02Granted = await instance.isPermissionGranted(managerGeneral, perm02);
  assert.strictEqual(isPermission02Granted, isPermission02GrantedFlag);

  const isPermission01Allowed = await instance.isManagerAllowed(managerGeneral, perm01);
  assert.strictEqual(isPermission01Allowed, isPermission01AllowedFlag);

  const isPermission02Allowed = await instance.isManagerAllowed(managerGeneral, perm02);
  assert.strictEqual(isPermission02Allowed, isPermission02AllowedFlag);
}

contract('Manageable', (accounts) => {
  let manageableInstance;

  const { owner, managerGeneral } = getAccounts(accounts);
  const txFrom = { from: owner };

  beforeEach(async () => {
    manageableInstance = await ManageableMock.new({ from: owner });
  });

  it('should test that contract works as expected', async () => {
    await checkFlags(manageableInstance, managerGeneral, [false, false, false, false, false]);

    await manageableInstance.enableManager(managerGeneral, txFrom);
    await checkFlags(manageableInstance, managerGeneral, [true, false, false, false, false]);

    await manageableInstance.grantManagerPermission(managerGeneral, perm01, txFrom);
    await checkFlags(manageableInstance, managerGeneral, [true, true, false, true, false]);

    await manageableInstance.grantManagerPermission(managerGeneral, perm02, txFrom);
    await checkFlags(manageableInstance, managerGeneral, [true, true, true, true, true]);

    await manageableInstance.revokeManagerPermission(managerGeneral, perm02, txFrom);
    await checkFlags(manageableInstance, managerGeneral, [true, true, false, true, false]);

    await manageableInstance.disableManager(managerGeneral, txFrom);
    await checkFlags(manageableInstance, managerGeneral, [false, true, false, false, false]);
  });

  it('should test that functions throw if general conditions are not met', async () => {
    // getters

    await assertThrows(
      manageableInstance.isManagerEnabled(0x0),
      'isManagerEnabled should reject invalid manager address',
    );

    await assertThrows(
      manageableInstance.isPermissionGranted(0x0, perm01),
      'isPermissionGranted should reject invalid manager address',
    );

    await assertThrows(
      manageableInstance.isPermissionGranted(managerGeneral, permInvalid),
      'isPermissionGranted should reject invalid permission name',
    );

    await assertThrows(
      manageableInstance.isManagerAllowed(0x0, perm01),
      'isManagerAllowed should reject invalid manager address',
    );

    await assertThrows(
      manageableInstance.isManagerAllowed(managerGeneral, permInvalid),
      'isManagerAllowed should reject invalid permission name',
    );

    // setters

    // enableManager & disableManager

    const isManagerEnabled = await manageableInstance.isManagerEnabled(managerGeneral);
    assert.strictEqual(isManagerEnabled, false);

    await assertThrows(
      manageableInstance.enableManager(0x0, txFrom),
      'enableManager should reject invalid manager address',
    );

    await assertThrows(
      manageableInstance.enableManager(managerGeneral, { from: managerGeneral }),
      'Only owner should be able to enable manager',
    );

    await manageableInstance.enableManager(managerGeneral, txFrom);

    await assertThrows(
      manageableInstance.enableManager(managerGeneral, txFrom),
      'Should not be possible to enable already enabled manager',
    );

    await assertThrows(
      manageableInstance.disableManager(0x0, txFrom),
      'disableManager should reject invalid manager address',
    );

    await assertThrows(
      manageableInstance.disableManager(managerGeneral, { from: managerGeneral }),
      'Only owner should be able to disable manager',
    );

    await manageableInstance.disableManager(managerGeneral, txFrom);

    await assertThrows(
      manageableInstance.disableManager(managerGeneral, txFrom),
      'Should not be possible to disable already disabled manager',
    );

    // grantManagerPermission & revokeManagerPermission

    const isPerm01Granted = await manageableInstance.isPermissionGranted(managerGeneral, perm01);
    assert.strictEqual(isPerm01Granted, false);

    await assertThrows(
      manageableInstance.grantManagerPermission(0x0, perm01, txFrom),
      'grantManagerPermission should reject invalid manager address',
    );

    await assertThrows(
      manageableInstance.grantManagerPermission(managerGeneral, permInvalid, txFrom),
      'grantManagerPermission should reject invalid permission name',
    );

    await assertThrows(
      manageableInstance.grantManagerPermission(managerGeneral, perm01, { from: managerGeneral }),
      'Only owner should be able to grant permissions',
    );

    await manageableInstance.grantManagerPermission(managerGeneral, perm01, txFrom);

    await assertThrows(
      manageableInstance.grantManagerPermission(managerGeneral, perm01, txFrom),
      'Should not be possible to grant permission that is already granted',
    );

    await assertThrows(
      manageableInstance.revokeManagerPermission(0x0, perm01, txFrom),
      'revokeManagerPermission should reject invalid manager address',
    );

    await assertThrows(
      manageableInstance.revokeManagerPermission(managerGeneral, permInvalid, txFrom),
      'revokeManagerPermission should reject invalid permission name',
    );

    await assertThrows(
      manageableInstance.revokeManagerPermission(managerGeneral, perm01, { from: managerGeneral }),
      'Only owner should be able to revoke permissions',
    );

    await manageableInstance.revokeManagerPermission(managerGeneral, perm01, txFrom);

    await assertThrows(
      manageableInstance.revokeManagerPermission(managerGeneral, perm01, txFrom),
      'Should not be possible to revoke permission that is already revoked',
    );
  });

  it('should test that functions fire events', async () => {
    const manager = managerGeneral;

    const enableTx = await manageableInstance.enableManager(manager, txFrom);
    assert.strictEqual(enableTx.logs.length, 1);

    const disableTx = await manageableInstance.disableManager(manager, txFrom);
    assert.strictEqual(disableTx.logs.length, 1);

    const grantTx = await manageableInstance.grantManagerPermission(manager, perm01, txFrom);
    assert.strictEqual(grantTx.logs.length, 1);

    const revokeTx = await manageableInstance.revokeManagerPermission(manager, perm01, txFrom);
    assert.strictEqual(revokeTx.logs.length, 1);
  });
});
