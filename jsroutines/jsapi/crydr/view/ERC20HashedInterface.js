const ERC20HashedInterface = global.artifacts.require('ERC20HashedInterface.sol');


/**
 * Configuration
 */

export const getNameHash = async (contractAddress) =>
  ERC20HashedInterface.at(contractAddress).getNameHash.call();

export const getSymbolHash = async (contractAddress) =>
  ERC20HashedInterface.at(contractAddress).getSymbolHash.call();
