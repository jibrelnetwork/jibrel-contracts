/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../../util/CommonModifiers.sol';
import '../../feature/assetid/AssetID.sol';
import '../../lifecycle/Ownable.sol';
import '../../lifecycle/Manageable.sol';
import '../../lifecycle/Pausable.sol';
import '../../feature/bytecode/BytecodeExecutor.sol';
import '../view/CrydrViewBase.sol';
import '../view/CrydrViewERC20.sol';
import '../view/CrydrViewERC20Loggable.sol';
import '../view/CrydrViewERC20Mintable.sol';
import '../view/CrydrViewERC20Named.sol';


contract JCashCrydrViewERC20 is CommonModifiers,
                                AssetID,
                                Ownable,
                                Manageable,
                                Pausable,
                                BytecodeExecutor,
                                CrydrViewBase,
                                CrydrViewERC20,
                                CrydrViewERC20Loggable,
                                CrydrViewERC20Mintable,
                                CrydrViewERC20Named {

  constructor (string _assetID, string _name, string _symbol, uint8 _decimals)
    public
    AssetID(_assetID)
    CrydrViewBase('erc20')
    CrydrViewERC20Named(_name, _symbol, _decimals)
  { }
}
