import { submitTxAndWaitConfirmation } from './utils/SubmitTx';

const Pausable = global.artifacts.require('Pausable.sol');


export const unpauseContract = async (contractAddress, manager) => {
  global.console.log('\tUnpause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await submitTxAndWaitConfirmation(
    Pausable
      .at(contractAddress)
      .unpause
      .sendTransaction,
    [{ from: manager }],
  );
  global.console.log('\t\tContract successfully unpaused');
  return null;
};

export const pauseContract = async (contractAddress, manager) => {
  global.console.log('\tUnpause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await submitTxAndWaitConfirmation(
    Pausable
      .at(contractAddress)
      .pause
      .sendTransaction,
    [{ from: manager }],
  );
  global.console.log('\t\tContract successfully unpaused');
  return null;
};
