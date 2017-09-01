const Manageable = global.artifacts.require('Manageable.sol');

const UtilsTestRoutines  = require('../../routine/misc/UtilsTest');
const ManageableRoutines = require('../../routine/lifecycle/Manageable');


global.contract('Manageable', (accounts) => {
  let manageableContract;

  const owner   = accounts[0];
  const manager = accounts[1];

  global.beforeEach(async () => {
    manageableContract = await Manageable.new({ from: owner });
  });

  global.it('should test that contract works as expected', async () => {
    let isManagerEnabled;
    let isPermission01Granted;
    let isPermission02Granted;
    let isPermission01Allowed;
    let isPermission02Allowed;

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.strictEqual(isManagerEnabled, false);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableRoutines.enableManager(manageableContract.address, owner, manager);

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableRoutines.grantManagerPermissions(manageableContract.address, owner, manager, ['permission_01']);

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableRoutines.grantManagerPermissions(manageableContract.address, owner, manager, ['permission_02']);

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Granted, true);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Allowed, true);

    await ManageableRoutines.revokeManagerPermissions(manageableContract.address, owner, manager, ['permission_02']);

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableRoutines.disableManager(manageableContract.address, owner, manager);

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.strictEqual(isManagerEnabled, false);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    // getters

    await UtilsTestRoutines.checkContractThrows(manageableContract.isManagerEnabled.call,
                                                [0x0],
                                                'isManagerEnabled should reject invalid manager address');

    await UtilsTestRoutines.checkContractThrows(manageableContract.isPermissionGranted.call,
                                                [0x0, 'permission_01'],
                                                'isPermissionGranted should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.isPermissionGranted.call,
                                                [manager, ''],
                                                'isPermissionGranted should reject invalid permission name');

    await UtilsTestRoutines.checkContractThrows(manageableContract.isManagerAllowed.call,
                                                [0x0, 'permission_01'],
                                                'isManagerAllowed should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.isManagerAllowed.call,
                                                [manager, ''],
                                                'isManagerAllowed should reject invalid permission name');


    // setters

    // enableManager & disableManager

    const isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.strictEqual(isManagerEnabled, false);

    await UtilsTestRoutines.checkContractThrows(manageableContract.enableManager.sendTransaction,
                                                [0x0, { from: owner }],
                                                'enableManager should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.enableManager.sendTransaction,
                                                [manager, { from: manager }],
                                                'Only owner should be able to enable manager');
    await ManageableRoutines.enableManager(manageableContract.address, owner, manager);
    await UtilsTestRoutines.checkContractThrows(manageableContract.enableManager.sendTransaction,
                                                [manager, { from: owner }],
                                                'Should not be possible to enable already enabled manager');

    await UtilsTestRoutines.checkContractThrows(manageableContract.disableManager.sendTransaction,
                                                [0x0, { from: owner }],
                                                'disableManager should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.disableManager.sendTransaction,
                                                [manager, { from: manager }],
                                                'Only owner should be able to disable manager');
    await ManageableRoutines.disableManager(manageableContract.address, owner, manager);
    await UtilsTestRoutines.checkContractThrows(manageableContract.disableManager.sendTransaction,
                                                [manager, { from: owner }],
                                                'Should not be possible to disable already disabled manager');


    // grantManagerPermission & revokeManagerPermission

    const isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);

    await UtilsTestRoutines.checkContractThrows(manageableContract.grantManagerPermission.sendTransaction,
                                                [0x0, 'permission_01', { from: owner }],
                                                'grantManagerPermission should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.grantManagerPermission.sendTransaction,
                                                [manager, '', { from: owner }],
                                                'grantManagerPermission should reject invalid permission name');
    await UtilsTestRoutines.checkContractThrows(manageableContract.grantManagerPermission.sendTransaction,
                                                [manager, 'permission_01', { from: manager }],
                                                'Only owner should be able to grant permissions');
    await ManageableRoutines.grantManagerPermissions(manageableContract.address, owner, manager, ['permission_01']);
    await UtilsTestRoutines.checkContractThrows(manageableContract.grantManagerPermission.sendTransaction,
                                                [manager, 'permission_01', { from: owner }],
                                                'Should not be possible to grant permission that is already granted');

    await UtilsTestRoutines.checkContractThrows(manageableContract.revokeManagerPermission.sendTransaction,
                                                [0x0, 'permission_01', { from: owner }],
                                                'revokeManagerPermission should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.revokeManagerPermission.sendTransaction,
                                                [manager, '', { from: owner }],
                                                'revokeManagerPermission should reject invalid permission name');
    await UtilsTestRoutines.checkContractThrows(manageableContract.revokeManagerPermission.sendTransaction,
                                                [manager, 'permission_01', { from: manager }],
                                                'Only owner should be able to revoke permissions');
    await ManageableRoutines.revokeManagerPermissions(manageableContract.address, owner, manager, ['permission_01']);
    await UtilsTestRoutines.checkContractThrows(manageableContract.revokeManagerPermission.sendTransaction,
                                                [manager, 'permission_01', { from: owner }],
                                                'Should not be possible to revoke permission that is already revoked');
  });

  global.it('should test that functions fire events', async () => {
    let blockNumber = global.web3.eth.blockNumber;
    await ManageableRoutines.enableManager(manageableContract.address, owner, manager);
    let pastEvents = await ManageableRoutines.getManagerEnabledEvents(manageableContract.address,
                                                                      {
                                                                        manager,
                                                                      },
                                                                      {
                                                                        fromBlock: blockNumber + 1,
                                                                        toBlock:   blockNumber + 1,
                                                                        address:   owner,
                                                                      });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableRoutines.disableManager(manageableContract.address, owner, manager);
    pastEvents = await ManageableRoutines.getManagerDisabledEvents(manageableContract.address,
                                                                   {
                                                                     manager,
                                                                   },
                                                                   {
                                                                     fromBlock: blockNumber + 1,
                                                                     toBlock:   blockNumber + 1,
                                                                     address:   owner,
                                                                   });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableRoutines.grantManagerPermissions(manageableContract.address, owner, manager, ['permission_01']);
    pastEvents = await ManageableRoutines.getManagerPermissionGrantedEvents(manageableContract.address,
                                                                            {
                                                                              manager,
                                                                            },
                                                                            {
                                                                              fromBlock: blockNumber + 1,
                                                                              toBlock:   blockNumber + 1,
                                                                              address:   owner,
                                                                            });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableRoutines.revokeManagerPermissions(manageableContract.address, owner, manager, ['permission_01']);
    pastEvents = await ManageableRoutines.getManagerPermissionRevokedEvents(manageableContract.address,
                                                                            {
                                                                              manager,
                                                                            },
                                                                            {
                                                                              fromBlock: blockNumber + 1,
                                                                              toBlock:   blockNumber + 1,
                                                                              address:   owner,
                                                                            });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
