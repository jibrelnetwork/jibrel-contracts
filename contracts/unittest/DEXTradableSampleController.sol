pragma solidity >=0.4.0 <0.6.0;


import '../jcash/assetbase/JCashCrydrControllerLicensed.sol';


contract DEXTradableSampleController is JCashCrydrControllerLicensed {
  constructor () public JCashCrydrControllerLicensed('DEX_ITEM') {}
}

