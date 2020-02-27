import * as TxConfig from '../../jsroutines/jsconfig/TxConfig';
import * as CrydrInit from '../../jsroutines/jsinit/CrydrInit';

const JibrelDEX = artifacts.require("JibrelDEX");
const DEXSampleView = artifacts.require("DEXTradableSampleView");
const DEXSampleController = artifacts.require("DEXTradableSampleController");
const DEXSampleStorage = artifacts.require("DEXTradableSampleStorage");

const JUSDController = artifacts.require("JUSDController");
const JUSDStorage = artifacts.require("JUSDStorage");
const JUSDView = artifacts.require("JUSDViewERC20");

contract("JibrelDEX", accounts => {
  let JibrelDEXinstance;
  let DEXSampleViewInstance;
  let DEXSampleControllerInstance;
  let DEXSampleStorageInstance;
  let jusdc, jusdv, jusds;

  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();

  beforeEach(async () => {

    JibrelDEXinstance = await JibrelDEX.new({ from: ethAccounts.owner });

    DEXSampleViewInstance = await DEXSampleView.new({ from: ethAccounts.owner });
    DEXSampleControllerInstance = await DEXSampleController.new({ from: ethAccounts.owner });
    DEXSampleStorageInstance = await DEXSampleStorage.new({ from: ethAccounts.owner });

    await DEXSampleViewInstance.enableManager(JibrelDEXinstance.address, { from: ethAccounts.owner });
    await DEXSampleViewInstance.grantManagerPermission(JibrelDEXinstance.address, 'forced_transfer', { from: ethAccounts.owner });
    await DEXSampleViewInstance.grantManagerPermission(JibrelDEXinstance.address, 'block_account_funds', { from: ethAccounts.owner });
    await DEXSampleViewInstance.grantManagerPermission(JibrelDEXinstance.address, 'unblock_account_funds', { from: ethAccounts.owner });

    await DEXSampleViewInstance.enableManager(ethAccounts.managerGeneral, { from: ethAccounts.owner });
    await DEXSampleViewInstance.grantManagerPermission(ethAccounts.managerGeneral, 'unpause_contract', { from: ethAccounts.owner });
    await DEXSampleViewInstance.grantManagerPermission(ethAccounts.managerGeneral, 'set_crydr_controller', { from: ethAccounts.owner });

    await DEXSampleStorageInstance.enableManager(ethAccounts.managerGeneral, { from: ethAccounts.owner });
    await DEXSampleStorageInstance.grantManagerPermission(ethAccounts.managerGeneral, 'unpause_contract', { from: ethAccounts.owner });
    await DEXSampleStorageInstance.grantManagerPermission(ethAccounts.managerGeneral, 'set_crydr_controller', { from: ethAccounts.owner });

    await DEXSampleControllerInstance.enableManager(ethAccounts.managerGeneral, { from: ethAccounts.owner });
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

    await jusdc.grantManagerPermission(JibrelDEXinstance.address, 'forced_transfer', { from: ethAccounts.owner });
    await jusdc.grantManagerPermission(JibrelDEXinstance.address, 'block_account_funds', { from: ethAccounts.owner });
    await jusdc.grantManagerPermission(JibrelDEXinstance.address, 'unblock_account_funds', { from: ethAccounts.owner });

    await jusdc.unpauseContract({ from: ethAccounts.managerPause });
    await jusds.unpauseContract({ from: ethAccounts.managerPause });
    await jusdv.unpauseContract({ from: ethAccounts.managerPause });

    console.log('C paused???', await jusdc.getPaused());
    console.log('S paused???', await jusds.getPaused());
    console.log('V paused???', await jusdv.getPaused());
    await jusdc.mint(ethAccounts.testInvestor1, 1000000, { from: ethAccounts.managerMint });

  });

  it("should create sell order", async () => {

    var res = await JibrelDEXinstance.listOrders();
    assert.strictEqual(res.length, 0);

    res = await JibrelDEXinstance.placeBuyOrder(
      DEXSampleViewInstance.address,          //address _tradedAsset,
      1000,                                   //uint256 _amountToSell,
      jusdc.address,                 //address _fiatAsset,
      5,                                      //uint256 _assetPrice,
      new Date("2050-12-12").getTime(),  //uint256 _expirationTimestamp,
      { from: ethAccounts.testInvestor1 });

    assert.strictEqual(res, 1);

  });

      // .then(instance => instance.getBalance.call(accounts[0]))
      // .then(balance => {
      //   assert.equal(
      //     balance.valueOf(),
      //     10000,
      //     "10000 wasn't in the first account"
      //   );
      // }));

  // it("should call a function that depends on a linked library", () => {
  //   let meta;
  //   let metaCoinBalance;
  //   let metaCoinEthBalance;
  //
  //   return MetaCoin.deployed()
  //     .then(instance => {
  //       meta = instance;
  //       return meta.getBalance.call(accounts[0]);
  //     })
  //     .then(outCoinBalance => {
  //       metaCoinBalance = outCoinBalance.toNumber();
  //       return meta.getBalanceInEth.call(accounts[0]);
  //     })
  //     .then(outCoinBalanceEth => {
  //       metaCoinEthBalance = outCoinBalanceEth.toNumber();
  //     })
  //     .then(() => {
  //       assert.equal(
  //         metaCoinEthBalance,
  //         2 * metaCoinBalance,
  //         "Library function returned unexpected function, linkage may be broken"
  //       );
  //     });
  // });
  //
  // it("should send coin correctly", () => {
  //   let meta;
  //
  //   // Get initial balances of first and second account.
  //   const account_one = accounts[0];
  //   const account_two = accounts[1];
  //
  //   let account_one_starting_balance;
  //   let account_two_starting_balance;
  //   let account_one_ending_balance;
  //   let account_two_ending_balance;
  //
  //   const amount = 10;
  //
  //   return MetaCoin.deployed()
  //     .then(instance => {
  //       meta = instance;
  //       return meta.getBalance.call(account_one);
  //     })
  //     .then(balance => {
  //       account_one_starting_balance = balance.toNumber();
  //       return meta.getBalance.call(account_two);
  //     })
  //     .then(balance => {
  //       account_two_starting_balance = balance.toNumber();
  //       return meta.sendCoin(account_two, amount, { from: account_one });
  //     })
  //     .then(() => meta.getBalance.call(account_one))
  //     .then(balance => {
  //       account_one_ending_balance = balance.toNumber();
  //       return meta.getBalance.call(account_two);
  //     })
  //     .then(balance => {
  //       account_two_ending_balance = balance.toNumber();
  //
  //       assert.equal(
  //         account_one_ending_balance,
  //         account_one_starting_balance - amount,
  //         "Amount wasn't correctly taken from the sender"
  //       );
  //       assert.equal(
  //         account_two_ending_balance,
  //         account_two_starting_balance + amount,
  //         "Amount wasn't correctly sent to the receiver"
  //       );
  //     });
  // });
});
