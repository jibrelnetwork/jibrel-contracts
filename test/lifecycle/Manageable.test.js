const Manageable = global.artifacts.require('Manageable.sol');

const CheckExceptions = require('../../test_util/CheckExceptions');
const ManageableJSAPI = require('../../jsapi/lifecycle/Manageable');


global.contract('Manageable', (accounts) => {
  let testContract;
  let testContractAddress;

  const ownerAddress   = accounts[0];
  const managerAddress = accounts[1];

  global.beforeEach(async () => {
    testContract = await Manageable.new({ from: ownerAddress });
    testContractAddress = testContract.address;
  });

  global.it('should test that contract works as expected', async () => {
    let isManagerEnabled;
    let isPermission01Granted;
    let isPermission02Granted;
    let isPermission01Allowed;
    let isPermission02Allowed;

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(testContractAddress,
                                                              managerAddress);
    global.assert.strictEqual(isManagerEnabled, false);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.enableManager(testContractAddress,
                                        ownerAddress,
                                        managerAddress);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(testContractAddress,
                                                              managerAddress);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.grantManagerPermissions(testContractAddress,
                                                  ownerAddress,
                                                  managerAddress,
                                                  ['permission_01']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(testContractAddress,
                                                              managerAddress);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.grantManagerPermissions(testContractAddress,
                                                  ownerAddress,
                                                  managerAddress,
                                                  ['permission_02']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(testContractAddress,
                                                              managerAddress);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, true);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, true);

    await ManageableJSAPI.revokeManagerPermissions(testContractAddress,
                                                   ownerAddress,
                                                   managerAddress,
                                                   ['permission_02']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(testContractAddress,
                                                              managerAddress);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.disableManager(testContractAddress,
                                         ownerAddress,
                                         managerAddress);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(testContractAddress,
                                                              managerAddress);
    global.assert.strictEqual(isManagerEnabled, false);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                      managerAddress,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(testContractAddress,
                                                                   managerAddress,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    // getters

    await CheckExceptions.checkContractThrows(ManageableJSAPI.isManagerEnabled,
                                              [testContractAddress, 0x0],
                                              'isManagerEnabled should reject invalid manager address');

    await CheckExceptions.checkContractThrows(ManageableJSAPI.isPermissionGranted,
                                              [testContractAddress, 0x0, 'permission_01'],
                                              'isPermissionGranted should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.isPermissionGranted,
                                              [testContractAddress, managerAddress, ''],
                                              'isPermissionGranted should reject invalid permission name');

    await CheckExceptions.checkContractThrows(ManageableJSAPI.isManagerAllowed,
                                              [testContractAddress, 0x0, 'permission_01'],
                                              'isManagerAllowed should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.isManagerAllowed,
                                              [testContractAddress, managerAddress, ''],
                                              'isManagerAllowed should reject invalid permission name');


    // setters

    // enableManager & disableManager

    const isManagerEnabled = await ManageableJSAPI.isManagerEnabled(testContractAddress, managerAddress);
    global.assert.strictEqual(isManagerEnabled, false);

    await CheckExceptions.checkContractThrows(ManageableJSAPI.enableManager,
                                              [testContractAddress, ownerAddress, 0x0],
                                              'enableManager should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.enableManager,
                                              [testContractAddress, managerAddress, managerAddress],
                                              'Only owner should be able to enable manager');
    await ManageableJSAPI.enableManager(testContractAddress, ownerAddress, managerAddress);
    await CheckExceptions.checkContractThrows(ManageableJSAPI.enableManager,
                                              [testContractAddress, ownerAddress, managerAddress],
                                              'Should not be possible to enable already enabled manager');

    await CheckExceptions.checkContractThrows(ManageableJSAPI.disableManager,
                                              [testContractAddress, ownerAddress, 0x0],
                                              'disableManager should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.disableManager,
                                              [testContractAddress, managerAddress, managerAddress],
                                              'Only owner should be able to disable manager');
    await ManageableJSAPI.disableManager(testContractAddress, ownerAddress, managerAddress);
    await CheckExceptions.checkContractThrows(ManageableJSAPI.disableManager,
                                              [testContractAddress, ownerAddress, managerAddress],
                                              'Should not be possible to disable already disabled manager');


    // grantManagerPermission & revokeManagerPermission

    const isPermission01Granted = await ManageableJSAPI.isPermissionGranted(testContractAddress,
                                                                            managerAddress,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);

    await CheckExceptions.checkContractThrows(ManageableJSAPI.grantManagerPermissions,
                                              [testContractAddress, ownerAddress,
                                               0x0, ['permission_01']],
                                              'grantManagerPermission should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.grantManagerPermissions,
                                              [testContractAddress, ownerAddress,
                                               managerAddress, ['']],
                                              'grantManagerPermission should reject invalid permission name');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.grantManagerPermissions,
                                              [testContractAddress, managerAddress,
                                               managerAddress, ['permission_01']],
                                              'Only owner should be able to grant permissions');
    await ManageableJSAPI.grantManagerPermissions(testContractAddress, ownerAddress,
                                                  managerAddress, ['permission_01']);
    await CheckExceptions.checkContractThrows(ManageableJSAPI.grantManagerPermissions,
                                              [testContractAddress, ownerAddress,
                                               managerAddress, ['permission_01']],
                                              'Should not be possible to grant permission that is already granted');

    await CheckExceptions.checkContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                              [testContractAddress, ownerAddress,
                                               0x0, ['permission_01']],
                                              'revokeManagerPermission should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                              [testContractAddress, ownerAddress, managerAddress, ['']],
                                              'revokeManagerPermission should reject invalid permission name');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                              [testContractAddress, managerAddress,
                                               managerAddress, ['permission_01']],
                                              'Only owner should be able to revoke permissions');
    await ManageableJSAPI.revokeManagerPermissions(testContractAddress, ownerAddress,
                                                   managerAddress, ['permission_01']);
    await CheckExceptions.checkContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                              [testContractAddress, ownerAddress,
                                               managerAddress, ['permission_01']],
                                              'Should not be possible to revoke permission that is already revoked');
  });

  global.it('should test that functions fire events', async () => {
    let blockNumber = global.web3.eth.blockNumber;
    await ManageableJSAPI.enableManager(testContractAddress, ownerAddress, managerAddress);
    let pastEvents = await ManageableJSAPI.getManagerEnabledEvents(testContractAddress,
                                                                   {
                                                                     managerAddress,
                                                                   },
                                                                   {
                                                                     fromBlock: blockNumber + 1,
                                                                     toBlock:   blockNumber + 1,
                                                                     address:   ownerAddress,
                                                                   });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableJSAPI.disableManager(testContractAddress, ownerAddress, managerAddress);
    pastEvents = await ManageableJSAPI.getManagerDisabledEvents(testContractAddress,
                                                                {
                                                                  managerAddress,
                                                                },
                                                                {
                                                                  fromBlock: blockNumber + 1,
                                                                  toBlock:   blockNumber + 1,
                                                                  address:   ownerAddress,
                                                                });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableJSAPI.grantManagerPermissions(testContractAddress, ownerAddress, managerAddress, ['permission_01']);
    pastEvents = await ManageableJSAPI.getManagerPermissionGrantedEvents(testContractAddress,
                                                                         {
                                                                           managerAddress,
                                                                         },
                                                                         {
                                                                           fromBlock: blockNumber + 1,
                                                                           toBlock:   blockNumber + 1,
                                                                           address:   ownerAddress,
                                                                         });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableJSAPI.revokeManagerPermissions(testContractAddress, ownerAddress, managerAddress, ['permission_01']);
    pastEvents = await ManageableJSAPI.getManagerPermissionRevokedEvents(testContractAddress,
                                                                         {
                                                                           managerAddress,
                                                                         },
                                                                         {
                                                                           fromBlock: blockNumber + 1,
                                                                           toBlock:   blockNumber + 1,
                                                                           address:   ownerAddress,
                                                                         });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
