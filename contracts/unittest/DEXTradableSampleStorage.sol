pragma solidity >=0.4.0 <0.6.0;


import '../jcash/assetbase/JCashCrydrStorage.sol';


contract DEXTradableSampleStorage is JCashCrydrStorage {
  constructor () public JCashCrydrStorage('DEX_ITEM') {}
}

