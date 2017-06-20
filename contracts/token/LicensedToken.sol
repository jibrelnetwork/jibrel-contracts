pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../zeppelin/token/StandardToken.sol";


/**
 * @title FiatToken
 * @dev Abstract class that implements frame to check licenses
 */
contract LicensedToken is StandardToken {

  function transfer(address _to, uint _value) onlyAllowedSpending(msg.sender, _to, _value) {
    super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint _value) onlyAllowedSpending(_from, _to, _value) {
    super.transferFrom(_from, _to, _value);
  }

  function approve(address _spender, uint _value) onlyAllowedApproval(msg.sender, _spender, _value) {
    super.approve(_spender, _value);
  }

  /**
   * @dev Function to check licenses
   * @param _from  address Sender address
   * @param _to    address Receiver address
   * @param _value uint    TX amount
   * @return True if transaction allowed
   */
  function isSpendingAllowed(address _from, address _to, uint _value) constant returns (bool result);

  /**
   * @dev Function to check licenses
   * @param _from    address Sender address
   * @param _spender address Spender address
   * @param _value   uint    TX amount
   * @return True if transaction allowed
   */
  function isApprovalAllowed(address _from, address _spender, uint _value) constant returns (bool result);

  /**
   * @dev Function to get info about required licenses.
   * @dev Data returned in JSON format. Assumed that function called only from client apps directly, gas usage can be huge
   * @return JSON data about required licenses. Format is implementation-specific
   */
  function getLicenseInfo() constant returns (string result);

  /**
   * @dev Modifier to check TX
   */
  modifier onlyAllowedSpending(address _from, address _to, uint _value) {
    if (isSpendingAllowed(_from, _to, _value) == false) {
      throw;
    }
    _;
  }

  /**
   * @dev Modifier to check approval
   */
  modifier onlyAllowedApproval(address _from, address _spender, uint _value) {
    if (isApprovalAllowed(_from, _spender, _value) == false) {
      throw;
    }
    _;
  }
}
