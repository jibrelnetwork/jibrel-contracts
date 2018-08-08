/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.24;


/**
 * @title Exchange
 * @dev Allows customers to exchange ETH currency for another jUSD, jEUR, etc.
 */
contract Exchange {

  enum RequestStatus { None, InProgress, Completed }


  /* Data structures */

  struct ExchangeQuery {
    address sender;
    bytes32 id;
    uint value;
    uint timestamp;
    string symbol;
    RequestStatus status;
  }


  /* Storage */

  mapping (address => mapping (string => uint)) balances;
  mapping (bytes32 => ExchangeQuery) queries;
  mapping (address => uint) reqCount;
  address pricerAddress;
  address owner;


  /* Events */

  event ExchangeQueryEvent(address indexed sender, bytes32 id, uint timestamp, bytes32 symbol, uint value);
  event ExchangedEvent(address indexed sender, uint timestamp, bytes32 symbol, uint price, uint value);


  /* Constructor */

  function Exchange() {
    owner = msg.sender;
  }


  /* Modifiers */

  modifier onlyadmin {
    require(msg.sender == owner);

    _;
  }

  function changeAdmin(
    address _newAdmin
  )
    onlyadmin
  {
    owner = _newAdmin;
  }

  function addPricerAddress(
    address newPricerAddress
  )
    onlyadmin
  {
    require(newPricerAddress != address(0x0));

    pricerAddress = newPricerAddress;
  }

  function getPricerAddress() constant returns (address) {
	  return pricerAddress;
  }

  function __callback(bytes32 id, uint timestamp, string symbol, uint price, uint value) {
    require(msg.sender == pricerAddress);
    require(queries[id].sender != address(0x0));
    require(queries[id].status == RequestStatus.InProgress);
    require(queries[id].value == value);

    require(timestamp <= now + 60*60);

    balances[queries[id].sender][symbol] += value;
    // todo what we do if callback is never called

    ExchangedEvent(queries[id].sender, timestamp, symbol, price, value);

    queries[id].status = RequestStatus.Completed;
  }

  function close() onlyadmin {
    selfdestruct(owner);
  }

  // fallback function can be used to exchange to jUSD
  function() payable {
    buyTokens(now, 'jUSD');
  }

  function buyUSD() payable {
    buyTokens(now, 'jUSD');
  }

  function buyEUR() payable {
    buyTokens(now, 'jEUR');
  }

  // Low-level token exchange function
  function buyTokens(
    uint _timestamp,
    string _symbol
  )
    payable
    returns (bytes32 _id)
  {
    require(now <= _timestamp + 60*60);

    _id = sha3(this, msg.sender, reqCount[msg.sender]);
    reqCount[msg.sender]++;
    queries[_id] = ExchangeQuery(msg.sender, _id, msg.value, _timestamp, _symbol, RequestStatus.InProgress);

    ExchangeQueryEvent(msg.sender, _id, _timestamp, _symbol, msg.value);

    return _id;
  }
}
