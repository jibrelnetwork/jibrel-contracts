import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const MetadataInterfaceArtifact = global.artifacts.require('MetadataInterface.sol');


/**
 * Configuration
 */

export const setMetadata = async (contractAddress, managerAddress,
                                  metadataKey, metadataValue) => {
  global.console.log('\tSet contract metadata:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tmetadataKey - ${metadataKey}`);
  global.console.log(`\t\tmetadataValue - ${metadataValue}`);
  await submitTxAndWaitConfirmation(
    MetadataInterfaceArtifact
      .at(contractAddress)
      .setMetadata
      .sendTransaction,
    [metadataKey, metadataValue],
    { from: managerAddress }
  );
  global.console.log('\tContract metadata successfully set');
};

export const getMetadata = async (contractAddress, metadataKey) =>
  MetadataInterfaceArtifact.at(contractAddress).getMetadata.call(metadataKey);

export const getMetadataHash = async (contractAddress, metadataKey) =>
  MetadataInterfaceArtifact.at(contractAddress).getMetadataHash.call(metadataKey);
