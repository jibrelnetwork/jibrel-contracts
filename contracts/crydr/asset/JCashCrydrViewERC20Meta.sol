/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import './JCashCrydrViewERC20.sol';
import '../view/CrydrViewMetadata/CrydrViewMetadata.sol';


contract JCashCrydrViewERC20Meta is JCashCrydrViewERC20,
                                    CrydrViewMetadata {

  constructor (string _assetID, string _name, string _symbol, uint8 _decimals)
    public
    JCashCrydrViewERC20(_assetID, _name, _symbol, _decimals)
  { }
}
