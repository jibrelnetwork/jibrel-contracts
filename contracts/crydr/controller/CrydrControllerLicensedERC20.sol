/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import './CrydrControllerERC20Interface.sol';
import './CrydrControllerLicensedBaseInterface.sol';

import '../license/CrydrLicenseRegistryInterface.sol';


/**
 * @title CrydrControllerLicensedERC20 interface
 * @dev Interface of a contract that checks user`s license before performing ERC20 transfers
 */
contract CrydrControllerLicensedERC20 is CrydrControllerERC20Interface,
                                         CrydrControllerLicensedBaseInterface {

  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(
    address _msgsender,
    address _to,
    uint256 _value
  )
    public
  {
    require(CrydrLicenseRegistryInterface(getLicenseRegistryAddress())
              .isUserAllowed(_msgsender, 'transfer_funds') == true);
    require(CrydrLicenseRegistryInterface(getLicenseRegistryAddress())
                .isUserAllowed(_to, 'receive_funds') == true);

    super.transfer(_msgsender, _to, _value);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint256 _value
  )
    public
  {
    require(CrydrLicenseRegistryInterface(getLicenseRegistryAddress())
              .isUserAllowed(_msgsender, 'grant_approval') == true);
    require(CrydrLicenseRegistryInterface(getLicenseRegistryAddress())
              .isUserAllowed(_spender, 'get_approval') == true);

    super.approve(_msgsender, _spender, _value);
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint256 _value
  )
    public
  {
    require(CrydrLicenseRegistryInterface(getLicenseRegistryAddress())
              .isUserAllowed(_msgsender, 'spend_funds') == true);
    require(CrydrLicenseRegistryInterface(getLicenseRegistryAddress())
              .isUserAllowed(_from, 'transfer_funds') == true);
    require(CrydrLicenseRegistryInterface(getLicenseRegistryAddress())
              .isUserAllowed(_to, 'receive_funds') == true);

    super.transferFrom(_msgsender, _from, _to, _value);
  }
}
