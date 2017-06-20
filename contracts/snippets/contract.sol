pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../zeppelin/token/ERC20.sol";

import '../crydr/CryDRRepository.sol';
import '../API/JibrelAPI.sol';


/*
  Example of the simple smart contract that receive payments for electronics
*/
contract ElectronicsShopExample {

  address JibrelAPIAddress;

  event OrderPaidEvent(string indexed orderId, uint256 paymentAmount);

  //////////////////////////////////////////////////

  function payForOrder(string _orderId, uint256 _orderValue, address customerAddress) {
    address crydrRepo = JibrelAPIInterface(JibrelAPIAddress).getCryDRRepository();
    address jUSDAddress = CryDRRepository(crydrRepo).lookupCryDR('jUSD');
    ERC20 jUSD = ERC20(jUSDAddress);
    jUSD.transferFrom(customerAddress, address(this), _orderValue);
    OrderPaidEvent(_orderId, _orderValue);
  }

  function withdrawEarnings() {
    // require(msg.sender == owner);
    // ... implementation details
  }
}
