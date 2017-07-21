const Pausable = global.artifacts.require('Pausable.sol');


// eslint-disable-next-line import/prefer-default-export
export const unpauseContract = (manager, contractAddress) => {
  global.console.log('\tUnpause contract:');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcontract - ${contractAddress}`);
  return Pausable
    .at(contractAddress)
    .unpause
    .sendTransaction({ from: manager })
    .then(() => {
      global.console.log('\t\tContract successfully unpaused');
      return null;
    });
};
