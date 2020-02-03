const ManageableInterfaceArtifact = global.artifacts.require('ManageableInterface.sol');


export const isManagerAllowed = async (contractAddress, manager, permissionName) => {
  let instance = await ManageableInterfaceArtifact.at(contractAddress);
  return await instance.isManagerAllowed(manager, permissionName);
}


export const verifyManagerAllowed = async (contractAddress, contractManager, permissionName) => {
  const isAllowed = await isManagerAllowed(contractAddress, contractManager, permissionName);
  if (isAllowed !== true) {
    global.console.log(`\t\tERROR: manager "${contractManager}" of a contract "${contractAddress}" is not allowed for the action "${permissionName}"`);
  }
  return isAllowed;
};
