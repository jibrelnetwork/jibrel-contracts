import { SubmitTxAndWaitConfirmation } from './utils/SubmitTx';

const Pausable = global.artifacts.require('Pausable.sol');


// eslint-disable-next-line import/prefer-default-export
export const unpauseContract = async (contractAddress, manager) => {
  global.console.log('\tUnpause contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await SubmitTxAndWaitConfirmation(
    Pausable
      .at(contractAddress)
      .unpause
      .sendTransaction,
    [{ from: manager }]
  );
  global.console.log('\t\tContract successfully unpaused');
  return null;
};
