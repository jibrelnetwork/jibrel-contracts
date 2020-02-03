/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../util/CommonModifiers/CommonModifiers.sol';
import '../../feature/AssetID/AssetID.sol';
import '../../lifecycle/Ownable/Ownable.sol';
import '../../lifecycle/Manageable/Manageable.sol';
import '../../lifecycle/Pausable/Pausable.sol';
import '../../feature/BytecodeExecutor/BytecodeExecutor.sol';
import '../../crydr/view/CrydrViewBase/CrydrViewBase.sol';
import '../../crydr/view/CrydrViewERC20/CrydrViewERC20.sol';
import '../../crydr/view/CrydrViewERC20Loggable/CrydrViewERC20Loggable.sol';
import '../../crydr/view/CrydrViewERC20Mintable/CrydrViewERC20Mintable.sol';
import '../../crydr/view/CrydrViewERC20Named/CrydrViewERC20Named.sol';


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
