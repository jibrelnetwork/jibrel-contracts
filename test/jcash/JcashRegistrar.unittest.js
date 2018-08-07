import { submitTxAndWaitConfirmation } from '../../jsroutines/util/SubmitTx';
import { isContractThrows } from '../../jsroutines/util/CheckExceptions';

import * as AsyncWeb3 from '../../jsroutines/util/AsyncWeb3';
import * as TxConfig from '../../jsroutines/jsconfig/TxConfig';
import * as DeployConfig from '../../jsroutines/jsconfig/DeployConfig';
import * as DeployUtils from '../../jsroutines/util/DeployUtils';

import * as PausableInterfaceJSAPI from '../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as JcashRegistrarInterfaceJSAPI from '../../contracts/jcash/JcashRegistrar/JcashRegistrarInterface.jsapi';
import * as Erc20MockJSAPI from '../../contracts/unittest/Erc20Mock.jsapi';
import * as JNTControllerStubJSAPI from '../../contracts/unittest/JNTControllerStub.jsapi';

import * as JcashRegistrarInit from '../../jsroutines/jsinit/JcashRegistrarInit';

const BigNumber = require('bignumber.js');

const JcashRegistrarArtifact = global.artifacts.require('JcashRegistrar.sol');
const Erc20MockArtifact = global.artifacts.require('Erc20Mock.sol');
const JNTControllerStubArtifact = global.artifacts.require('JNTControllerStub.sol');


global.contract('JcashRegistrar', (accounts) => {
  const exchangePrice = (10 ** 18);

  let jntControllerAddress;
  let jcashRegistrarAddress;

  DeployConfig.setAccounts(accounts);
  const {
    owner,
    managerPause,
    managerJcashReplenisher,
    managerJcashExchange,
    testInvestor1,
    managerJNT,
    jntBeneficiary,
  } = DeployConfig.getAccounts();
  const contractOwner = owner;

  global.beforeEach(async () => {
    jntControllerAddress = await DeployUtils.deployContractSimple(JNTControllerStubArtifact, contractOwner);

    await DeployUtils.deployContractSimple(JcashRegistrarArtifact, contractOwner);
    const jcashRegistrarInstance = await JcashRegistrarArtifact.new({ from: contractOwner });
    jcashRegistrarAddress = jcashRegistrarInstance.address;

    global.console.log('\tContract deployed for tests of JcashRegistrar:');
    global.console.log(`\t\tJcashRegistrarInstance: ${jcashRegistrarAddress}`);

    await JcashRegistrarInit.configureManagers(jcashRegistrarAddress, contractOwner,
                                               managerPause, managerJcashReplenisher, managerJcashExchange);
    await JcashRegistrarInit.configureJNTConnection(jcashRegistrarAddress, contractOwner,
                                                    jntControllerAddress, managerJNT, jntBeneficiary, 10 ** 18);
    await PausableInterfaceJSAPI.unpauseContract(jcashRegistrarAddress, managerPause);
  });


  global.it('should test initial configuration', async () => {
    const isVerified1 = await JcashRegistrarInit.verifyManagers(jcashRegistrarAddress, contractOwner,
                                                                managerPause, managerJcashReplenisher, managerJcashExchange);
    global.assert.strictEqual(isVerified1, true);

    const isVerified2 = await JcashRegistrarInit.verifyJNTConnection(jcashRegistrarAddress,
                                                                     jntControllerAddress, managerJNT, jntBeneficiary, 10 ** 18);
    global.assert.strictEqual(isVerified2, true);
  });


  global.it('should test that incoming ETH TXs are registered', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await submitTxAndWaitConfirmation(global.web3.eth.sendTransaction,
                                      [{ from: testInvestor1, to: jcashRegistrarAddress, value: valueToSend }]);

    const events = await JcashRegistrarInterfaceJSAPI.getReceiveEthEvents(jcashRegistrarAddress,
                                                                 { from: testInvestor1 }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.from, testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that incoming ETH TXs from replenisher are registered', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await submitTxAndWaitConfirmation(global.web3.eth.sendTransaction,
                                      [{ from: managerJcashReplenisher, to: jcashRegistrarAddress, value: valueToSend }]);

    const events = await JcashRegistrarInterfaceJSAPI.getReplenishEthEvents(jcashRegistrarAddress,
                                                                   { from: managerJcashReplenisher }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.from, managerJcashReplenisher);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that it is possible to withdraw ETH', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);
    const txPrice = new BigNumber(10).pow(18).mul(0.01);

    // send ETH to the contract
    const replenisherBalanceStart = await global.web3.eth.getBalance(managerJcashReplenisher);
    await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [{ from: managerJcashReplenisher, to: jcashRegistrarAddress, value: valueToSend }]
    );

    // withdraw ETH from the contract
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.withdrawEth(jcashRegistrarAddress, managerJcashReplenisher, valueToSend);
    const replenisherBalanceFinish = await global.web3.eth.getBalance(managerJcashReplenisher);

    // check ETH have been actually withdrawn
    global.assert.approximately(replenisherBalanceFinish.toNumber(),
                                replenisherBalanceStart.toNumber(),
                                txPrice.toNumber());

    // check an event emitted
    const events = await JcashRegistrarInterfaceJSAPI.getWithdrawEthEvents(jcashRegistrarAddress,
                                                                  { to: managerJcashReplenisher },
                                                                  { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.to, managerJcashReplenisher);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });

  global.it('should test that it is possible to withdraw Token', async () => {
    const valueToSend = new BigNumber(10).pow(18);

    // deploy contract
    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, contractOwner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, contractOwner, managerJcashReplenisher, valueToSend);

    const replenisherBalance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, managerJcashReplenisher);
    global.assert.strictEqual(replenisherBalance.toNumber(), valueToSend.toNumber());

    // transfer and withdraw tokens
    const replenisherBalanceStart = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, managerJcashReplenisher);
    await Erc20MockJSAPI.transfer(erc20TokenAddress, managerJcashReplenisher, jcashRegistrarAddress, valueToSend);
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.withdrawToken(jcashRegistrarAddress, managerJcashReplenisher, erc20TokenAddress, valueToSend);
    const replenisherBalanceFinish = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, managerJcashReplenisher);

    // check tokens have been actually withdrawn
    global.assert.strictEqual(replenisherBalanceFinish.toNumber(), replenisherBalanceStart.toNumber());

    // check an event emitted
    const events = await JcashRegistrarInterfaceJSAPI.getWithdrawTokenEvents(jcashRegistrarAddress,
                                                                    { to: managerJcashReplenisher },
                                                                    { fromBlock: blockNumber + 1 });

    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.to, managerJcashReplenisher);
    global.assert.strictEqual(events[0].args.tokenaddress, erc20TokenAddress);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that it is possible to refund ETH and operation charges 1JNT', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [{ from: testInvestor1, to: jcashRegistrarAddress, value: valueToSend }]
    );
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.refundEth(jcashRegistrarAddress, managerJcashExchange, txHash, testInvestor1, valueToSend);

    const events = await JcashRegistrarInterfaceJSAPI.getRefundEthEvents(jcashRegistrarAddress,
                                                                { txhash: txHash }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.to, testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that it is not possible to refund ETH for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [{ from: testInvestor1, to: jcashRegistrarAddress, value: valueToSend }]
    );

    await JcashRegistrarInterfaceJSAPI.refundEth(jcashRegistrarAddress, managerJcashExchange, txHash, testInvestor1, valueToSend);

    const isThrows = await isContractThrows(JcashRegistrarInterfaceJSAPI.refundEth,
                                            [jcashRegistrarAddress, managerJcashExchange, txHash, testInvestor1, valueToSend]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to refund tokens and operation charges 1JNT', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, contractOwner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, contractOwner, testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, testInvestor1, jcashRegistrarAddress, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.refundToken(jcashRegistrarAddress, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());

    const events = await JcashRegistrarInterfaceJSAPI.getRefundTokenEvents(jcashRegistrarAddress,
                                                                  { txhash: txHash }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.tokenaddress, erc20TokenAddress);
    global.assert.strictEqual(events[0].args.to, testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });

  global.it('should test that it is not possible to refund tokens for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, contractOwner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, contractOwner, testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, testInvestor1, jcashRegistrarAddress, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    await JcashRegistrarInterfaceJSAPI.refundToken(jcashRegistrarAddress, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, 10 * 17);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 10 * 17);

    const isThrows = await isContractThrows(JcashRegistrarInterfaceJSAPI.refundToken,
                                            [jcashRegistrarAddress, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, 10 * 17]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to transfer ETH and operation charges 1JNT', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [{ from: testInvestor1, to: jcashRegistrarAddress, value: valueToSend }]
    );
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.transferEth(jcashRegistrarAddress, managerJcashExchange, txHash, testInvestor1, valueToSend);

    let events = await JcashRegistrarInterfaceJSAPI.getTransferEthEvents(jcashRegistrarAddress,
                                                                { txhash: txHash }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.to, testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());

    events = await JNTControllerStubJSAPI.getJNTChargedEvents(jntControllerAddress,
                                                              { from: testInvestor1 }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.payableservice, jcashRegistrarAddress);
    global.assert.strictEqual(events[0].args.from, testInvestor1);
    global.assert.strictEqual(events[0].args.to, jntBeneficiary);
    global.assert.strictEqual(events[0].args.value.toNumber(), exchangePrice);
  });


  global.it('should test that it is not possible to refund ETH for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [{ from: testInvestor1, to: jcashRegistrarAddress, value: valueToSend }]
    );

    await JcashRegistrarInterfaceJSAPI.transferEth(jcashRegistrarAddress, managerJcashExchange, txHash, testInvestor1, valueToSend);

    const isThrows = await isContractThrows(JcashRegistrarInterfaceJSAPI.transferEth,
                                            [jcashRegistrarAddress, managerJcashExchange, txHash, testInvestor1, valueToSend]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to transfer tokens and operation charges 1JNT', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, contractOwner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, contractOwner, testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, testInvestor1, jcashRegistrarAddress, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.transferToken(jcashRegistrarAddress, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());

    let events = await JcashRegistrarInterfaceJSAPI.getTransferTokenEvents(jcashRegistrarAddress,
                                                                  { txhash: txHash }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.tokenaddress, erc20TokenAddress);
    global.assert.strictEqual(events[0].args.to, testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());

    events = await JNTControllerStubJSAPI.getJNTChargedEvents(jntControllerAddress,
                                                              { from: testInvestor1 }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.payableservice, jcashRegistrarAddress);
    global.assert.strictEqual(events[0].args.from, testInvestor1);
    global.assert.strictEqual(events[0].args.to, jntBeneficiary);
    global.assert.strictEqual(events[0].args.value.toNumber(), exchangePrice);
  });

  global.it('should test that it is not possible to transfer tokens for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, contractOwner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, contractOwner, testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, testInvestor1, jcashRegistrarAddress, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    await JcashRegistrarInterfaceJSAPI.transferToken(jcashRegistrarAddress, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, 10 * 17);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 10 * 17);

    const isThrows = await isContractThrows(JcashRegistrarInterfaceJSAPI.transferToken,
                                            [jcashRegistrarAddress, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, 10 * 17]);
    global.assert.strictEqual(isThrows, true);
  });
});
