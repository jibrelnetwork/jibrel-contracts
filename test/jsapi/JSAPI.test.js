const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ERC20Interface = global.artifacts.require('ERC20Interface.sol');
const ERC20ValidatableInterface = global.artifacts.require('CrydrViewERC20ValidatableInterface.sol');

global.contract('ERC20 & CrydrViewERC20Validatable jsapi', async (accounts) => {
  const jsapiProjectDirPath = path.resolve(__dirname, '..', 'jibrel-contracts-jsapi');

  try {
    fs.accessSync(jsapiProjectDirPath);
  } catch (e) {
    return;
  }

  const ERC20Instance = await ERC20Interface.deployed();
  const ERC20ValidatableInstance = await ERC20ValidatableInterface.deployed();

  const ERC20ContractAddress = ERC20Instance.address;
  const ERC20ValidatableContractAddress = ERC20ValidatableInstance.address;

  const filePath = path.resolve(__dirname, '.jsapi.json');

  const data = `
    "accounts": ${JSON.stringify(accounts)},\n
    "ERC20ContractAddress": ${ERC20ContractAddress},\n
    "ERC20ValidatableContractAddress": ${ERC20ValidatableContractAddress}\n}
  `;

  fs.appendFileSync(filePath, data);

  exec('cd ../jibrel-contracts-jsapi && npm test', (error, stdout, stderr) => {
    if (error) {
      return console.error(`exec error: ${error}`);
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});
