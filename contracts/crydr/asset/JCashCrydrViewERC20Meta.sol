/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import './JCashCrydrViewERC20.sol';
import '../view/CrydrViewMetadata.sol';


contract JCashCrydrViewERC20Meta is JCashCrydrViewERC20,
                                    CrydrViewMetadata {

  function JCashCrydrViewERC20Meta(string _assetID, string _name, string _symbol, uint8 _decimals)
    public
    JCashCrydrViewERC20(_assetID, _name, _symbol, _decimals)
  { }
}
