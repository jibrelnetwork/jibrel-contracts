const CrydrLicenseRegistryInterfaceArtifact = global.artifacts.require('CrydrLicenseRegistryInterface.sol');


/**
 * Getters
 */

export const isUserAllowed = async (contractAddress, userAddress, licenseName) => {
  global.console.log('\tFetch whether a user is allowed for a given action to a crydr contracts or not');
  const result = await CrydrLicenseRegistryInterfaceArtifact.at(contractAddress).isUserAllowed.call(userAddress, licenseName);
  global.console.log(`\t\tResult: ${result}`);
  return result;
};

export const verifyUserLicense = async (contractAddress, userAddress, licenseName) => {
  const isAllowed = await isUserAllowed(contractAddress, userAddress, licenseName);
  if (isAllowed !== true) {
    global.console.log(`\t\tERROR: user "${userAddress}" of a contract "${contractAddress}" is not allowed for the action "${licenseNameName}"`);
  }
  return isAllowed;
};
