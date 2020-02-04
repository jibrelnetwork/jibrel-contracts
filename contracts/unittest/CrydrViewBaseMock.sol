/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../util/CommonModifiers/CommonModifiers.sol';
import '../feature/AssetID/AssetID.sol';
import '../lifecycle/Ownable/Ownable.sol';
import '../lifecycle/Manageable/Manageable.sol';
import '../lifecycle/Pausable/Pausable.sol';
import '../crydr/view/CrydrViewBase/CrydrViewBase.sol';


contract CrydrViewBaseMock is CommonModifiers,
                              AssetID,
                              Ownable,
                              Manageable,
                              CrydrViewBase,
                              Pausable{

  constructor (string memory _assetID, string memory _crydrViewStandardName)
    public
    AssetID(_assetID)
    CrydrViewBase(_crydrViewStandardName)
  { }
}
