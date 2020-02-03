import * as PausableInterfaceJSAPI from '../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as JcashRegistrarInterfaceJSAPI from '../../contracts/jcash/JcashRegistrar/JcashRegistrarInterface.jsapi';
import * as Erc20MockJSAPI from '../../contracts/unittest/Erc20Mock.jsapi';
import * as JNTPaymentGatewayStubJSAPI from '../../contracts/unittest/JNTPaymentGatewayStub.jsapi';

import * as TxConfig from '../../jsroutines/jsconfig/TxConfig';
import * as AsyncWeb3 from '../../jsroutines/util/AsyncWeb3';
import { submitTxAndWaitConfirmation } from '../../jsroutines/util/SubmitTx';
import { isContractThrows } from '../../jsroutines/util/CheckExceptions';
import * as DeployUtils from '../../jsroutines/util/DeployUtils';

import * as JcashRegistrarInit from '../../jsroutines/jsinit/JcashRegistrarInit';

const BigNumber = require('bignumber.js');

const JcashRegistrarArtifact = global.artifacts.require('JcashRegistrar.sol');
const Erc20MockArtifact = global.artifacts.require('Erc20Mock.sol');
const JNTPaymentGatewayStubArtifact = global.artifacts.require('JNTPaymentGatewayStub.sol');


global.contract('JcashRegistrar', (accounts) => {
  TxConfig.setWeb3(global.web3);

  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();


  const exchangePrice = (10 ** 18);

  let jntControllerAddress;
  let jcashRegistrarAddress;


  global.beforeEach(async () => {
    jntControllerAddress = await DeployUtils.deployContractSimple(JNTPaymentGatewayStubArtifact, ethAccounts.owner);

    await DeployUtils.deployContractSimple(JcashRegistrarArtifact, ethAccounts.owner);
    const jcashRegistrarInstance = await JcashRegistrarArtifact.new({ from: ethAccounts.owner });
    jcashRegistrarAddress = jcashRegistrarInstance.address;

    global.console.log('\tContract deployed for tests of JcashRegistrar:');
    global.console.log(`\t\tJcashRegistrarInstance: ${jcashRegistrarAddress}`);

    await JcashRegistrarInit.configureManagers(jcashRegistrarAddress, ethAccounts);
    await JcashRegistrarInit.configureJNTConnection(jcashRegistrarAddress, jntControllerAddress, ethAccounts, 10 ** 18);
    await PausableInterfaceJSAPI.unpauseContract(jcashRegistrarAddress, ethAccounts.managerPause);
  });


  global.it('should test initial configuration', async () => {
    const isVerified1 = await JcashRegistrarInit.verifyManagers(jcashRegistrarAddress, ethAccounts);
    global.assert.strictEqual(isVerified1, true);

    const isVerified2 = await JcashRegistrarInit.verifyJNTConnection(jcashRegistrarAddress, jntControllerAddress, ethAccounts, 10 ** 18);
    global.assert.strictEqual(isVerified2, true);
  });


  global.it('should test that incoming ETH TXs are registered', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await submitTxAndWaitConfirmation(global.web3.eth.sendTransaction,
                                      [], { from: ethAccounts.testInvestor1, to: jcashRegistrarAddress, value: valueToSend });

    const events = await JcashRegistrarInterfaceJSAPI.getReceiveEthEvents(jcashRegistrarAddress,
                                                                          { from: ethAccounts.testInvestor1 }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.from, ethAccounts.testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that incoming ETH TXs from replenisher are registered', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await submitTxAndWaitConfirmation(global.web3.eth.sendTransaction,
                                      [], { from: ethAccounts.managerJcashReplenisher, to: jcashRegistrarAddress, value: valueToSend });

    const events = await JcashRegistrarInterfaceJSAPI.getReplenishEthEvents(jcashRegistrarAddress,
                                                                            { from: ethAccounts.managerJcashReplenisher }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.from, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that it is possible to withdraw ETH', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);
    const txPrice = new BigNumber(10).pow(18).mul(0.01);

    // send ETH to the contract
    const replenisherBalanceStart = await global.web3.eth.getBalance(ethAccounts.managerJcashReplenisher);
    await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [], { from: ethAccounts.managerJcashReplenisher, to: jcashRegistrarAddress, value: valueToSend }
    );

    // withdraw ETH from the contract
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.withdrawEth(jcashRegistrarAddress, ethAccounts.managerJcashReplenisher, valueToSend);
    const replenisherBalanceFinish = await global.web3.eth.getBalance(ethAccounts.managerJcashReplenisher);

    // check ETH have been actually withdrawn
    global.assert.approximately(replenisherBalanceFinish.toNumber(),
                                replenisherBalanceStart.toNumber(),
                                txPrice.toNumber());

    // check an event emitted
    const events = await JcashRegistrarInterfaceJSAPI.getWithdrawEthEvents(jcashRegistrarAddress,
                                                                           { to: ethAccounts.managerJcashReplenisher },
                                                                           { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.to, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });

  global.it('should test that it is possible to withdraw Token', async () => {
    const valueToSend = new BigNumber(10).pow(18);

    // deploy contract
    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, ethAccounts.owner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, ethAccounts.owner, ethAccounts.managerJcashReplenisher, valueToSend);

    const replenisherBalance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(replenisherBalance.toNumber(), valueToSend.toNumber());

    // transfer and withdraw tokens
    const replenisherBalanceStart = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.managerJcashReplenisher);
    await Erc20MockJSAPI.transfer(erc20TokenAddress, ethAccounts.managerJcashReplenisher, jcashRegistrarAddress, valueToSend);
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.withdrawToken(jcashRegistrarAddress, ethAccounts.managerJcashReplenisher, erc20TokenAddress, valueToSend);
    const replenisherBalanceFinish = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.managerJcashReplenisher);

    // check tokens have been actually withdrawn
    global.assert.strictEqual(replenisherBalanceFinish.toNumber(), replenisherBalanceStart.toNumber());

    // check an event emitted
    const events = await JcashRegistrarInterfaceJSAPI.getWithdrawTokenEvents(jcashRegistrarAddress,
                                                                             { to: ethAccounts.managerJcashReplenisher },
                                                                             { fromBlock: blockNumber + 1 });

    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.to, ethAccounts.managerJcashReplenisher);
    global.assert.strictEqual(events[0].args.tokenaddress, erc20TokenAddress);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that it is possible to refund ETH and operation charges 1JNT', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [], { from: ethAccounts.testInvestor1, to: jcashRegistrarAddress, value: valueToSend }
    );
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.refundEth(jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, ethAccounts.testInvestor1, valueToSend);

    const events = await JcashRegistrarInterfaceJSAPI.getRefundEthEvents(jcashRegistrarAddress,
                                                                         { txhash: txHash }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.to, ethAccounts.testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that it is not possible to refund ETH for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [], { from: ethAccounts.testInvestor1, to: jcashRegistrarAddress, value: valueToSend }
    );

    await JcashRegistrarInterfaceJSAPI.refundEth(jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, ethAccounts.testInvestor1, valueToSend);

    const isThrows = await isContractThrows(JcashRegistrarInterfaceJSAPI.refundEth,
                                            [jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, ethAccounts.testInvestor1, valueToSend]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to refund tokens and operation charges 1JNT', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, ethAccounts.owner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, ethAccounts.owner, ethAccounts.testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, ethAccounts.testInvestor1, jcashRegistrarAddress, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.refundToken(jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, erc20TokenAddress, ethAccounts.testInvestor1, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());

    const events = await JcashRegistrarInterfaceJSAPI.getRefundTokenEvents(jcashRegistrarAddress,
                                                                           { txhash: txHash }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.tokenaddress, erc20TokenAddress);
    global.assert.strictEqual(events[0].args.to, ethAccounts.testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });

  global.it('should test that it is not possible to refund tokens for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, ethAccounts.owner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, ethAccounts.owner, ethAccounts.testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, ethAccounts.testInvestor1, jcashRegistrarAddress, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    await JcashRegistrarInterfaceJSAPI.refundToken(jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, erc20TokenAddress, ethAccounts.testInvestor1, 10 * 17);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 10 * 17);

    const isThrows = await isContractThrows(JcashRegistrarInterfaceJSAPI.refundToken,
                                            [jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, erc20TokenAddress, ethAccounts.testInvestor1, 10 * 17]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to transfer ETH and operation charges 1JNT', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [], { from: ethAccounts.testInvestor1, to: jcashRegistrarAddress, value: valueToSend }
    );
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.transferEth(jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, ethAccounts.testInvestor1, valueToSend);

    let events = await JcashRegistrarInterfaceJSAPI.getTransferEthEvents(jcashRegistrarAddress,
                                                                         { txhash: txHash }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.to, ethAccounts.testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());

    events = await JNTPaymentGatewayStubJSAPI.getJNTChargedEvents(jntControllerAddress,
                                                                  { from: ethAccounts.testInvestor1 }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.payableservice, jcashRegistrarAddress);
    global.assert.strictEqual(events[0].args.from, ethAccounts.testInvestor1);
    global.assert.strictEqual(events[0].args.to, ethAccounts.jntBeneficiary);
    global.assert.strictEqual(events[0].args.value.toNumber(), exchangePrice);
  });


  global.it('should test that it is not possible to refund ETH for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [], { from: ethAccounts.testInvestor1, to: jcashRegistrarAddress, value: valueToSend }
    );

    await JcashRegistrarInterfaceJSAPI.transferEth(jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, ethAccounts.testInvestor1, valueToSend);

    const isThrows = await isContractThrows(JcashRegistrarInterfaceJSAPI.transferEth,
                                            [jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, ethAccounts.testInvestor1, valueToSend]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to transfer tokens and operation charges 1JNT', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, ethAccounts.owner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, ethAccounts.owner, ethAccounts.testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, ethAccounts.testInvestor1, jcashRegistrarAddress, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarInterfaceJSAPI.transferToken(jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, erc20TokenAddress, ethAccounts.testInvestor1, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());

    let events = await JcashRegistrarInterfaceJSAPI.getTransferTokenEvents(jcashRegistrarAddress,
                                                                           { txhash: txHash }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.tokenaddress, erc20TokenAddress);
    global.assert.strictEqual(events[0].args.to, ethAccounts.testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());

    events = await JNTPaymentGatewayStubJSAPI.getJNTChargedEvents(jntControllerAddress,
                                                                  { from: ethAccounts.testInvestor1 }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.payableservice, jcashRegistrarAddress);
    global.assert.strictEqual(events[0].args.from, ethAccounts.testInvestor1);
    global.assert.strictEqual(events[0].args.to, ethAccounts.jntBeneficiary);
    global.assert.strictEqual(events[0].args.value.toNumber(), exchangePrice);
  });

  global.it('should test that it is not possible to transfer tokens for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, ethAccounts.owner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, ethAccounts.owner, ethAccounts.testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, ethAccounts.testInvestor1, jcashRegistrarAddress, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    await JcashRegistrarInterfaceJSAPI.transferToken(jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, erc20TokenAddress, ethAccounts.testInvestor1, 10 * 17);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, ethAccounts.testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 10 * 17);

    const isThrows = await isContractThrows(JcashRegistrarInterfaceJSAPI.transferToken,
                                            [jcashRegistrarAddress, ethAccounts.managerJcashExchange, txHash, erc20TokenAddress, ethAccounts.testInvestor1, 10 * 17]);
    global.assert.strictEqual(isThrows, true);
  });
});
