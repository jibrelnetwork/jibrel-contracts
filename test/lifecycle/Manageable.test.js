import * as ManageableInterfaceJSAPI from '../../contracts/lifecycle/Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../../contracts/lifecycle/Manageable/Manageable.jsapi';

import * as TxConfig from '../../jsroutines/jsconfig/TxConfig';
import * as DeployConfig from '../../jsroutines/jsconfig/DeployConfig';
import * as AsyncWeb3 from '../../jsroutines/util/AsyncWeb3';

import * as CheckExceptions from '../../jsroutines/util/CheckExceptions';

const ManageableMock = global.artifacts.require('ManageableMock.sol');


global.contract('Manageable', (accounts) => {
  TxConfig.setWeb3(global.web3);

  DeployConfig.setEthAccounts(accounts);
  const ethAccounts = DeployConfig.getEthAccounts();


  let manageableInstanceAddress;


  global.beforeEach(async () => {
    const manageableInstance = await ManageableMock.new({ from: ethAccounts.owner });
    manageableInstanceAddress = manageableInstance.address;
  });

  global.it('should test that contract works as expected', async () => {
    let isManagerEnabled;
    let isPermission01Granted;
    let isPermission02Granted;
    let isPermission01Allowed;
    let isPermission02Allowed;

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              ethAccounts.managerGeneral);
    global.assert.strictEqual(isManagerEnabled, false);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.enableManager(manageableInstanceAddress,
                                        ethAccounts.owner,
                                        ethAccounts.managerGeneral);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              ethAccounts.managerGeneral);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress,
                                                  ethAccounts.owner,
                                                  ethAccounts.managerGeneral,
                                                  ['permission_01']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              ethAccounts.managerGeneral);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress,
                                                  ethAccounts.owner,
                                                  ethAccounts.managerGeneral,
                                                  ['permission_02']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              ethAccounts.managerGeneral);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, true);
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_02');
    global.assert.strictEqual(isPermission02Allowed, true);

    await ManageableJSAPI.revokeManagerPermissions(manageableInstanceAddress,
                                                   ethAccounts.owner,
                                                   ethAccounts.managerGeneral,
                                                   ['permission_02']);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              ethAccounts.managerGeneral);
    global.assert.strictEqual(isManagerEnabled, true);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, true);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_02');
    global.assert.strictEqual(isPermission02Allowed, false);

    await ManageableJSAPI.disableManager(manageableInstanceAddress,
                                         ethAccounts.owner,
                                         ethAccounts.managerGeneral);

    isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress,
                                                              ethAccounts.managerGeneral);
    global.assert.strictEqual(isManagerEnabled, false);
    isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_01');
    global.assert.strictEqual(isPermission01Granted, true);
    isPermission02Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                      ethAccounts.managerGeneral,
                                                                      'permission_02');
    global.assert.strictEqual(isPermission02Granted, false);
    isPermission01Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Allowed, false);
    isPermission02Allowed = await ManageableInterfaceJSAPI.isManagerAllowed(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
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
                                                      [manageableInstanceAddress, ethAccounts.managerGeneral, '']);
    global.assert.strictEqual(isThrows, true, 'isPermissionGranted should reject invalid permission name');

    isThrows = await CheckExceptions.isContractThrows(ManageableInterfaceJSAPI.isManagerAllowed,
                                                      [manageableInstanceAddress, 0x0, 'permission_01']);
    global.assert.strictEqual(isThrows, true, 'isManagerAllowed should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableInterfaceJSAPI.isManagerAllowed,
                                                      [manageableInstanceAddress, ethAccounts.managerGeneral, '']);
    global.assert.strictEqual(isThrows, true, 'isManagerAllowed should reject invalid permission name');


    // setters

    // enableManager & disableManager

    const isManagerEnabled = await ManageableJSAPI.isManagerEnabled(manageableInstanceAddress, ethAccounts.managerGeneral);
    global.assert.strictEqual(isManagerEnabled, false);

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.enableManager,
                                                      [manageableInstanceAddress, ethAccounts.owner, 0x0]);
    global.assert.strictEqual(isThrows, true, 'enableManager should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.enableManager,
                                                      [manageableInstanceAddress, ethAccounts.managerGeneral, ethAccounts.managerGeneral]);
    global.assert.strictEqual(isThrows, true, 'Only owner should be able to enable manager');
    await ManageableJSAPI.enableManager(manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral);
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.enableManager,
                                                      [manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral]);
    global.assert.strictEqual(isThrows, true, 'Should not be possible to enable already enabled manager');

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.disableManager,
                                                      [manageableInstanceAddress, ethAccounts.owner, 0x0]);
    global.assert.strictEqual(isThrows, true, 'disableManager should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.disableManager,
                                                      [manageableInstanceAddress, ethAccounts.managerGeneral, ethAccounts.managerGeneral]);
    global.assert.strictEqual(isThrows, true, 'Only owner should be able to disable manager');
    await ManageableJSAPI.disableManager(manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral);
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.disableManager,
                                                      [manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral]);
    global.assert.strictEqual(isThrows, true, 'Should not be possible to disable already disabled manager');


    // grantManagerPermission & revokeManagerPermission

    const isPermission01Granted = await ManageableJSAPI.isPermissionGranted(manageableInstanceAddress,
                                                                            ethAccounts.managerGeneral,
                                                                            'permission_01');
    global.assert.strictEqual(isPermission01Granted, false);

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.grantManagerPermissions,
                                                      [manageableInstanceAddress, ethAccounts.owner,
                                                       0x0, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'grantManagerPermission should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.grantManagerPermissions,
                                                      [manageableInstanceAddress, ethAccounts.owner,
                                                       ethAccounts.managerGeneral, ['']]);
    global.assert.strictEqual(isThrows, true, 'grantManagerPermission should reject invalid permission name');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.grantManagerPermissions,
                                                      [manageableInstanceAddress, ethAccounts.managerGeneral,
                                                       ethAccounts.managerGeneral, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'Only owner should be able to grant permissions');
    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress, ethAccounts.owner,
                                                  ethAccounts.managerGeneral, ['permission_01']);
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.grantManagerPermissions,
                                                      [manageableInstanceAddress, ethAccounts.owner,
                                                       ethAccounts.managerGeneral, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'Should not be possible to grant permission that is already granted');

    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                                      [manageableInstanceAddress, ethAccounts.owner,
                                                       0x0, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'revokeManagerPermission should reject invalid manager address');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                                      [manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral, ['']]);
    global.assert.strictEqual(isThrows, true, 'revokeManagerPermission should reject invalid permission name');
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                                      [manageableInstanceAddress, ethAccounts.managerGeneral,
                                                       ethAccounts.managerGeneral, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'Only owner should be able to revoke permissions');
    await ManageableJSAPI.revokeManagerPermissions(manageableInstanceAddress, ethAccounts.owner,
                                                   ethAccounts.managerGeneral, ['permission_01']);
    isThrows = await CheckExceptions.isContractThrows(ManageableJSAPI.revokeManagerPermissions,
                                                      [manageableInstanceAddress, ethAccounts.owner,
                                                       ethAccounts.managerGeneral, ['permission_01']]);
    global.assert.strictEqual(isThrows, true, 'Should not be possible to revoke permission that is already revoked');
  });

  global.it('should test that functions fire events', async () => {
    let blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await ManageableJSAPI.enableManager(manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral);
    let pastEvents = await ManageableJSAPI.getManagerEnabledEvents(manageableInstanceAddress,
                                                                   {
                                                                     managerGeneral: ethAccounts.managerGeneral,
                                                                   },
                                                                   {
                                                                     fromBlock: blockNumber + 1,
                                                                     toBlock:   blockNumber + 1,
                                                                     address:   ethAccounts.owner,
                                                                   });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await ManageableJSAPI.disableManager(manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral);
    pastEvents = await ManageableJSAPI.getManagerDisabledEvents(manageableInstanceAddress,
                                                                {
                                                                  managerGeneral: ethAccounts.managerGeneral,
                                                                },
                                                                {
                                                                  fromBlock: blockNumber + 1,
                                                                  toBlock:   blockNumber + 1,
                                                                  address:   ethAccounts.owner,
                                                                });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await ManageableJSAPI.grantManagerPermissions(manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral, ['permission_01']);
    pastEvents = await ManageableJSAPI.getManagerPermissionGrantedEvents(manageableInstanceAddress,
                                                                         {
                                                                           managerGeneral: ethAccounts.managerGeneral,
                                                                         },
                                                                         {
                                                                           fromBlock: blockNumber + 1,
                                                                           toBlock:   blockNumber + 1,
                                                                           address:   ethAccounts.owner,
                                                                         });
    global.assert.strictEqual(pastEvents.length, 1);


    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await ManageableJSAPI.revokeManagerPermissions(manageableInstanceAddress, ethAccounts.owner, ethAccounts.managerGeneral, ['permission_01']);
    pastEvents = await ManageableJSAPI.getManagerPermissionRevokedEvents(manageableInstanceAddress,
                                                                         {
                                                                           managerGeneral: ethAccounts.managerGeneral,
                                                                         },
                                                                         {
                                                                           fromBlock: blockNumber + 1,
                                                                           toBlock:   blockNumber + 1,
                                                                           address:   ethAccounts.owner,
                                                                         });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
