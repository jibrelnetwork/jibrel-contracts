/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;

import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../../controller/CrydrControllerBase/CrydrControllerBaseInterface.sol';
import './JNTPaymentGatewayInterface.sol';

import '../../storage/CrydrStorageERC20/CrydrStorageERC20Interface.sol';
import '../../view/CrydrViewERC20Loggable/CrydrViewERC20LoggableInterface.sol';


/**
 * @title JNTPaymentGateway
 * @dev Allows to charge users by JNT
 */
contract JNTPaymentGateway is ManageableInterface,
                              CrydrControllerBaseInterface,
                              JNTPaymentGatewayInterface {

  function chargeJNT(
    address _from,
    address _to,
    uint256 _value
  )
    public
    onlyAllowedManager('jnt_payable_service')
  {
    CrydrStorageERC20Interface(getCrydrStorageAddress()).transfer(_from, _to, _value);

    emit JNTChargedEvent(msg.sender, _from, _to, _value);
    if (isCrydrViewRegistered('erc20') == true) {
      CrydrViewERC20LoggableInterface(getCrydrViewAddress('erc20')).emitTransferEvent(_from, _to, _value);
    }
  }
}
