const Manageable = global.artifacts.require('Manageable.sol');

const ManageableJSAPI = require('../../jsroutines/jsapi/lifecycle/Manageable');

const GlobalConfig = require('../../jsroutines/jsinit/GlobalConfig');

const CheckExceptions = require('../../jsroutines/test_util/CheckExceptions');


global.contract('Manageable', (accounts) => {
  let manageableInstanceAddress;

  GlobalConfig.setAccounts(accounts);
  const { owner, managerGeneral } = GlobalConfig.getAccounts();

  global.beforeEach(async () => {
    const testContract = await Manageable.new({ from: owner });
    manageableInstanceAddress = testContract.address;
  });

  global.it('should test that contract works as expected', async () => {
    let isManagerEnabled;
    let isPermission01Granted;
    let isPermission02Granted;
    let isPermission01Allowed;
    let isPermission02Allowed;

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              managerGeneral);
    global.assert.strictEqual(isManagerEnabled, false);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.enableManager(manageableInstanceAddress,
                                        owner,
                                        managerGeneral);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              managerGeneral);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress,
                                                  owner,
                                                  managerGeneral,
                                                  ['permission_01']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              managerGeneral);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress,
                                                  owner,
                                                  managerGeneral,
                                                  ['permission_02']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              managerGeneral);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, true);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, true);

    await ManageableJSAPI.revokeManagerPermissions(manageableInstanceAddress,
                                                   owner,
                                                   managerGeneral,
                                                   ['permission_02']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              managerGeneral);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.disableManager(manageableInstanceAddress,
                                         owner,
                                         managerGeneral);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              managerGeneral);
    global.assert.strictEqual(isManagerEnabled, false);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                   managerGeneral,
                                                                   'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    // getters

    await CheckExceptions.checkContractThrows(ManageableJSAPI.isManagerEnabled,
                                              [manageableInstanceAddress, 0x0],
                                              'isManagerEnabled should reject invalid manager address');

    await CheckExceptions.checkContractThrows(ManageableJSAPI.isPermissionGranted,
                                              [manageableInstanceAddress, 0x0, 'permission_01'],
                                              'isPermissionGranted should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.isPermissionGranted,
                                              [manageableInstanceAddress, managerGeneral, ''],
                                              'isPermissionGranted should reject invalid permission name');

    await CheckExceptions.checkContractThrows(ManageableJSAPI.isManagerAllowed,
                                              [manageableInstanceAddress, 0x0, 'permission_01'],
                                              'isManagerAllowed should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.isManagerAllowed,
                                              [manageableInstanceAddress, managerGeneral, ''],
                                              'isManagerAllowed should reject invalid permission name');


    // setters

    // enableManager & disableManager

    const isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress, managerGeneral);
    global.assert.strictEqual(isManagerEnabled, false);

    await CheckExceptions.checkContractThrows(ManageableJSAPI.enableManager,
                                              [manageableInstanceAddress, owner, 0x0],
                                              'enableManager should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.enableManager,
                                              [manageableInstanceAddress, managerGeneral, managerGeneral],
                                              'Only owner should be able to enable manager');
    await ManageableJSAPI.enableManager(manageableInstanceAddress, owner, managerGeneral);
    await CheckExceptions.checkContractThrows(ManageableJSAPI.enableManager,
                                              [manageableInstanceAddress, owner, managerGeneral],
                                              'Should not be possible to enable already enabled manager');

    await CheckExceptions.checkContractThrows(ManageableJSAPI.disableManager,
                                              [manageableInstanceAddress, owner, 0x0],
                                              'disableManager should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.disableManager,
                                              [manageableInstanceAddress, managerGeneral, managerGeneral],
                                              'Only owner should be able to disable manager');
    await ManageableJSAPI.disableManager(manageableInstanceAddress, owner, managerGeneral);
    await CheckExceptions.checkContractThrows(ManageableJSAPI.disableManager,
                                              [manageableInstanceAddress, owner, managerGeneral],
                                              'Should not be possible to disable already disabled manager');


    // grantManagerPermission & revokeManagerPermission

    const isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);

    await CheckExceptions.checkContractThrows(ManageableJSAPI.grantManagerPermissions,
                                              [manageableInstanceAddress, owner,
                                               0x0, ['permission_01']],
                                              'grantManagerPermission should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.grantManagerPermissions,
                                              [manageableInstanceAddress, owner,
                                               managerGeneral, ['']],
                                              'grantManagerPermission should reject invalid permission name');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.grantManagerPermissions,
                                              [manageableInstanceAddress, managerGeneral,
                                               managerGeneral, ['permission_01']],
                                              'Only owner should be able to grant permissions');
    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress, owner,
                                                  managerGeneral, ['permission_01']);
    await CheckExceptions.checkContractThrows(ManageableJSAPI.grantManagerPermissions,
                                              [manageableInstanceAddress, owner,
                                               managerGeneral, ['permission_01']],
                                              'Should not be possible to grant permission that is already granted');

    await CheckExceptions.checkContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                              [manageableInstanceAddress, owner,
                                               0x0, ['permission_01']],
                                              'revokeManagerPermission should reject invalid manager address');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                              [manageableInstanceAddress, owner, managerGeneral, ['']],
                                              'revokeManagerPermission should reject invalid permission name');
    await CheckExceptions.checkContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                              [manageableInstanceAddress, managerGeneral,
                                               managerGeneral, ['permission_01']],
                                              'Only owner should be able to revoke permissions');
    await ManageableJSAPI.revokeManagerPermissions(manageableInstanceAddress, owner,
                                                   managerGeneral, ['permission_01']);
    await CheckExceptions.checkContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                              [manageableInstanceAddress, owner,
                                               managerGeneral, ['permission_01']],
                                              'Should not be possible to revoke permission that is already revoked');
  });

  global.it('should test that functions fire events', async () => {
    let blockNumber = global.web3.eth.blockNumber;
    await ManageableJSAPI.enableManager(manageableInstanceAddress, owner, managerGeneral);
    let pastEvents = await ManageableJSAPI.getManagerEnabledEvents(manageableInstanceAddress,
                                                                   {
                                                                     managerGeneral,
                                                                   },
                                                                   {
                                                                     fromBlock: blockNumber + 1,
                                                                     toBlock:   blockNumber + 1,
                                                                     address:   owner,
                                                                   });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableJSAPI.disableManager(manageableInstanceAddress, owner, managerGeneral);
    pastEvents = await ManageableJSAPI.getManagerDisabledEvents(manageableInstanceAddress,
                                                                {
                                                                  managerGeneral,
                                                                },
                                                                {
                                                                  fromBlock: blockNumber + 1,
                                                                  toBlock:   blockNumber + 1,
                                                                  address:   owner,
                                                                });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress, owner, managerGeneral, ['permission_01']);
    pastEvents = await ManageableJSAPI.getManagerPermissionGrantedEvents(manageableInstanceAddress,
                                                                         {
                                                                           managerGeneral,
                                                                         },
                                                                         {
                                                                           fromBlock: blockNumber + 1,
                                                                           toBlock:   blockNumber + 1,
                                                                           address:   owner,
                                                                         });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = global.web3.eth.blockNumber;
    await ManageableJSAPI.revokeManagerPermissions(manageableInstanceAddress, owner, managerGeneral, ['permission_01']);
    pastEvents = await ManageableJSAPI.getManagerPermissionRevokedEvents(manageableInstanceAddress,
                                                                         {
                                                                           managerGeneral,
                                                                         },
                                                                         {
                                                                           fromBlock: blockNumber + 1,
                                                                           toBlock:   blockNumber + 1,
                                                                           address:   owner,
                                                                         });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
