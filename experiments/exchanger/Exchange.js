const Exchange = global.artifacts.require('Exchange.sol');


/* Migration promises */

// eslint-disable-next-line import/prefer-default-export
export const deployExchangeContract = async (deployer, owner) => {
  global.console.log('  Deploying Exchange ...');
  global.console.log(`\t\towner - ${owner}`);

  await deployer.deploy(Exchange,
                        { from: owner });
  return null;
};
