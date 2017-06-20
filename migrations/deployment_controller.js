/* eslint-disable no-console,global-require */

/* Storage */

const fs = require('fs');


/* Helpers */

const checkAddress = (address) => {
  if (typeof address === 'undefined' || address === null || address.length < 20
  ) {
    throw Error(`Please, specify correct address of deployed contract to proceed: ${address}`);
  }
};


/* API */

export const getAddress = (networkID, addressName) => {
  const deploymentStorage = require('./deployment_storage.json');

  if (Object.prototype.hasOwnProperty.call(deploymentStorage, networkID) === false) {
    throw Error(`Please, specify addresses of deployed contracts for the network '${networkID}' to proceed.`);
  }
  if (Object.prototype.hasOwnProperty.call(deploymentStorage[networkID], addressName) === false) {
    throw Error(`Please, specify address of deployed contract '${addressName}' for the network '${networkID}' to proceed.`);
  }
  checkAddress(deploymentStorage[networkID][addressName]);

  return deploymentStorage[networkID][addressName];
};

export const setAddress = (networkID, addressName, address) => {
  console.log(`  Persist address '${addressName}' for the network '${networkID}': '${address}'`);
  checkAddress(address);

  const deploymentStorage = require('./deployment_storage.json');

  if (Object.prototype.hasOwnProperty.call(deploymentStorage, networkID) === false) {
    deploymentStorage[networkID] = {};
  }
  deploymentStorage[networkID][addressName] = address;

  fs.writeFileSync('./migrations/deployment_storage.json', JSON.stringify(deploymentStorage, null, 2), 'utf-8');
  console.log('  Address successfully persisted');
};

export const logStorage = (networkID) => {
  console.log(`  Log current state of deployment storage for the network '${networkID}':`);
  const deploymentStorage = require('./deployment_storage.json');
  console.log(JSON.stringify(deploymentStorage[networkID], null, 2));
  console.log(`  Successfully logged current state of deployment storage for the network '${networkID}'`);
};
