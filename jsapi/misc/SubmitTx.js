/**
 * Functions to wait until TX confirmed
 */

/* Helpers */

function doSleep(sleepTimeMsec) {
  return new Promise((resolve) => setTimeout(resolve, sleepTimeMsec));
}


/* Web3 instance */

let web3Instance;

export function setWeb3(web3InstanceParam) {
  web3Instance = web3InstanceParam;
}


/* Functions */

let defaultWaitParams = {
  minConfirmations:   2,
  pollingInterval:    500,
  maxTimeoutMillisec: 5 * 60 * 1000,
  maxTimeoutBlocks:   20,
};

const defaultWaitParamsForTestNetwork = {
  minConfirmations:   0,
  pollingInterval:    50,
  maxTimeoutMillisec: 60 * 1000,
  maxTimeoutBlocks:   5,
};

export function setDefaultWaitParams(waitParams) {
  defaultWaitParams = waitParams;
}

export function setDefaultWaitParamsForTestNetwork() {
  defaultWaitParams = defaultWaitParamsForTestNetwork;
}

export async function waitTxConfirmation(txHash, waitParams = defaultWaitParams) {
  // inspired by this: https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6

  if (waitParams.minConfirmations <= 0) {
    // just skip if do not need to wait for confirmations. Greatly speed up testing with ethereum-testrpc
    return null;
  }

  const startTime  = new Date().getTime();
  const startBlock = web3Instance.eth.blockNumber;

  for (;;) {
    const transactionReceipt = web3Instance.eth.getTransactionReceipt(txHash);
    const currentBlockNumber = web3Instance.eth.blockNumber;
    if ((transactionReceipt !== null) &&
        (currentBlockNumber - transactionReceipt.blockNumber >= (waitParams.minConfirmations - 1))) {
      return null;
    }

    if (new Date().getTime() > startTime + waitParams.maxTimeoutMillisec) {
      throw new Error(`Transaction not minted in ${waitParams.maxTimeoutMillisec} milliseconds`);
    }
    if (currentBlockNumber > startBlock + waitParams.maxTimeoutBlocks) {
      throw new Error(`Transaction not minted in ${waitParams.maxTimeoutBlocks} blocks`);
    }

    await doSleep(waitParams.pollingInterval); // eslint-disable-line no-await-in-loop
  }
}

export async function submitTxAndWaitConfirmation(txTemplate, args = [], waitParams = defaultWaitParams) {
  const txHash = await txTemplate(...args);
  global.console.log(`\tTX submitted: ${txHash}`);
  await waitTxConfirmation(txHash, waitParams);
}
