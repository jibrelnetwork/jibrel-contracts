/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../util/CommonModifiers.sol';
import '../feature/assetid/AssetID.sol';
import '../crydr/view/CrydrViewBase.sol';


contract CrydrViewBaseMock is CommonModifiers,
                              AssetID,
                              CrydrViewBase {

  function CrydrViewBaseMock(string _assetID, string _crydrViewStandardName)
    public
    AssetID(_assetID)
    CrydrViewBase(_crydrViewStandardName)
  { }
}
