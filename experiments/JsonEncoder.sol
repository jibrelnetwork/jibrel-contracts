/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import "../third-party/solidity-stringutils/strings.sol";


/**
 * @title JsonEncoder
 * @dev Contract with helper methods to combine JSON strings
 */
contract JsonEncoder {

  /* Libs */

  using strings for *;


  /* JSON methods */

  function addressToAsciiString(address x) internal constant returns (string) {
    bytes memory s = new bytes(42);
    s[0] = 0x30;
    s[1] = 0x78;
    for (uint256 i = 0; i < 20; i++) {
      byte b = byte(uint8(uint(x) / (2 ** (8 * (19 - i)))));
      byte hi = byte(uint8(b) / 16);
      byte lo = byte(uint8(b) - 16 * uint8(hi));
      s[2 + 2 * i] = byteToChar(hi);
      s[2 + 2 * i + 1] = byteToChar(lo);
    }
    return string(s);
  }

  function sha3ToAsciiString(bytes32 x) internal constant returns (string) {
    bytes memory bytesString = new bytes(2 + 32 * 2);
    bytesString[0] = 0x30;
    bytesString[1] = 0x78;
    for (uint256 j = 0; j < 32; j++) {
      byte b = x[j];
      byte hi = byte(uint8(b) / 16);
      byte lo = byte(uint8(b) - 16 * uint8(hi));
      bytesString[2 + 2 * j] = byteToChar(hi);
      bytesString[2 + 2 * j + 1] = byteToChar(lo);
    }
    return string(bytesString);
  }

  function uintToAsciiString(uint256 _num) public constant returns (string) {
    return bytes32ToString(uintToBytes(_num));
  }

  function boolToAsciiString(bool _val) public constant returns (string) {
    return (_val == true) ? "true" : "false";
  }


  /* Helpers */

  function byteToChar(byte b) internal constant returns (byte c) {
    if (b < 10) {
      return byte(uint8(b) + 0x30);
    }
    else {
      return byte(uint8(b) + 0x57);
    }
  }

  function bytes32ToString(bytes32 x) internal constant returns (string) {
    bytes memory bytesString = new bytes(32);
    uint256 charCount = 0;
    for (uint256 j = 0; j < 32; j++) {
      byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
      if (char != 0) {
        bytesString[charCount] = char;
        charCount++;
      }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
      bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
  }

  function uintToBytes(uint256 _num) internal constant returns (bytes32 ret) {
    if (_num == 0) {
      ret = '0';
    }
    else {
      while (_num > 0) {
        ret = bytes32(uint(ret) / (2 ** 8));
        ret |= bytes32(((_num % 10) + 48) * 2 ** (8 * 31));
        _num /= 10;
      }
    }
    return ret;
  }
}
