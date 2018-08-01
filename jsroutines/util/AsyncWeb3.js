export async function getBlockNumber(web3Instance) {
  return new Promise((resolve, reject) => {
    web3Instance.eth.getBlock('latest', (e, result) => {
      if (e !== null) {
        reject(e);
      } else {
        resolve(result.number);
      }
    });
  });
}

export async function getTransactionReceipt(web3Instance, txHash) {
  return new Promise((resolve, reject) => {
    web3Instance.eth.getTransactionReceipt(txHash, (e, result) => {
      if (e !== null) {
        reject(e);
      } else {
        resolve(result);
      }
    });
  });
}

export async function getTransactionCount(web3Instance, address) {
  return new Promise((resolve, reject) => {
    web3Instance.eth.getTransactionCount(address, (e, result) => {
      if (e !== null) {
        reject(e);
      } else {
        resolve(result);
      }
    });
  });
}

export async function getBlock(web3Instance, blockNumber, bVal) {
  return new Promise((resolve, reject) => {
    web3Instance.eth.getBlock(blockNumber, bVal, (e, result) => {
      if (e !== null) {
        reject(e);
      } else {
        resolve(result);
      }
    });
  });
}
