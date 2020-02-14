/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity >=0.4.0 <0.6.0;


import '../feature/AssetID/AssetID.sol';
import '../../contracts/crydr/controller/CrydrControllerERC20/CrydrControllerERC20Interface.sol';
import '../../contracts/crydr/view/CrydrViewERC20Loggable/CrydrViewERC20LoggableInterface.sol';


/**
 * @title CrydrControllerERC20Stub
 * @dev This contract used only to test contracts
 */
contract CrydrControllerERC20Stub is AssetID,
                                     CrydrControllerERC20Interface,
                                     CrydrViewERC20LoggableInterface {

  /* Storage */

  string public tokenName = 'tokenName';
  string public tokenSymbol = 'tokenSymbol';
  uint8 public tokenDecimals = 18;

  uint256 public transferCounter = 0;
  uint256 public approveCounter = 0;
  uint256 public transferFromCounter = 0;

  address crydrView;


  /* Constructor */

  constructor (string memory _assetID, address _crydrView) public AssetID(_assetID) {
    crydrView = _crydrView;
  }


  /* CrydrControllerERC20Interface */

  function transfer(address _msgsender, address _to, uint256 _value) public
  {
    require(_msgsender == _msgsender); // always true, to avoid annoying compilation warnings
    require(_to == _to); // always true, to avoid annoying compilation warnings
    require(_value == _value); // always true, to avoid annoying compilation warnings

    transferCounter += 1;
  }

  function getTotalSupply() public view returns (uint256)
  {
    return 60 * (10 ** 18);
  }

  function getBalance(address _owner) public view returns (uint256)
  {
    require(_owner == _owner); // always true, to avoid annoying compilation warnings

    return 40 * (10 ** 18);
  }

  function approve(address _msgsender, address _spender, uint256 _value) public
  {
    require(_msgsender == _msgsender); // always true, to avoid annoying compilation warnings
    require(_spender == _spender); // always true, to avoid annoying compilation warnings
    require(_value == _value); // always true, to avoid annoying compilation warnings

    approveCounter += 1;
  }

  function transferFrom(address _msgsender, address _from, address _to, uint256 _value) public
  {
    require(_msgsender == _msgsender); // always true, to avoid annoying compilation warnings
    require(_from == _from); // always true, to avoid annoying compilation warnings
    require(_to == _to); // always true, to avoid annoying compilation warnings
    require(_value == _value); // always true, to avoid annoying compilation warnings

    transferFromCounter += 1;
  }

  function getAllowance(address _owner, address _spender) public view returns (uint256)
  {
    require(_owner == _owner); // always true, to avoid annoying compilation warnings
    require(_spender == _spender); // always true, to avoid annoying compilation warnings

    return 20 * (10 ** 18);
  }


  /* CrydrViewERC20LoggableInterface */

  function emitTransferEvent(address _from, address _to, uint256 _value) external
  {
    CrydrViewERC20LoggableInterface(crydrView).emitTransferEvent(_from, _to, _value);
  }

  function emitApprovalEvent(address _owner, address _spender, uint256 _value) external
  {
    CrydrViewERC20LoggableInterface(crydrView).emitApprovalEvent(_owner, _spender, _value);
  }
}
