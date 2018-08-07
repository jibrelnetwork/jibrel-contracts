/* Web3 instance */

let web3Instance;

export function setWeb3(web3InstanceParam) {
  web3Instance = web3InstanceParam;
}

export function getWeb3() {
  return web3Instance;
}


/* Functions */

const txSubmitParamsProd = {
  minConfirmations:   1,
  pollingInterval:    500,
  maxTimeoutMillisec: 10 * 60 * 1000,
  maxTimeoutBlocks:   50,
  gasPrice:           100 * 1000000000,
};

const txSubmitParamsTestNetwork = {
  minConfirmations:   0,
  pollingInterval:    50,
  maxTimeoutMillisec: 60 * 1000,
  maxTimeoutBlocks:   5,
  gasPrice:           100 * 1000000000,
};

let txSubmitParams = null;

export function setNetworkType(networkType) {
  if (networkType === 'development' || networkType === 'coverage') {
    txSubmitParams = txSubmitParamsTestNetwork;
  } else {
    txSubmitParams = txSubmitParamsProd;
  }
}

export function getTxSubmitParams() {
  return txSubmitParams;
}
