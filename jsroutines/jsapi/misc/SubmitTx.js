/**
 * Functions to wait until TX confirmed
 */

const TxConfig = require('../../jsconfig/TxConfig');


function doSleep(sleepTimeMsec) {
  return new Promise((resolve) => setTimeout(resolve, sleepTimeMsec));
}

export async function waitTxConfirmation(txHash) {
  // inspired by this: https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6

  const web3Instance = TxConfig.getWeb3();
  const txSubmitParams = TxConfig.getTxSubmitParams();

  if (txSubmitParams.minConfirmations <= 0) {
    // just skip if do not need to wait for confirmations. Greatly speed up testing with ethereum-testrpc
    return null;
  }

  const startTime  = new Date().getTime();
  const startBlock = web3Instance.eth.blockNumber;

  for (;;) {
    const transactionReceipt = web3Instance.eth.getTransactionReceipt(txHash);
    const currentBlockNumber = web3Instance.eth.blockNumber;
    if ((transactionReceipt !== null) &&
        (currentBlockNumber - transactionReceipt.blockNumber >= (txSubmitParams.minConfirmations - 1))) {
      return null;
    }

    if (new Date().getTime() > startTime + txSubmitParams.maxTimeoutMillisec) {
      throw new Error(`Transaction not minted in ${txSubmitParams.maxTimeoutMillisec} milliseconds`);
    }
    if (currentBlockNumber > startBlock + txSubmitParams.maxTimeoutBlocks) {
      throw new Error(`Transaction not minted in ${txSubmitParams.maxTimeoutBlocks} blocks`);
    }

    await doSleep(txSubmitParams.pollingInterval); // eslint-disable-line no-await-in-loop
  }
}

export async function submitTxAndWaitConfirmation(txTemplate, args = []) {
  const txHash = await txTemplate(...args);
  global.console.log(`\tTX submitted: ${txHash}`);
  await waitTxConfirmation(txHash);
}
