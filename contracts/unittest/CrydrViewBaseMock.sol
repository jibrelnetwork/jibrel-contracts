/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../crydr/view/CrydrViewBase.sol';


contract CrydrViewBaseMock is CrydrViewBase {

  function CrydrViewBaseMock(string _assetID, string _crydrViewStandardName)
    public
    AssetID(_assetID)
    CrydrViewBase(_crydrViewStandardName)
  { }
}
