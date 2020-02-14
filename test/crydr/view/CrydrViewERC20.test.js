import * as PausableInterfaceJSAPI from '../../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as CrydrViewBaseInterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewBase/CrydrViewBaseInterface.jsapi';
import * as ERC20InterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewERC20/ERC20Interface.jsapi';
import * as CrydrViewERC20LoggableInterfaceJSAPI from '../../../contracts/crydr/view/CrydrViewERC20Loggable/CrydrViewERC20LoggableInterface.jsapi';

import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as AsyncWeb3 from '../../../jsroutines/util/AsyncWeb3';
import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';

import * as CrydrViewInit from '../../../jsroutines/jsinit/CrydrViewInit';
import * as BnUtil from '../../../jsroutines/util/BnUtil';

import * as PausableTestSuite from '../../../jsroutines/test_suit/lifecycle/Pausable';

const CrydrControllerERC20Stub    = global.artifacts.require('CrydrControllerERC20Stub.sol');
const JCashCrydrViewERC20 = global.artifacts.require('JCashCrydrViewERC20.sol');


global.contract('CrydrViewERC20', (accounts) => {
  TxConfig.setWeb3(global.web3);

  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();


  let jcashCrydrViewERC20Instance;
  let controllerStubInstance;


  const originalName = 'testName';
  const originalSymbol = 'testSymbol';
  const originalDecimals = 18;
  const originalNameHash = '0x698c8efcda9e563cf153563941b60fc5ac88336fc58d361eb0888686fadb9976';
  const originalSymbolHash = '0x6a2f03a1dba5e9dbeb18b55ac2076e1af9f5f2b7411cb1dbef111c70934e1686';

  const assetID = 'jASSET';


  global.beforeEach(async () => {
    jcashCrydrViewERC20Instance = await JCashCrydrViewERC20.new(assetID,
                                                                originalName,
                                                                originalSymbol,
                                                                originalDecimals,
                                                                { from: ethAccounts.owner });
    controllerStubInstance = await CrydrControllerERC20Stub.new(assetID,
                                                                jcashCrydrViewERC20Instance.address,
                                                                { from: ethAccounts.owner });

    global.console.log('\tContracts deployed for tests CrydrViewBase:');
    global.console.log(`\t\tjcashCrydrViewERC20Instance: ${jcashCrydrViewERC20Instance.address}`);
    global.console.log(`\t\tcontrollerStubInstance: ${controllerStubInstance}`);

    global.console.log('\tStart to configure test contracts:');
    await CrydrViewInit.configureCrydrViewManagers(jcashCrydrViewERC20Instance.address, ethAccounts);
    await CrydrViewBaseInterfaceJSAPI.setCrydrController(jcashCrydrViewERC20Instance.address,
                                                         ethAccounts.managerGeneral,
                                                         controllerStubInstance.address);
    await PausableInterfaceJSAPI.unpauseContract(jcashCrydrViewERC20Instance.address, ethAccounts.managerPause);


    global.console.log('\tStart to verify configuration of test contracts:');
    const controllerAddress = await CrydrViewBaseInterfaceJSAPI.getCrydrController(jcashCrydrViewERC20Instance.address);
    global.assert.strictEqual(controllerAddress, controllerStubInstance.address,
                              'Expected that view configured properly');
    const isPaused = await PausableInterfaceJSAPI.getPaused(jcashCrydrViewERC20Instance.address);
    global.assert.strictEqual(isPaused, false, 'Expected that contract is paused');
  });

  global.it('should test that contract works as expected', async () => {
    const contractName = await jcashCrydrViewERC20Instance.name.call();
    global.assert.strictEqual(contractName, originalName);

    const contractSymbol = await jcashCrydrViewERC20Instance.symbol.call();
    global.assert.strictEqual(contractSymbol, originalSymbol);

    const contractDecimals = await jcashCrydrViewERC20Instance.decimals.call();
    global.assert.strictEqual(contractDecimals.toNumber(), originalDecimals);


    const contractNameHash = await jcashCrydrViewERC20Instance.getNameHash.call();
    global.assert.strictEqual(contractNameHash, originalNameHash);

    const contractSymbolHash = await jcashCrydrViewERC20Instance.getSymbolHash.call();
    global.assert.strictEqual(contractSymbolHash, originalSymbolHash);


    await ERC20InterfaceJSAPI.transfer(jcashCrydrViewERC20Instance.address, ethAccounts.testInvestor1,
                                       ethAccounts.testInvestor1, 10 * (10 ** 18));
    const transferCounter = await controllerStubInstance.transferCounter.call();
    global.assert.strictEqual(transferCounter.toNumber(), 1);

    await ERC20InterfaceJSAPI.approve(jcashCrydrViewERC20Instance.address, ethAccounts.testInvestor1,
                                      ethAccounts.testInvestor1, 10 * (10 ** 18));
    const approveCounter = await controllerStubInstance.approveCounter.call();
    global.assert.strictEqual(approveCounter.toNumber(), 1);

    await ERC20InterfaceJSAPI.transferFrom(jcashCrydrViewERC20Instance.address, ethAccounts.testInvestor1,
                                           ethAccounts.testInvestor1, ethAccounts.testInvestor2, 10 * (10 ** 18));
    const transferFromCounter = await controllerStubInstance.transferFromCounter.call();
    global.assert.strictEqual(transferFromCounter.toNumber(), 1);

    const totalSupply = await jcashCrydrViewERC20Instance.totalSupply.call();
    global.assert.isTrue(totalSupply.eq(BnUtil.ether(60)));

    const balanceOf = await jcashCrydrViewERC20Instance.balanceOf.call(ethAccounts.testInvestor1);
    global.assert.isTrue(balanceOf.eq(BnUtil.ether(40)));

    const allowance = await jcashCrydrViewERC20Instance.allowance.call(ethAccounts.testInvestor1, ethAccounts.testInvestor2);
    global.assert.isTrue(allowance.eq(BnUtil.ether(20)));
  });

  global.it('should test that functions covered by pause modifiers', async () => {
    PausableInterfaceJSAPI.pauseContract(jcashCrydrViewERC20Instance.address, ethAccounts.managerPause);

    await PausableTestSuite
      .assertWhenContractNotPaused(jcashCrydrViewERC20Instance.address, ethAccounts.managerPause,
                                   ERC20InterfaceJSAPI.transfer,
                                   [jcashCrydrViewERC20Instance.address, ethAccounts.testInvestor1,
                                    ethAccounts.testInvestor2, 10 * (10 ** 18)]);
    await PausableTestSuite
      .assertWhenContractNotPaused(jcashCrydrViewERC20Instance.address, ethAccounts.managerPause,
                                   ERC20InterfaceJSAPI.approve,
                                   [jcashCrydrViewERC20Instance.address, ethAccounts.testInvestor1,
                                    ethAccounts.testInvestor2, 10 * (10 ** 18)]);
    await PausableTestSuite
      .assertWhenContractNotPaused(jcashCrydrViewERC20Instance.address, ethAccounts.managerPause,
                                   ERC20InterfaceJSAPI.transferFrom,
                                   [jcashCrydrViewERC20Instance.address, ethAccounts.testInvestor1,
                                    ethAccounts.testInvestor1, ethAccounts.testInvestor2, 10 * (10 ** 18)]);
  });

  global.it('should test that only controller is allowed to emit events', async () => {
    // direct call to the view, not through the controller
    let isThrows = await CheckExceptions
      .isContractThrows(CrydrViewERC20LoggableInterfaceJSAPI.emitTransferEvent,
                        [jcashCrydrViewERC20Instance.address, ethAccounts.testInvestor1,
                         ethAccounts.testInvestor1, ethAccounts.testInvestor2, 10 * (10 ** 18)]);
    global.assert.strictEqual(isThrows, true, 'Only CrydrController can emit transfer event');
    isThrows = await CheckExceptions
      .isContractThrows(CrydrViewERC20LoggableInterfaceJSAPI.emitApprovalEvent,
                        [jcashCrydrViewERC20Instance.address, ethAccounts.testInvestor1,
                         ethAccounts.testInvestor1, ethAccounts.testInvestor2, 10 * (10 ** 18)]);
    global.assert.strictEqual(isThrows, true, 'Only CrydrController can emit approval event');
  });

  global.it('should test that functions fire events', async () => {
    const value = 10 * (10 ** 18);

    let blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await CrydrViewERC20LoggableInterfaceJSAPI
      .emitTransferEvent(controllerStubInstance.address, ethAccounts.testInvestor1,
                         ethAccounts.testInvestor1, ethAccounts.testInvestor2, value);
    let pastEvents = await ERC20InterfaceJSAPI
      .getTransferEvents(jcashCrydrViewERC20Instance.address,
                         {
                           from: ethAccounts.testInvestor1,
                           to:   ethAccounts.testInvestor2,
                           value,
                         },
                         {
                           fromBlock: blockNumber + 1,
                           toBlock:   blockNumber + 1,
                           address:   ethAccounts.testInvestor1,
                         });
    global.assert.strictEqual(pastEvents.length, 1);

    blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await CrydrViewERC20LoggableInterfaceJSAPI
      .emitApprovalEvent(controllerStubInstance.address, ethAccounts.testInvestor1,
                         ethAccounts.testInvestor1, ethAccounts.testInvestor2, value);
    pastEvents = await ERC20InterfaceJSAPI
      .getApprovalEvents(jcashCrydrViewERC20Instance.address,
                         {
                           owner:   ethAccounts.testInvestor1,
                           spender: ethAccounts.testInvestor2,
                           value,
                         },
                         {
                           fromBlock: blockNumber + 1,
                           toBlock:   blockNumber + 1,
                           address:   ethAccounts.testInvestor1,
                         });
    global.assert.strictEqual(pastEvents.length, 1);
  });
});
