const AssetID = global.artifacts.require('AssetID.sol');


/**
 * Getters
 */

export const getAssetID = async (contractAddress) => AssetID.at(contractAddress).getAssetID.call();

export const getAssetIDHash = async (contractAddress) => AssetID.at(contractAddress).getAssetIDHash.call();
