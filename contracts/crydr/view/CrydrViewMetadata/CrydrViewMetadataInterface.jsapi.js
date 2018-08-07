import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const CrydrViewMetadataInterfaceArtifact = global.artifacts.require('CrydrViewMetadataInterface.sol');


/**
 * Configuration
 */

export const setMetadata = async (crydrViewAddress, managerAddress,
                                  metadataKey, metadataValue) => {
  global.console.log('\tSet crydr view metadata:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tmetadataKey - ${metadataKey}`);
  global.console.log(`\t\tmetadataValue - ${metadataValue}`);
  await submitTxAndWaitConfirmation(
    CrydrViewMetadataInterfaceArtifact
      .at(crydrViewAddress)
      .setMetadata
      .sendTransaction,
    [metadataKey, metadataValue, { from: managerAddress }]);
  global.console.log('\tCrydr view metadata successfully set');
};

export const getMetadata = async (crydrViewAddress, metadataKey) =>
  CrydrViewMetadataInterfaceArtifact.at(crydrViewAddress).getMetadata.call(metadataKey);

export const getMetadataHash = async (crydrViewAddress, metadataKey) =>
  CrydrViewMetadataInterfaceArtifact.at(crydrViewAddress).getMetadataHash.call(metadataKey);
