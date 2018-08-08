import * as ManageableInterfaceJSAPI from '../../contracts/lifecycle/Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';

import * as DeployConfig from '../../jsroutines/jsconfig/DeployConfig';
import * as AsyncWeb3 from '../../jsroutines/util/AsyncWeb3';

import * as CheckExceptions from '../../jsroutines/util/CheckExceptions';

const ManageableMock = global.artifacts.require('ManageableMock.sol');


global.contract('Manageable', (accounts) => {
  let manageableInstanceAddress;

  DeployConfig.setAccounts(accounts);
  const { owner, managerGeneral } = DeployConfig.getAccounts();

  global.beforeEach(async () => {
    const manageableInstance = await ManageableMock.new({ from: owner });
    manageableInstanceAddress = manageableInstance.address;
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
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
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
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
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
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
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
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
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
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
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
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    // getters

    let isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.isManagerEnabled,
                                                          [manageableInstanceAddress, 0x0]);
    global.assert.strictEqual(isThrows, true, 'isManagerEnabled should reject invalid manager address');

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.isPermissionGranted,
                                                      [manageableInstanceAddress, 0x0, 'permission_01']);
    global.assert.strictEqual(isThrows, true, 'isPermissionGranted should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.isPermissionGranted,
                                                      [manageableInstanceAddress, managerGeneral, '']);
    global.assert.strictEqual(isThrows, true, 'isPermissionGranted should reject invalid permission name');

    isThrows = await CheckExceptions.isContractThrows(ManageableInterfaceJSAPI.isManagerAllowed,
                                                      [manageableInstanceAddress, 0x0, 'permission_01']);
    global.assert.strictEqual(isThrows, true, 'isManagerAllowed should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableInterfaceJSAPI.isManagerAllowed,
                                                      [manageableInstanceAddress, managerGeneral, '']);
    global.assert.strictEqual(isThrows, true, 'isManagerAllowed should reject invalid permission name');


    // setters

    // enableManager & disableManager

    const isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress, managerGeneral);
    global.assert.strictEqual(isManagerEnabled, false);

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.enableManager,
                                                      [manageableInstanceAddress, owner, 0x0]);
    global.assert.strictEqual(isThrows, true, 'enableManager should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.enableManager,
                                                      [manageableInstanceAddress, managerGeneral, managerGeneral]);
    global.assert.strictEqual(isThrows, true, 'Only owner should be able to enable manager');
    await ManageableJSAPI.enableManager(manageableInstanceAddress, owner, managerGeneral);
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.enableManager,
                                                      [manageableInstanceAddress, owner, managerGeneral]);
    global.assert.strictEqual(isThrows, true, 'Should not be possible to enable already enabled manager');

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.disableManager,
                                                      [manageableInstanceAddress, owner, 0x0]);
    global.assert.strictEqual(isThrows, true, 'disableManager should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.disableManager,
                                                      [manageableInstanceAddress, managerGeneral, managerGeneral]);
    global.assert.strictEqual(isThrows, true, 'Only owner should be able to disable manager');
    await ManageableJSAPI.disableManager(manageableInstanceAddress, owner, managerGeneral);
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.disableManager,
                                                      [manageableInstanceAddress, owner, managerGeneral]);
    global.assert.strictEqual(isThrows, true, 'Should not be possible to disable already disabled manager');


    // grantManagerPermission & revokeManagerPermission

    const isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                            managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.grantManagerPermissions,
                                                      [manageableInstanceAddress, owner,
                                                       0x0, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'grantManagerPermission should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.grantManagerPermissions,
                                                      [manageableInstanceAddress, owner,
                                                       managerGeneral, ['']]);
    global.assert.strictEqual(isThrows, true, 'grantManagerPermission should reject invalid permission name');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.grantManagerPermissions,
                                                      [manageableInstanceAddress, managerGeneral,
                                                       managerGeneral, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'Only owner should be able to grant permissions');
    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress, owner,
                                                  managerGeneral, ['permission_01']);
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.grantManagerPermissions,
                                                      [manageableInstanceAddress, owner,
                                                       managerGeneral, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'Should not be possible to grant permission that is already granted');

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                                      [manageableInstanceAddress, owner,
                                                       0x0, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'revokeManagerPermission should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                                      [manageableInstanceAddress, owner, managerGeneral, ['']]);
    global.assert.strictEqual(isThrows, true, 'revokeManagerPermission should reject invalid permission name');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                                      [manageableInstanceAddress, managerGeneral,
                                                       managerGeneral, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'Only owner should be able to revoke permissions');
    await ManageableJSAPI.revokeManagerPermissions(manageableInstanceAddress, owner,
                                                   managerGeneral, ['permission_01']);
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                                      [manageableInstanceAddress, owner,
                                                       managerGeneral, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'Should not be possible to revoke permission that is already revoked');
  });

  global.it('should test that functions fire events', async () => {
    let blockNumber = await AsyncWeb3.getBlockNumber();
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


    blockNumber = await AsyncWeb3.getBlockNumber();
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


    blockNumber = await AsyncWeb3.getBlockNumber();
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


    blockNumber = await AsyncWeb3.getBlockNumber();
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
