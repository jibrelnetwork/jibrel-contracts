/* Storage */

const fs   = require('fs');
const path = require('path');


// todo different storage files for different networks

/* Helpers */

const checkAddress = (address) => {
  if (typeof address === 'undefined' || address === null || address.length < 20) {
    throw Error(`Please, specify correct address of deployed contract to proceed: ${address}`);
  }
};


/* API */

export const getAddress = (networkID, addressName) => {
  const deploymentStorageData = fs.readFileSync(path.resolve(__dirname, 'deployment_storage.json'), 'UTF-8');
  const deploymentStorage = JSON.parse(deploymentStorageData);

  if (Object.prototype.hasOwnProperty.call(deploymentStorage, networkID) === false) {
    throw Error(`Please, specify addresses of deployed contracts for the network '${networkID}' to proceed.`);
  }
  if (Object.prototype.hasOwnProperty.call(deploymentStorage[networkID], addressName) === false) {
    throw Error(
      `Please, specify address of deployed contract '${addressName}' for the network '${networkID}' to proceed.`);
  }
  checkAddress(deploymentStorage[networkID][addressName]);

  return deploymentStorage[networkID][addressName];
};

export const setAddress = (networkID, addressName, address) => {
  global.console.log(`\tPersist address '${addressName}' for the network '${networkID}': '${address}'`);
  checkAddress(address);

  const deploymentStorageData = fs.readFileSync(path.resolve(__dirname, 'deployment_storage.json'), 'UTF-8');
  const deploymentStorage     = JSON.parse(deploymentStorageData);

  if (Object.prototype.hasOwnProperty.call(deploymentStorage, networkID) === false) {
    deploymentStorage[networkID] = {};
  }
  deploymentStorage[networkID][addressName] = address;

  fs.writeFileSync(path.resolve(__dirname, 'deployment_storage.json'), JSON.stringify(deploymentStorage, null, 2), 'utf-8');
  global.console.log('\tAddress successfully persisted');
};

export const logStorage = (networkID) => {
  global.console.log(`\tLog current state of deployment storage for the network '${networkID}':`);

  const deploymentStorageData = fs.readFileSync(path.resolve(__dirname, 'deployment_storage.json'), 'UTF-8');
  const deploymentStorage     = JSON.parse(deploymentStorageData);

  // eslint-disable-next-line prefer-template
  const logStr = '\t\t' + JSON.stringify(deploymentStorage[networkID], null, 2).replace(/\n/g, '\n\t\t');
  global.console.log(logStr);
  global.console.log(`\tSuccessfully logged current state of deployment storage for the network '${networkID}'`);
};


/* Constants */

export const getInvestorRegistryAddress = (network) =>
  getAddress(network, 'address_investor-registry');
export const setInvestorRegistryAddress = (network, address) =>
  setAddress(network, 'address_investor-registry', address);

export const getCrydrRegistryAddress = (network) =>
  getAddress(network, 'address_crydr-registry');
export const setCrydrRegistryAddress = (network, address) =>
  setAddress(network, 'address_crydr-registry', address);

export const getJibrelApiAddress = (network) =>
  getAddress(network, 'address_jibrel-api');
export const setJibrelApiAddress = (network, address) =>
  setAddress(network, 'address_jibrel-api', address);

export const getCrydrStorageAddress = (network, crydrSymbol) =>
  getAddress(network, `address_crydr-${crydrSymbol}_storage`);
export const setCrydrStorageAddress = (network, crydrSymbol, address) =>
  setAddress(network, `address_crydr-${crydrSymbol}_storage`, address);

export const getCrydrControllerAddress = (network, crydrSymbol) =>
  getAddress(network, `address_crydr-${crydrSymbol}_controller`);
export const setCrydrControllerAddress = (network, crydrSymbol, address) =>
  setAddress(network, `address_crydr-${crydrSymbol}_controller`, address);

export const getCrydrViewAddress = (network, crydrSymbol, viewApiStandard) =>
  getAddress(network, `address_crydr-${crydrSymbol}_view-${viewApiStandard}`);
export const setCrydrViewAddress = (network, crydrSymbol, viewApiStandard, address) =>
  setAddress(network, `address_crydr-${crydrSymbol}_view-${viewApiStandard}`, address);
