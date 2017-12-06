/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../lifecycle/Manageable.sol";


/**
 * @title JibrelAPIInterface
 * @dev Interface of the Jibrel API contract
 */
contract JibrelAPIInterface {

  /* Events */

  event BODCChangedEvent(address indexed newAddress);
  event JibrelDAOChangedEvent(address indexed newAddress);
  event InvestorRegistryChangedEvent(address indexed newAddress);
  event CryDRRegistryChangedEvent(address indexed newAddress);


  /* Public functions */

  function getBODC() public constant returns (address);
  function getJibrelDAO() public constant returns (address);
  function getInvestorRegistry() public constant returns (address);
  function getCryDRRegistry() public constant returns (address);
}


/**
 * @title JibrelAPI
 * @dev Contract that implements the Jibrel API Interface. Just a draft
 */
contract JibrelAPI is JibrelAPIInterface, Manageable {

  /* Storage */

  address BODC;
  address JibrelDAO;
  address InvestorRegistry;
  address CryDRRegistry;


  /* Constructor */

  function JibrelAPI(
    address _BODC,
    address _JibrelDAO,
    address _InvestorRegistry,
    address _CryDRRegistry
  )
  {
    require(_BODC != 0x0);
    require(_JibrelDAO != 0x0);
    require(_InvestorRegistry != 0x0);
    require(_CryDRRegistry != 0x0);

    BODC = _BODC;
    JibrelDAO = _JibrelDAO;
    InvestorRegistry = _InvestorRegistry;
    CryDRRegistry = _CryDRRegistry;
  }


  /* Setters */

  function setBODC(address _newAddress) checkAddress(_newAddress) onlyAllowedManager('set_bodc') {
    BODC = _newAddress;
    BODCChangedEvent(_newAddress);
  }

  function setJibrelDAO(address _newAddress) checkAddress(_newAddress) onlyAllowedManager('set_jibrel_dao') {
    JibrelDAO = _newAddress;
    JibrelDAOChangedEvent(_newAddress);
  }

  function setInvestorRegistry(address _newAddress) checkAddress(_newAddress) onlyAllowedManager('set_investor_repo') {
    InvestorRegistry = _newAddress;
    InvestorRegistryChangedEvent(_newAddress);
  }

  function setCryDRRegistry(address _newAddress) checkAddress(_newAddress) onlyAllowedManager('set_crydr_repo') {
    CryDRRegistry = _newAddress;
    CryDRRegistryChangedEvent(_newAddress);
  }


  /* Getters */

  function getBODC() public constant returns (address) {
    return BODC;
  }

  function getJibrelDAO() public constant returns (address) {
    return JibrelDAO;
  }

  function getInvestorRegistry() public constant returns (address) {
    return InvestorRegistry;
  }

  function getCryDRRegistry() public constant returns (address) {
    return CryDRRegistry;
  }


  /**
   * @dev Modifier to check new address
   */
  modifier checkAddress(address _address) {
    require (_address != 0x0);
    _;
  }
}
