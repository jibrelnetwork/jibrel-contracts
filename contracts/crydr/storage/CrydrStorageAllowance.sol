/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../lifecycle/Pausable.sol';
import '../../third-party/zeppelin-solidity/SafeMathInterface.sol';
import './CrydrStorageBaseInterface.sol';
import './CrydrStorageAllowanceInterface.sol';


/**
 * @title CrydrStorageBase
 */
contract CrydrStorageAllowance is Pausable,
                                  SafeMathInterface,
                                  CrydrStorageBaseInterface,
                                  CrydrStorageAllowanceInterface {

  /* Storage */

  mapping (address => mapping (address => uint256)) allowed;


  /* Low-level change of allowance and getters */

  function increaseAllowance(
    address _owner,
    address _spender,
    uint256 _value
  )
    public
    whenContractNotPaused
  {
    require(msg.sender == getCrydrController());

    require(_owner != address(0x0));
    require(_spender != address(0x0));
    require(_owner != _spender);
    require(_value > 0);

    allowed[_owner][_spender] = safeAdd(allowed[_owner][_spender], _value);
    AccountAllowanceIncreasedEvent(_owner, _spender, _value);
  }

  function decreaseAllowance(
    address _owner,
    address _spender,
    uint256 _value
  )
    public
    whenContractNotPaused
  {
    require(msg.sender == getCrydrController());

    require(_owner != address(0x0));
    require(_spender != address(0x0));
    require(_owner != _spender);
    require(_value > 0);

    allowed[_owner][_spender] = safeSub(allowed[_owner][_spender], _value);
    AccountAllowanceDecreasedEvent(_owner, _spender, _value);
  }

  function getAllowance(
    address _owner,
    address _spender
  )
    public
    constant
    returns (uint256)
  {
    require(_owner != address(0x0));
    require(_spender != address(0x0));
    require(_owner != _spender);

    return allowed[_owner][_spender];
  }
}
