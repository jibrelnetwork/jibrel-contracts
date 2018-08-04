import { submitTxAndWaitConfirmation } from '../../jsroutines/util/SubmitTx';
import { isContractThrows } from '../../jsroutines/util/CheckExceptions';

import * as AsyncWeb3 from '../../jsroutines/util/AsyncWeb3';
import * as TxConfig from '../../jsroutines/jsconfig/TxConfig';
import * as DeployConfig from '../../jsroutines/jsconfig/DeployConfig';
import * as DeployUtils from '../../jsroutines/util/DeployUtils';

import * as OwnableJSAPI from '../../jsroutines/jsapi/lifecycle/Ownable';
import * as ManageableJSAPI from '../../jsroutines/jsapi/lifecycle/Manageable';

import * as JcashRegistrarInit from '../../jsroutines/jsinit/JcashRegistrarInit';
import * as JcashRegistrarJSAPI from '../../jsroutines/jsapi/jcash/JcashRegistrar.jsapi';
import * as Erc20MockJSAPI from '../../jsroutines/jsapi/unittest/Erc20Mock.jsapi';

const JcashRegistrarArtifact = global.artifacts.require('JcashRegistrar.sol');
const Erc20MockArtifact = global.artifacts.require('Erc20Mock.sol');
const BigNumber = require('bignumber.js');


global.contract('JcashRegistrar', (accounts) => {
  let JcashRegistrarInstance;

  DeployConfig.setAccounts(accounts);
  const { owner, managerPause, managerJcashReplenisher, managerJcashExchange, testInvestor1 } = DeployConfig.getAccounts();
  const contractOwner = owner;

  global.beforeEach(async () => {
    await DeployUtils.deployContractSimple(JcashRegistrarArtifact, contractOwner);
    JcashRegistrarInstance = await JcashRegistrarArtifact.new({ from: contractOwner });

    global.console.log('\tContract deployed for tests of JcashRegistrar:');
    global.console.log(`\t\tJcashRegistrarInstance: ${JcashRegistrarInstance.address}`);

    await JcashRegistrarInit.configureJcashRegistrar(JcashRegistrarInstance.address,
                                                     owner, managerPause, managerJcashReplenisher, managerJcashExchange);
  });


  global.it('should test initial configuration - owner', async () => {
    const receivedContractOwner = await OwnableJSAPI.getOwner(JcashRegistrarInstance.address);
    global.assert.strictEqual(receivedContractOwner, contractOwner);
  });

  global.it('should test initial configuration - replenisher', async () => {
    let isAllowed = await ManageableJSAPI.isManagerAllowed(JcashRegistrarInstance.address,
                                                           managerJcashReplenisher, 'replenish_eth');
    global.assert.strictEqual(isAllowed, true);
    isAllowed = await ManageableJSAPI.isManagerAllowed(JcashRegistrarInstance.address,
                                                       managerJcashReplenisher, 'replenish_token');
    global.assert.strictEqual(isAllowed, true);
  });

  global.it('should test initial configuration - exchange manager', async () => {
    let isAllowed = await ManageableJSAPI.isManagerAllowed(JcashRegistrarInstance.address,
                                                           managerJcashExchange, 'refund_eth');
    global.assert.strictEqual(isAllowed, true);
    isAllowed = await ManageableJSAPI.isManagerAllowed(JcashRegistrarInstance.address,
                                                       managerJcashExchange, 'refund_token');
    global.assert.strictEqual(isAllowed, true);
    isAllowed = await ManageableJSAPI.isManagerAllowed(JcashRegistrarInstance.address,
                                                       managerJcashExchange, 'transfer_eth');
    global.assert.strictEqual(isAllowed, true);
    isAllowed = await ManageableJSAPI.isManagerAllowed(JcashRegistrarInstance.address,
                                                       managerJcashExchange, 'transfer_token');
    global.assert.strictEqual(isAllowed, true);
  });


  global.it('should test that incoming ETH TXs are registered', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await submitTxAndWaitConfirmation(global.web3.eth.sendTransaction,
                                      [{ from: testInvestor1, to: JcashRegistrarInstance.address, value: valueToSend }]);

    const events = await JcashRegistrarJSAPI.getReceiveEthEvents(JcashRegistrarInstance.address,
                                                                 { from: testInvestor1 }, { fromBlock: blockNumber + 1 });
    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.from, testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that incoming ETH TXs from replenisher are registered', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await submitTxAndWaitConfirmation(global.web3.eth.sendTransaction,
                                      [{ from: managerJcashReplenisher, to: JcashRegistrarInstance.address, value: valueToSend }]);

    const events = await JcashRegistrarJSAPI.getReplenishEthEvents(JcashRegistrarInstance.address,
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
      [{ from: managerJcashReplenisher, to: JcashRegistrarInstance.address, value: valueToSend }]
    );

    // withdraw ETH from the contract
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarJSAPI.withdrawEth(JcashRegistrarInstance.address, managerJcashReplenisher, valueToSend);
    const replenisherBalanceFinish = await global.web3.eth.getBalance(managerJcashReplenisher);

    // check ETH have been actually withdrawn
    global.assert.approximately(replenisherBalanceFinish.toNumber(),
                                replenisherBalanceStart.toNumber(),
                                txPrice.toNumber());

    // check an event emitted
    const events = await JcashRegistrarJSAPI.getWithdrawEthEvents(JcashRegistrarInstance.address,
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
    await Erc20MockJSAPI.transfer(erc20TokenAddress, managerJcashReplenisher, JcashRegistrarInstance.address, valueToSend);
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarJSAPI.withdrawToken(JcashRegistrarInstance.address, managerJcashReplenisher, erc20TokenAddress, valueToSend);
    const replenisherBalanceFinish = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, managerJcashReplenisher);

    // check tokens have been actually withdrawn
    global.assert.strictEqual(replenisherBalanceFinish.toNumber(), replenisherBalanceStart.toNumber());

    // check an event emitted
    const events = await JcashRegistrarJSAPI.getWithdrawTokenEvents(JcashRegistrarInstance.address,
                                                                    { to: managerJcashReplenisher },
                                                                    { fromBlock: blockNumber + 1 });

    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.to, managerJcashReplenisher);
    global.assert.strictEqual(events[0].args.tokenaddress, erc20TokenAddress);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });


  global.it('should test that it is possible to refund ETH', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [{ from: testInvestor1, to: JcashRegistrarInstance.address, value: valueToSend }]
    );
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarJSAPI.refundEth(JcashRegistrarInstance.address, managerJcashExchange, txHash, testInvestor1, valueToSend);

    const events = await JcashRegistrarJSAPI.getRefundEthEvents(JcashRegistrarInstance.address,
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
      [{ from: testInvestor1, to: JcashRegistrarInstance.address, value: valueToSend }]
    );

    await JcashRegistrarJSAPI.refundEth(JcashRegistrarInstance.address, managerJcashExchange, txHash, testInvestor1, valueToSend);

    const isThrows = await isContractThrows(JcashRegistrarJSAPI.refundEth,
                                            [JcashRegistrarInstance.address, managerJcashExchange, txHash, testInvestor1, valueToSend]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to refund tokens', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, contractOwner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, contractOwner, testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, testInvestor1, JcashRegistrarInstance.address, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarJSAPI.refundToken(JcashRegistrarInstance.address, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());

    const events = await JcashRegistrarJSAPI.getRefundTokenEvents(JcashRegistrarInstance.address,
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


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, testInvestor1, JcashRegistrarInstance.address, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    await JcashRegistrarJSAPI.refundToken(JcashRegistrarInstance.address, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, 10 * 17);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 10 * 17);

    const isThrows = await isContractThrows(JcashRegistrarJSAPI.refundToken,
                                            [JcashRegistrarInstance.address, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, 10 * 17]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to transfer ETH', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const txHash = await submitTxAndWaitConfirmation(
      global.web3.eth.sendTransaction,
      [{ from: testInvestor1, to: JcashRegistrarInstance.address, value: valueToSend }]
    );
    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarJSAPI.transferEth(JcashRegistrarInstance.address, managerJcashExchange, txHash, testInvestor1, valueToSend);

    const events = await JcashRegistrarJSAPI.getTransferEthEvents(JcashRegistrarInstance.address,
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
      [{ from: testInvestor1, to: JcashRegistrarInstance.address, value: valueToSend }]
    );

    await JcashRegistrarJSAPI.transferEth(JcashRegistrarInstance.address, managerJcashExchange, txHash, testInvestor1, valueToSend);

    const isThrows = await isContractThrows(JcashRegistrarJSAPI.transferEth,
                                            [JcashRegistrarInstance.address, managerJcashExchange, txHash, testInvestor1, valueToSend]);
    global.assert.strictEqual(isThrows, true);
  });


  global.it('should test that it is possible to transfer tokens', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, contractOwner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, contractOwner, testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, testInvestor1, JcashRegistrarInstance.address, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    const blockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
    await JcashRegistrarJSAPI.transferToken(JcashRegistrarInstance.address, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());

    const events = await JcashRegistrarJSAPI.getTransferTokenEvents(JcashRegistrarInstance.address,
                                                                    { txhash: txHash }, { fromBlock: blockNumber + 1 });

    global.assert.strictEqual(events.length, 1, 'We were supposed to get exactly one event.');
    global.assert.strictEqual(events[0].args.txhash, txHash);
    global.assert.strictEqual(events[0].args.tokenaddress, erc20TokenAddress);
    global.assert.strictEqual(events[0].args.to, testInvestor1);
    global.assert.strictEqual(events[0].args.value.toNumber(), valueToSend.toNumber());
  });

  global.it('should test that it is not possible to transfer tokens for the same incoming TX twice', async () => {
    const valueToSend = new BigNumber(10).pow(18).mul(10);

    const erc20TokenAddress = await DeployUtils.deployContractSimple(Erc20MockArtifact, contractOwner);
    await Erc20MockJSAPI.mint(erc20TokenAddress, contractOwner, testInvestor1, valueToSend);

    let investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), valueToSend.toNumber());


    const txHash = await Erc20MockJSAPI.transfer(erc20TokenAddress, testInvestor1, JcashRegistrarInstance.address, valueToSend);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 0);

    await JcashRegistrarJSAPI.transferToken(JcashRegistrarInstance.address, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, 10 * 17);
    investor1Balance = await Erc20MockJSAPI.balanceOf(erc20TokenAddress, testInvestor1);
    global.assert.strictEqual(investor1Balance.toNumber(), 10 * 17);

    const isThrows = await isContractThrows(JcashRegistrarJSAPI.transferToken,
                                            [JcashRegistrarInstance.address, managerJcashExchange, txHash, erc20TokenAddress, testInvestor1, 10 * 17]);
    global.assert.strictEqual(isThrows, true);
  });
});
