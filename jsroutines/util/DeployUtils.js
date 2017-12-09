const TxConfig = require('../jsconfig/TxConfig');
const DeployConfig = require('../jsconfig/DeployConfig');


// eslint-disable-next-line
export const deployContract = async (contractArtifact) => {
  global.console.log('\tDeploying contract.');

  const deployer = DeployConfig.getDeployer();
  const { owner } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);

  const blockNumberStart = TxConfig.getWeb3().eth.blockNumber;
  const txCount = TxConfig.getWeb3().eth.getTransactionCount(owner);

  await deployer.deploy(contractArtifact, { from: owner });

  const blockNumberEnd = TxConfig.getWeb3().eth.blockNumber;

  // find out contract address
  const contractInstance = await contractArtifact.deployed();
  const contractAddress = contractInstance.address;
  global.console.log(`\t\tContract successfully deployed: ${contractAddress}`);

  // find out amount of gas spent
  let txHash;
  for (let blockNumber = blockNumberStart; blockNumber <= blockNumberEnd; blockNumber += 1) {
    const blockData = TxConfig.getWeb3().eth.getBlock(blockNumber, true);
    const txObj = blockData.transactions.find(
      (txData) => (txData.from === owner && txData.to === '0x0' && txData.nonce === txCount)
    );
    if (txObj !== null && typeof txObj !== 'undefined') {
      txHash = txObj.hash;
      break;
    }
  }
  if (txHash === null || typeof txHash === 'undefined') {
    global.console.log('\t\tERROR. Failed to find tx data in recent blocks.');
  } else {
    const txReceipt = TxConfig.getWeb3().eth.getTransactionReceipt(txHash);
    global.console.log(`\t\tGas used to deploy contract: ${txReceipt.gasUsed}`);
  }

  return contractAddress;
};
