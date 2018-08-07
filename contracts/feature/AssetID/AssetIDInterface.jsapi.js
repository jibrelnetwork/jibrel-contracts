const AssetIDInterfaceArtifact = global.artifacts.require('AssetIDInterface.sol');


/**
 * Getters
 */

export const getAssetID = async (contractAddress) => AssetIDInterfaceArtifact.at(contractAddress).getAssetID.call();

export const getAssetIDHash = async (contractAddress) => AssetIDInterfaceArtifact.at(contractAddress).getAssetIDHash.call();
