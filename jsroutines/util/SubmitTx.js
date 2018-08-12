/**
 * Functions to wait until TX confirmed
 */

import { Mutex } from 'async-mutex';

import * as TxConfig from '../jsconfig/TxConfig';
import * as AsyncWeb3 from './AsyncWeb3';


/* Nonce tracker */

// we have to track nonce of TXs to be able to perform migrations via Infura and similar services
// It should be used very careful because we deploy contracts via truffle and perform all other transactions on our own
// get a new nonce for the TX

let nonceTrackerEnabled = false;
let nonceTracker = new Map();
const nonceMutex = new Mutex();

export function enableNonceTracker() {
  nonceTrackerEnabled = true;
}

export function disableNonceTracker() {
  nonceTrackerEnabled = false;
}

export function resetNonceTracker() {
  nonceTracker = new Map();
}

export async function getTxNonce(targetAddress) {
  if (nonceTrackerEnabled === false) {
    return -1;
  }

  const release = await nonceMutex.acquire();

  let txNonce;
  if (nonceTracker.has(targetAddress)) {
    txNonce = nonceTracker.get(targetAddress);
    nonceTracker.set(targetAddress, txNonce + 1);
    global.console.log(`\t\tAddress's "${targetAddress}" nonce adjusted by 1: ${txNonce} -> ${txNonce + 1}`);
  } else {
    txNonce = await AsyncWeb3.getTransactionCount(TxConfig.getWeb3(), targetAddress);
    nonceTracker.set(targetAddress, txNonce + 1);
    global.console.log(`\t\tAddress's "${targetAddress}" nonce started to track: ${txNonce} -> ${txNonce + 1}`);
  }

  release();

  return txNonce;
}

export async function syncTxNonceWithBlockchain(targetAddress) {
  if (nonceTrackerEnabled === false) {
    return -1;
  }

  const release = await nonceMutex.acquire();

  const txNonce = await AsyncWeb3.getTransactionCount(TxConfig.getWeb3(), targetAddress);
  nonceTracker.set(targetAddress, txNonce);

  release();

  return txNonce;
}


/* TX submission */

function doSleep(sleepTimeMsec) {
  return new Promise((resolve) => setTimeout(resolve, sleepTimeMsec));
}

async function waitTxConfirmation(txHash) {
  // inspired by this: https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6

  const txSubmitParams = TxConfig.getTxSubmitParams();

  if (txSubmitParams.minConfirmations <= 0) {
    // just skip if do not need to wait for confirmations. Greatly speed up testing with ethereum-testrpc
    return null;
  }

  const startTime  = new Date().getTime();
  const startBlock = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3());

  for (;;) {
    const transactionReceipt = await AsyncWeb3.getTransactionReceipt(TxConfig.getWeb3(), txHash); // eslint-disable-line no-await-in-loop
    const currentBlockNumber = await AsyncWeb3.getBlockNumber(TxConfig.getWeb3()); // eslint-disable-line no-await-in-loop
    if ((transactionReceipt !== null)
      && (currentBlockNumber - transactionReceipt.blockNumber >= (txSubmitParams.minConfirmations - 1))) {
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

export async function submitTxAndWaitConfirmation(txTemplate, methodArgs = [], txArgs = {}) {
  const txSubmitParams = TxConfig.getTxSubmitParams();
  const txArgsToSubmit = {
    ...txArgs,
    gasPrice: txSubmitParams.gasPrice,
    gas:      txSubmitParams.gasLimit,
  };
  if (nonceTrackerEnabled === true) {
    txArgsToSubmit.nonce = await getTxNonce(txArgs.from);
  }

  const txHash = await txTemplate(...methodArgs, txArgsToSubmit);
  global.console.log(`\tTX submitted: ${txHash}`);
  await waitTxConfirmation(txHash);
  return txHash;

  // todo fix all methods that use this method - return txhash to the caller
}
