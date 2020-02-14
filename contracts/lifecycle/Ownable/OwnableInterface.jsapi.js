const OwnableInterfaceArtifact = global.artifacts.require('OwnableInterface.sol');


export const getOwner = async (contractAddress) => {
  const instance = await OwnableInterfaceArtifact.at(contractAddress);
  return await instance.getOwner();
}

export const verifyOwner = async (contractAddress, contractOwner) => {
  const receivedContractOwner = await getOwner(contractAddress);
  const result = (receivedContractOwner === contractOwner);
  if (result !== true) {
    global.console.log(`\t\tERROR: owner "${receivedContractOwner}" of a contract "${contractAddress}" does not match expected value "${contractOwner}"`);
  }
  return result;
};
