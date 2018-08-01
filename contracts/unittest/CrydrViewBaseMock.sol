/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../util/CommonModifiers.sol';
import '../feature/assetid/AssetID.sol';
import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../lifecycle/Pausable.sol';
import '../crydr/view/CrydrViewBase.sol';


contract CrydrViewBaseMock is CommonModifiers,
                              AssetID,
                              Ownable,
                              Manageable,
                              Pausable,
                              CrydrViewBase {

  constructor (string _assetID, string _crydrViewStandardName)
    public
    AssetID(_assetID)
    CrydrViewBase(_crydrViewStandardName)
  { }
}
