const ERC20NamedInterface = global.artifacts.require('ERC20NamedInterface.sol');


/**
 * Configuration
 */

export const name = async (contractAddress) =>
  ERC20NamedInterface.at(contractAddress).name.call();

export const symbol = async (contractAddress) =>
  ERC20NamedInterface.at(contractAddress).symbol.call();

export const decimals = async (contractAddress) =>
  ERC20NamedInterface.at(contractAddress).decimals.call();

export const getNameHash = async (contractAddress) =>
  ERC20NamedInterface.at(contractAddress).getNameHash.call();

export const getSymbolHash = async (contractAddress) =>
  ERC20NamedInterface.at(contractAddress).getSymbolHash.call();
