const ManageableInterfaceArtifact = global.artifacts.require('ManageableInterface.sol');


export const isManagerAllowed = (contractAddress, manager, permissionName) =>
  ManageableInterfaceArtifact.at(contractAddress).isManagerAllowed.call(manager, permissionName);

export const verifyManagerAllowed = async (contractAddress, contractManager, permissionName) => {
  const isAllowed = await isManagerAllowed(contractAddress, contractManager, permissionName);
  if (isAllowed !== true) {
    global.console.log(`\t\tERROR: manager "${contractManager}" of a contract "${contractAddress}" is not allowed for the action "${permissionName}"`);
  }
  return isAllowed;
};
