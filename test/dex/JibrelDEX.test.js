import * as BN from 'bn.js';

import * as TxConfig from '../../jsroutines/jsconfig/TxConfig';
import * as CrydrInit from '../../jsroutines/jsinit/CrydrInit';
import * as CheckExceptions from '../../jsroutines/util/CheckExceptions';

const JibrelDEX = artifacts.require('JibrelDEX');
const DEXSampleView = artifacts.require('DEXTradableSampleView');
const DEXSampleController = artifacts.require('DEXTradableSampleController');
const DEXSampleStorage = artifacts.require('DEXTradableSampleStorage');

const JUSDController = artifacts.require('JUSDController');
const JUSDStorage = artifacts.require('JUSDStorage');
const JUSDView = artifacts.require('JUSDViewERC20');


function respToObj(response){
  let obj = {};
  for(const k in response){
    if(isNaN(k)){
      var v = response[k];
      if (typeof v != 'string'){
        v = s.toString();
      }
      obj[k] = v;
    }
  }
  return obj;
}


function eventToObj(event){
  let obj = respToObj(event.args);
  return obj;
}



contract('JibrelDEX', accounts => {
  let JibrelDEXinstance;
  let DEXSampleViewInstance;
  let DEXSampleControllerInstance;
  let DEXSampleStorageInstance;
  let jusdc,
    jusdv,
    jusds;

  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();

  beforeEach(async () => {

    JibrelDEXinstance = await JibrelDEX.new({ from: ethAccounts.owner });

    DEXSampleViewInstance = await DEXSampleView.new({ from: ethAccounts.owner });
    DEXSampleControllerInstance = await DEXSampleController.new({ from: ethAccounts.owner });
    DEXSampleStorageInstance = await DEXSampleStorage.new({ from: ethAccounts.owner });

    await DEXSampleViewInstance.enableManager(JibrelDEXinstance.address, { from: ethAccounts.owner });

    await DEXSampleViewInstance.enableManager(ethAccounts.managerGeneral, { from: ethAccounts.owner });
    await DEXSampleViewInstance.grantManagerPermission(ethAccounts.managerGeneral, 'unpause_contract', { from: ethAccounts.owner });
    await DEXSampleViewInstance.grantManagerPermission(ethAccounts.managerGeneral, 'set_crydr_controller', { from: ethAccounts.owner });

    await DEXSampleStorageInstance.enableManager(ethAccounts.managerGeneral, { from: ethAccounts.owner });
    await DEXSampleStorageInstance.grantManagerPermission(ethAccounts.managerGeneral, 'unpause_contract', { from: ethAccounts.owner });
    await DEXSampleStorageInstance.grantManagerPermission(ethAccounts.managerGeneral, 'set_crydr_controller', { from: ethAccounts.owner });

    await DEXSampleControllerInstance.enableManager(ethAccounts.managerGeneral, { from: ethAccounts.owner });
    await DEXSampleControllerInstance.enableManager(JibrelDEXinstance.address, { from: ethAccounts.owner });
    await DEXSampleControllerInstance.grantManagerPermission(ethAccounts.managerGeneral, 'unpause_contract', { from: ethAccounts.owner });
    await DEXSampleControllerInstance.grantManagerPermission(ethAccounts.managerGeneral, 'set_crydr_view', { from: ethAccounts.owner });
    await DEXSampleControllerInstance.grantManagerPermission(ethAccounts.managerGeneral, 'set_crydr_storage', { from: ethAccounts.owner });
    await DEXSampleControllerInstance.grantManagerPermission(ethAccounts.managerGeneral, 'mint_crydr', { from: ethAccounts.owner });
    await DEXSampleControllerInstance.grantManagerPermission(JibrelDEXinstance.address, 'forced_transfer', { from: ethAccounts.owner });
    await DEXSampleControllerInstance.grantManagerPermission(JibrelDEXinstance.address, 'block_account_funds', { from: ethAccounts.owner });
    await DEXSampleControllerInstance.grantManagerPermission(JibrelDEXinstance.address, 'unblock_account_funds', { from: ethAccounts.owner });

    await DEXSampleViewInstance.setCrydrController(DEXSampleControllerInstance.address, { from: ethAccounts.managerGeneral });
    await DEXSampleStorageInstance.setCrydrController(DEXSampleControllerInstance.address, { from: ethAccounts.managerGeneral });

    await DEXSampleControllerInstance.setCrydrStorage(DEXSampleStorageInstance.address, { from: ethAccounts.managerGeneral });
    await DEXSampleControllerInstance.setCrydrView(DEXSampleViewInstance.address, 'erc20', { from: ethAccounts.managerGeneral });

    await DEXSampleControllerInstance.unpauseContract({ from: ethAccounts.managerGeneral });
    await DEXSampleViewInstance.unpauseContract({ from: ethAccounts.managerGeneral });
    await DEXSampleStorageInstance.unpauseContract({ from: ethAccounts.managerGeneral });

    var addr = await CrydrInit.initCrydr(JUSDStorage, JUSDController, JUSDView, 'erc20', ethAccounts);

    jusdc = await JUSDController.at(addr[1]);
    jusdv = await JUSDView.at(addr[2]);
    jusds = await JUSDStorage.at(addr[0]);

    await jusdc.enableManager(JibrelDEXinstance.address, { from: ethAccounts.owner });
    await jusdc.grantManagerPermission(JibrelDEXinstance.address, 'forced_transfer', { from: ethAccounts.owner });
    await jusdc.grantManagerPermission(JibrelDEXinstance.address, 'block_account_funds', { from: ethAccounts.owner });
    await jusdc.grantManagerPermission(JibrelDEXinstance.address, 'unblock_account_funds', { from: ethAccounts.owner });

    await jusdc.unpauseContract({ from: ethAccounts.managerPause });
    await jusds.unpauseContract({ from: ethAccounts.managerPause });
    await jusdv.unpauseContract({ from: ethAccounts.managerPause });

    await jusdc.mint(ethAccounts.testInvestor1, 100000, { from: ethAccounts.managerMint });
    await jusdc.mint(ethAccounts.testInvestor2, 10000, { from: ethAccounts.managerMint });
    await DEXSampleControllerInstance.mint(ethAccounts.testInvestor1, 2000, { from: ethAccounts.managerGeneral });
    await DEXSampleControllerInstance.mint(ethAccounts.testInvestor2, 4000, { from: ethAccounts.managerGeneral });

  });

  it('should create Buy Order', async () => {

    var res = await JibrelDEXinstance.listOrders();
    assert.strictEqual(res.length, 0);
    var ts = new Date('2050-12-12').getTime();

    res = await JibrelDEXinstance.placeBuyOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        1000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        5,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );
    var event = res['logs'][0];

    assert.strictEqual(event.args.orderCreator, ethAccounts.testInvestor1);
    assert.strictEqual(event.args.orderID.toString(), '0');
    assert.strictEqual(event.args.orderType.toString(), '0');
    assert.strictEqual(event.args.tradedAsset, DEXSampleViewInstance.address);
    assert.strictEqual(event.args.tradedAmount.toString(), '1000');
    assert.strictEqual(event.args.fiatAsset, jusdv.address);
    assert.strictEqual(event.args.assetPrice.toString(), '5');
    assert.strictEqual(event.args.expirationTimestamp.toString(), ts.toString());

    res = await JibrelDEXinstance.listOrders();
    var order = res[0]

    assert.strictEqual(order.orderCreator, ethAccounts.testInvestor1);
    assert.strictEqual(order.orderID, '0');
    assert.strictEqual(order.orderType, '0');
    assert.strictEqual(order.tradedAsset, DEXSampleViewInstance.address);
    assert.strictEqual(order.tradedAssetAmount, '1000');
    assert.strictEqual(order.fiatAsset, jusdv.address);
    assert.strictEqual(order.fiatPrice, '5');
    assert.strictEqual(order.remainingTradedAssetAmount, '1000');
    assert.strictEqual(order.expirationTimestamp, ts.toString());
    assert.strictEqual(order.orderStatus, '1');


  });

  it('should create Sell Order', async () => {

    var res = await JibrelDEXinstance.listOrders();
    assert.strictEqual(res.length, 0);
    var ts = new Date('2050-12-12').getTime();

    res = await JibrelDEXinstance.placeSellOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        1000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        5,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );
    var event = res['logs'][0];

    assert.strictEqual(event.args.orderCreator, ethAccounts.testInvestor1);
    assert.strictEqual(event.args.orderID.toString(), '0');
    assert.strictEqual(event.args.orderType.toString(), '1');
    assert.strictEqual(event.args.tradedAsset, DEXSampleViewInstance.address);
    assert.strictEqual(event.args.tradedAmount.toString(), '1000');
    assert.strictEqual(event.args.fiatAsset, jusdv.address);
    assert.strictEqual(event.args.assetPrice.toString(), '5');
    assert.strictEqual(event.args.expirationTimestamp.toString(), ts.toString());

    res = await JibrelDEXinstance.listOrders();
    var order = res[0]

    assert.strictEqual(order.orderCreator, ethAccounts.testInvestor1);
    assert.strictEqual(order.orderID, '0');
    assert.strictEqual(order.orderType, '1');
    assert.strictEqual(order.tradedAsset, DEXSampleViewInstance.address);
    assert.strictEqual(order.tradedAssetAmount, '1000');
    assert.strictEqual(order.fiatAsset, jusdv.address);
    assert.strictEqual(order.fiatPrice, '5');
    assert.strictEqual(order.remainingTradedAssetAmount, '1000');
    assert.strictEqual(order.expirationTimestamp, ts.toString());
    assert.strictEqual(order.orderStatus, '1');

  });

  it('should create Sell Trade', async () => {

    var ts = new Date('2050-12-12').getTime();

    var res = await JibrelDEXinstance.placeSellOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        1000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        5,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );

    res = await JibrelDEXinstance.executeSellOrder(0, 300, { from: ethAccounts.testInvestor2 });
    var bn = res.receipt.blockNumber;

    var events = res.logs;
    assert.strictEqual(events[0].event, 'TradePlacedEvent');
    assert.strictEqual(events[0].args.tradeCreator,  ethAccounts.testInvestor2);
    assert.strictEqual(events[0].args.tradeID.toString(),  '0');
    assert.strictEqual(events[0].args.orderID.toString(),  '0');
    assert.strictEqual(events[0].args.tradedAmount.toString(),  '300');

    assert.strictEqual(events[1].event, 'TradeCompletedEvent');
    assert.strictEqual(events[1].args.tradeID.toString(), '0');


    res = await JibrelDEXinstance.getOrderTrades(0);
    var trade = res[0];

    var b = await web3.eth.getBlock(bn);

    assert.strictEqual(trade.tradeCreator, ethAccounts.testInvestor2);
    assert.strictEqual(trade.orderID, '0');
    assert.strictEqual(trade.tradeID, '0');
    assert.strictEqual(trade.tradeAmount, '300');
    assert.strictEqual(trade.tradeStatus, '1');
    assert.strictEqual(trade.tradeCreationTimestamp, b.timestamp.toString());

    res = await JibrelDEXinstance.getOrderData(0);
    assert.strictEqual(res.remainingTradedAssetAmount, '700');
  });

  it('should create Buy Trade', async () => {

    var ts = new Date('2050-12-12').getTime();

    var res = await JibrelDEXinstance.placeBuyOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        1000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        5,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );

    res = await JibrelDEXinstance.executeBuyOrder(0, 400, { from: ethAccounts.testInvestor2 });
    var bn = res.receipt.blockNumber;

    var events = res.logs;
    assert.strictEqual(events[0].event, 'TradePlacedEvent');
    assert.strictEqual(events[0].args.tradeCreator,  ethAccounts.testInvestor2);
    assert.strictEqual(events[0].args.tradeID.toString(),  '0');
    assert.strictEqual(events[0].args.orderID.toString(),  '0');
    assert.strictEqual(events[0].args.tradedAmount.toString(),  '400');

    assert.strictEqual(events[1].event, 'TradeCompletedEvent');
    assert.strictEqual(events[1].args.tradeID.toString(), '0');


    res = await JibrelDEXinstance.getOrderTrades(0);
    var trade = res[0];

    var b = await web3.eth.getBlock(bn);
    assert.strictEqual(trade.tradeCreator, ethAccounts.testInvestor2);
    assert.strictEqual(trade.orderID, '0');
    assert.strictEqual(trade.tradeID, '0');
    assert.strictEqual(trade.tradeAmount, '400');
    assert.strictEqual(trade.tradeStatus, '1');
    assert.strictEqual(trade.tradeCreationTimestamp, b.timestamp.toString());

    var b = await web3.eth.getBlock(bn - 1);
    res = await JibrelDEXinstance.getOrderData(0);
    res = respToObj(res);
    console.log('ORD', res);
    assert.deepEqual(res, {
      orderCreator: ethAccounts.testInvestor1,
      orderID: '0',
      orderType: '0',
      tradedAsset: DEXSampleViewInstance.address,
      tradedAssetAmount:  '1000',
      fiatAsset: jusdv.address,
      fiatPrice: '5',
      remainingTradedAssetAmount: '600',
      expirationTimestamp: ts.toString(),
      orderCreationTimestamp: b.timestamp.toString(),
      orderStatus: '1',
    });


  });

  it('should set buy order completed', async () => {

    var ts = new Date('2050-12-12').getTime();

    var res = await JibrelDEXinstance.placeBuyOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        1000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        5,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );

    res = await JibrelDEXinstance.executeBuyOrder(0, 1000, { from: ethAccounts.testInvestor2 });
    var bn = res.receipt.blockNumber;
    var b = await web3.eth.getBlock(bn);
    res = await JibrelDEXinstance.getOrderData(0);
    res = respToObj(res);
    assert.deepEqual(res, {
      orderCreator: ethAccounts.testInvestor1,
      orderID: '0',
      orderType: '0',
      tradedAsset: DEXSampleViewInstance.address,
      tradedAssetAmount:  '1000',
      fiatAsset: jusdv.address,
      fiatPrice: '5',
      remainingTradedAssetAmount: '0',
      expirationTimestamp: ts.toString(),
      orderCreationTimestamp: b.timestamp.toString(),
      orderStatus: '2',
    });
  });

  it('should set sell order completed', async () => {

    var ts = new Date('2050-12-12').getTime();

    var res = await JibrelDEXinstance.placeSellOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        1000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        5,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );
    var bn = res.receipt.blockNumber;
    var b = await web3.eth.getBlock(bn);
    res = await JibrelDEXinstance.executeSellOrder(0, 1000, { from: ethAccounts.testInvestor2 });
    // var bn = res.receipt.blockNumber;
    // var b = await web3.eth.getBlock(bn);
    res = await JibrelDEXinstance.getOrderData(0);
    res = respToObj(res);
    assert.deepEqual(res, {
      orderCreator: ethAccounts.testInvestor1,
      orderID: '0',
      orderType: '1',
      tradedAsset: DEXSampleViewInstance.address,
      tradedAssetAmount:  '1000',
      fiatAsset: jusdv.address,
      fiatPrice: '5',
      remainingTradedAssetAmount: '0',
      expirationTimestamp: ts.toString(),
      orderCreationTimestamp: b.timestamp.toString(),
      orderStatus: '2',
    });
  });


  it('should reject create order if not enough assets/funds', async () => {

    var ts = new Date('2050-12-12').getTime();

    var throws = await CheckExceptions.isContractThrows( JibrelDEXinstance.placeSellOrder,
      [DEXSampleViewInstance.address, //address _tradedAsset
        5000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        5,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }],
      'Not enough Asset Amount',
    );

    assert.isTrue(throws, '"Not enough Asset Amount" is not thrown');

    var throws = await CheckExceptions.isContractThrows( JibrelDEXinstance.placeBuyOrder,
      [DEXSampleViewInstance.address, //address _tradedAsset
        50000,                          //uint256 _amountToBuy
        jusdv.address,                 //address _fiatAsset
        5,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }],
      'Not enough Fiat Amount',
    );

    assert.isTrue(throws, '"Not enough Fiat Amount" is not thrown');

  });

  it('should reject execute order if not enough assets/funds', async () => {

    var ts = new Date('2050-12-12').getTime();

    var res = await JibrelDEXinstance.placeSellOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        1000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        50,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );

    // res = await JibrelDEXinstance.executeSellOrder(0, 500, { from: ethAccounts.testInvestor2 });

    var throws = await CheckExceptions.isContractThrows( JibrelDEXinstance.executeSellOrder,
      [0, 500, { from: ethAccounts.testInvestor2 }],
      'Not enough Fiat Amount',
    );

    assert.isTrue(throws, '"Not enough Fiat Amount" is not thrown');

    var res = await JibrelDEXinstance.placeBuyOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        5000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        2,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );

    var throws = await CheckExceptions.isContractThrows( JibrelDEXinstance.executeBuyOrder,
      [1, 5000, { from: ethAccounts.testInvestor2 }],
      'Not enough Asset Amount',
    );

    assert.isTrue(throws, '"Not enough Asset Amount" is not thrown');

  });


  it('should reject execute order if creator and executer are same address', async () => {

    var ts = new Date('2050-12-12').getTime();

    var res = await JibrelDEXinstance.placeSellOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        1000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        50,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );


    var throws = await CheckExceptions.isContractThrows( JibrelDEXinstance.executeSellOrder,
      [0, 1, { from: ethAccounts.testInvestor1 }],
      'Could not execute order of yourself',
    );

    assert.isTrue(throws, '"Could not execute order of yourself" is not thrown');

    var res = await JibrelDEXinstance.placeBuyOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        5000,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        2,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );

    var throws = await CheckExceptions.isContractThrows( JibrelDEXinstance.executeBuyOrder,
      [1, 1, { from: ethAccounts.testInvestor1 }],
      'Could not execute order of yourself',
    );

    assert.isTrue(throws, '"Could not execute order of yourself" is not thrown');

  });

  it('should reject execute order if not enough remained amount', async () => {

    var ts = new Date('2050-12-12').getTime();

    var res = await JibrelDEXinstance.placeSellOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        10,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        50,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );


    var throws = await CheckExceptions.isContractThrows(JibrelDEXinstance.executeSellOrder,
      [0, 11, { from: ethAccounts.testInvestor2 }],
      'Not enough remained amount',
    );

    assert.isTrue(throws, '"Not enough remained amount" is not thrown');

    await JibrelDEXinstance.executeSellOrder(0, 5, { from: ethAccounts.testInvestor2 });

    throws = await CheckExceptions.isContractThrows(JibrelDEXinstance.executeSellOrder,
      [0, 6, { from: ethAccounts.testInvestor2 }],
      'Not enough remained amount',
    );

    assert.isTrue(throws, '"Not enough remained amount" is not thrown');

    var res = await JibrelDEXinstance.placeBuyOrder(
        DEXSampleViewInstance.address, //address _tradedAsset
        50,                          //uint256 _amountToSell
        jusdv.address,                 //address _fiatAsset
        2,                             //uint256 _assetPrice
        ts,                            //uint256 _expirationTimestamp
        { from: ethAccounts.testInvestor1 }
    );

    var throws = await CheckExceptions.isContractThrows( JibrelDEXinstance.executeBuyOrder,
      [1, 100, { from: ethAccounts.testInvestor2 }],
      'Not enough remained amount',
    );

    assert.isTrue(throws, '"Not enough remained amount" is not thrown');

    await JibrelDEXinstance.executeBuyOrder(1, 50, { from: ethAccounts.testInvestor2 });

    throws = await CheckExceptions.isContractThrows(JibrelDEXinstance.executeBuyOrder,
      [1, 60, { from: ethAccounts.testInvestor2 }],
      'Not enough remained amount',
    );

    assert.isTrue(throws, '"Not enough remained amount" is not thrown');

  });


  it('should cancelOrder works', async () => {

    var ts = new Date('2050-12-12').getTime();

    var res = await JibrelDEXinstance.placeSellOrder(
      DEXSampleViewInstance.address, //address _tradedAsset
      10,                          //uint256 _amountToSell
      jusdv.address,                 //address _fiatAsset
      5,                             //uint256 _assetPrice
      ts,                            //uint256 _expirationTimestamp
      { from: ethAccounts.testInvestor1 }
    );

    await JibrelDEXinstance.executeSellOrder(0, 5, { from: ethAccounts.testInvestor2 });

    await JibrelDEXinstance.cancelOrder(0, { from: ethAccounts.testInvestor1 });

    var throws = await CheckExceptions.isContractThrows(JibrelDEXinstance.executeSellOrder,
      [0, 3, { from: ethAccounts.testInvestor2 }],
      'Order not Active',
    );

    assert.isTrue(throws, '"Order not Active" is not thrown');


    var res = await JibrelDEXinstance.placeSellOrder(
      DEXSampleViewInstance.address, //address _tradedAsset
      10,                          //uint256 _amountToSell
      jusdv.address,                 //address _fiatAsset
      5,                             //uint256 _assetPrice
      ts,                            //uint256 _expirationTimestamp
      { from: ethAccounts.testInvestor1 }
    );

    await JibrelDEXinstance.executeSellOrder(1, 5, { from: ethAccounts.testInvestor2 });

    await JibrelDEXinstance.cancelOrder(1, { from: ethAccounts.testInvestor1 });

    var throws = await CheckExceptions.isContractThrows(JibrelDEXinstance.executeSellOrder,
      [1, 3, { from: ethAccounts.testInvestor2 }],
      'Order not Active',
    );

    assert.isTrue(throws, '"Order not Active" is not thrown');

  });
});
