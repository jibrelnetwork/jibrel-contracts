const ERC20Named = global.artifacts.require('ERC20Named.sol');


/* Migration promises */

export const getSymbol = (contractAddress) => {
  global.console.log('\tGet symbol of ERC20 token');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  return ERC20Named
    .at(contractAddress)
    .symbol
    .call()
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};

export const getName = (contractAddress) => {
  global.console.log('\tGet name of ERC20 token');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  return ERC20Named
    .at(contractAddress)
    .name
    .call()
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};

export const getDecimals = (contractAddress) => {
  global.console.log('\tGet decimals of ERC20 token');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  return ERC20Named
    .at(contractAddress)
    .decimals
    .call()
    .then((value) => {
      global.console.log(`\tResult: ${value}`);
      return value;
    });
};
