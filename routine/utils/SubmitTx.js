/**
 * Functions to wait until TX confirmed
 */

import * as GlobalConfig from './GlobalConfig';


/* Helpers */

function doSleep(sleepTimeMsec) {
  return new Promise((resolve) => setTimeout(resolve, sleepTimeMsec));
}


/* Functions */

let defaultWaitParams = {
  minConfirmations:   2,
  pollingInterval:    500,
  maxTimeoutMillisec: 5 * 60 * 1000,
  maxTimeoutBlocks:   20,
};

export function setDefaultWaitParams(waitParams) {
  defaultWaitParams = waitParams;
}

export async function waitTxConfirmation(txHash, waitParams = defaultWaitParams) {
  // inspired by this: https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6

  if (waitParams.minConfirmations <= 0) {
    // just skip if do not need to wait for confirmations. Greatly speed up testing with ethereum-testrpc
    return null;
  }

  const startTime  = new Date().getTime();
  const startBlock = GlobalConfig.getWeb3().eth.blockNumber;

  for (;;) {
    const transactionReceipt = GlobalConfig.getWeb3().eth.getTransactionReceipt(txHash);
    const currentBlockNumber = GlobalConfig.getWeb3().eth.blockNumber;
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

// todo make the same for a list of promises, see Manageable routines, grantPermissions
export async function submitTxAndWaitConfirmation(txTemplate, args = [], waitParams = defaultWaitParams) {
  const txHash = await txTemplate(...args);
  global.console.log(`\tTX submitted: ${txHash}`);
  await waitTxConfirmation(txHash, waitParams);
}
