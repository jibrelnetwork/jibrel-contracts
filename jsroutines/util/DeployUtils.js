import * as AsyncWeb3 from './AsyncWeb3';
import * as TxConfig from '../jsconfig/TxConfig';
import * as DeployConfig from '../jsconfig/DeployConfig';


const getUsedTxGas = async (blockNumberStart, blockNumberEnd, txSender, txNonce) => {
  let txHash;
  for (let blockNumber = blockNumberStart; blockNumber <= blockNumberEnd; blockNumber += 1) {
    const blockData = await AsyncWeb3.getBlock(TxConfig.getWeb3(), blockNumber, true); // eslint-disable-line no-await-in-loop
    const txObj = blockData.transactions.find(
      (txData) => (txData.from === txSender && txData.to === '0x0' && txData.nonce === txNonce)
    );
    if (txObj !== null && typeof txObj !== 'undefined') {
      txHash = txObj.hash;
      break;
    }
  }
  if (txHash === null || typeof txHash === 'undefined') {
    global.console.error('\t\tERROR. Failed to find tx data in recent blocks.');
    return undefined;
  } else { // eslint-disable-line no-else-return
    const txReceipt = await AsyncWeb3.getTransactionReceipt(TxConfig.getWeb3(), txHash);
    return txReceipt.gasUsed;
  }
};

const logUsedTxGas = async (blockNumberStart, blockNumberEnd, txSender, txNonce) => {
  const usedTxGas = await getUsedTxGas(blockNumberStart, blockNumberEnd, txSender, txNonce);
  if (usedTxGas === null || typeof usedTxGas === 'undefined') {
    global.console.error('\t\tERROR. Failed to find tx data in recent blocks.');
  } else {
    global.console.log(`\t\tGas used to deploy contract: ${usedTxGas}`);
  }
};


// eslint-disable-next-line
export const deployContractAndPersistArtifact = async (contractArtifact, contractOwner) => {
  global.console.log('\tDeploying contract and persist artifact to the hard drive.');
  global.console.log(`\t\towner - ${contractOwner}`);

  // record initial state of contract owner - to get info about deployed contract later
  const blockNumberStart = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
  const txCount = await AsyncWeb3.getTransactionCount(TxConfig.getWeb3(), contractOwner);

  // delpoy contract
  const contractInstance = await DeployConfig.getDeployer().deploy(contractArtifact, { from: contractOwner });
  global.console.log(`\t\tContract successfully deployed: ${contractInstance.address}`);

  // record state after the deployment
  const blockNumberEnd = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

  // find out amount of gas spent
  await logUsedTxGas(blockNumberStart, blockNumberEnd, contractOwner, txCount);

  return contractInstance.address;
};

export const deployContractSimple = async (contractArtifact, contractOwner) => {
  global.console.log('\tDeploying contract.');
  global.console.log(`\t\towner - ${contractOwner}`);

  const blockNumberStart = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());
  const txCount = await AsyncWeb3.getTransactionCount(TxConfig.getWeb3(), contractOwner);

  const contractInstance = await contractArtifact.new({ from: contractOwner });

  const blockNumberEnd = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

  const contractAddress = contractInstance.address;
  global.console.log(`\t\tContract successfully deployed: ${contractAddress}`);

  // find out amount of gas spent
  await logUsedTxGas(blockNumberStart, blockNumberEnd, contractOwner, txCount);

  return contractAddress;
};

export const deployContract = async (contractArtifact, contractOwner) => {
  const deployer = DeployConfig.getDeployer();
  let contractAddress;
  if (deployer !== null && typeof deployer !== 'undefined') {
    contractAddress = await deployContractAndPersistArtifact(contractArtifact, contractOwner);
  } else {
    contractAddress = await deployContractSimple(contractArtifact, contractOwner);
  }
  return contractAddress;
};
