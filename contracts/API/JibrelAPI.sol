pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../utils/Manageable.sol";


/**
 * @title JibrelAPIInterface
 * @dev Interface of the Jibrel API contract
 */
contract JibrelAPIInterface {

  /* Events */

  event BODCChangedEvent(address indexed newAddress);
  event JibrelDAOChangedEvent(address indexed newAddress);
  event InvestorRepositoryChangedEvent(address indexed newAddress);
  event CryDRRepositoryChangedEvent(address indexed newAddress);


  /* Public functions */

  function getBODC() constant returns (address);
  function getJibrelDAO() constant returns (address);
  function getInvestorRepository() constant returns (address);
  function getCryDRRepository() constant returns (address);
}


/**
 * @title JibrelAPI
 * @dev Contract that implements the Jibrel API Interface
 */
contract JibrelAPI is JibrelAPIInterface, Manageable {

  /* Storage */

  address public BODC;
  address public JibrelDAO;
  address public InvestorRepository;
  address public CryDRRepository;


  /* Constructor */

  function JibrelAPI(
    address _BODC,
    address _JibrelDAO,
    address _InvestorRepository,
    address _CryDRRepository
  )
    checkAddress(_BODC)
    checkAddress(_JibrelDAO)
    checkAddress(_InvestorRepository)
    checkAddress(_CryDRRepository)
  {
    BODC = _BODC;
    JibrelDAO = _JibrelDAO;
    InvestorRepository = _InvestorRepository;
    CryDRRepository = _CryDRRepository;
  }


  /* Setters */

  function setBODC(address _newAddress) checkAddress(_newAddress) onlyManager('set_bodc') {
    BODC = _newAddress;
    BODCChangedEvent(_newAddress);
  }

  function setJibrelDAO(address _newAddress) checkAddress(_newAddress) onlyManager('set_jibrel_dao') {
    JibrelDAO = _newAddress;
    JibrelDAOChangedEvent(_newAddress);
  }

  function setInvestorRepository(address _newAddress) checkAddress(_newAddress) onlyManager('set_investor_repo') {
    InvestorRepository = _newAddress;
    InvestorRepositoryChangedEvent(_newAddress);
  }

  function setCryDRRepository(address _newAddress) checkAddress(_newAddress) onlyManager('set_crydr_repo') {
    CryDRRepository = _newAddress;
    CryDRRepositoryChangedEvent(_newAddress);
  }


  /* Getters */

  function getBODC() constant returns (address) {
    return BODC;
  }

  function getJibrelDAO() constant returns (address) {
    return JibrelDAO;
  }

  function getInvestorRepository() constant returns (address) {
    return InvestorRepository;
  }

  function getCryDRRepository() constant returns (address) {
    return CryDRRepository;
  }


  /**
   * @dev Modifier to check new address
   */
  modifier checkAddress(address _address) {
    if (_address == 0x0) {
      throw;
    }
    _;
  }
}
