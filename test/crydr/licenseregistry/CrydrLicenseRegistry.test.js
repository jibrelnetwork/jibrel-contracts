import * as CrydrLicenseRegistryManagementInterfaceJSAPI from '../../../contracts/crydr/license/CrydrLicenseRegistryManagementInterface.jsapi';

import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';
import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as DeployConfig from '../../../jsroutines/jsconfig/DeployConfig';
import * as CrydrLicenseRegistryInit from '../../../jsroutines/jsinit/CrydrLicenseRegistryInit';

const CrydrLicenseRegistryMockArtifact = global.artifacts.require('CrydrLicenseRegistryMock.sol');


global.contract('CrydrLicenseRegistry', (accounts) => {
  let licenseRegistryAddress;

  DeployConfig.setDeployer(undefined);
  DeployConfig.setEthAccounts(accounts);
  const ethAccounts = DeployConfig.getEthAccounts();


  global.beforeEach(async () => {
    licenseRegistryAddress = await CrydrLicenseRegistryInit.deployLicenseRegistry(CrydrLicenseRegistryMockArtifact, ethAccounts);
    await CrydrLicenseRegistryInit.configureLicenseRegistryManagers(licenseRegistryAddress, ethAccounts);
  });

  global.it('should test that user admittance works', async () => {
    let isAdmitted = await CrydrLicenseRegistryManagementInterfaceJSAPI.isUserAdmitted(licenseRegistryAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(isAdmitted, false, 'expected a new user is not admitted');


    let blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

    await CrydrLicenseRegistryManagementInterfaceJSAPI.admitUser(licenseRegistryAddress, ethAccounts.managerLicense, ethAccounts.testInvestor1);
    isAdmitted = await CrydrLicenseRegistryManagementInterfaceJSAPI.isUserAdmitted(licenseRegistryAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(isAdmitted, true, 'expected user is admitted after a request');

    await CrydrLicenseRegistryManagementInterfaceJSAPI.getUserAdmittedEvents(licenseRegistryAddress,
                                                                             ethAccounts.owner,
                                                                             ethAccounts.testInvestor1, 10 * (10 ** 18));
    let pastEvents = await CrydrLicenseRegistryManagementInterfaceJSAPI.getUserAdmittedEvents(
      licenseRegistryAddress,
      {
        account: ethAccounts.testInvestor1,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   licenseRegistryAddress,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1, 'expected exactly one event');


    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

    await CrydrLicenseRegistryManagementInterfaceJSAPI.denyUser(licenseRegistryAddress, ethAccounts.managerLicense, ethAccounts.testInvestor1);
    isAdmitted = await CrydrLicenseRegistryManagementInterfaceJSAPI.isUserAdmitted(licenseRegistryAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(isAdmitted, false, 'expected user is denied after a request');

    await CrydrLicenseRegistryManagementInterfaceJSAPI.getUserDeniedEvents(licenseRegistryAddress,
                                                                           ethAccounts.owner,
                                                                           ethAccounts.testInvestor1, 10 * (10 ** 18));
    pastEvents = await CrydrLicenseRegistryManagementInterfaceJSAPI.getUserDeniedEvents(
      licenseRegistryAddress,
      {
        account: ethAccounts.testInvestor1,
      },
      {
        fromBlock: blockNumber + 1,
        toBlock:   blockNumber + 1,
        address:   licenseRegistryAddress,
      }
    );
    global.assert.strictEqual(pastEvents.length, 1, 'expect exactly one event');
  });

  global.it('should test that user licenses work', async () => {
    // todo
  });

  global.it('should test that user admittance and licenses work together', async () => {
    // todo
  });
});
