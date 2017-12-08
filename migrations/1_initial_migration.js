global.artifacts = artifacts; // eslint-disable-line no-undef

const Migrations = global.artifacts.require('./Migrations.sol');

module.exports = (deployer) => {
  deployer.deploy(Migrations);
};
