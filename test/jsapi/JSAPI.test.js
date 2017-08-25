const JNTViewERC20               = global.artifacts.require('JNTViewERC20.sol');
const jUSDViewERC20              = global.artifacts.require('jUSDViewERC20.sol');
const jEURViewERC20              = global.artifacts.require('jEURViewERC20.sol');
const jGBPViewERC20              = global.artifacts.require('jGBPViewERC20.sol');
const jAEDViewERC20              = global.artifacts.require('jAEDViewERC20.sol');
const jRUBViewERC20              = global.artifacts.require('jRUBViewERC20.sol');
const jCNYViewERC20              = global.artifacts.require('jCNYViewERC20.sol');
const jTBillViewERC20            = global.artifacts.require('jTBillViewERC20.sol');
const jTBillViewERC20Validatable = global.artifacts.require('jTBillViewERC20Validatable.sol');
const jGDRViewERC20              = global.artifacts.require('jGDRViewERC20.sol');
const jGDRViewERC20Validatable   = global.artifacts.require('jGDRViewERC20Validatable.sol');


const fs       = require('fs');
const path     = require('path');
const { exec } = require('child_process');


global.contract('jsapi', async (accounts) => {

  global.it('build json', async () => {
    const jsonPath = path.resolve(__dirname, '../../.jsapi.json');
    const jsapiProjectPath = path.resolve(__dirname, '../../../jibrel-contracts-jsapi');
    global.console.log(`\tjsonPath: ${jsonPath}`);
    global.console.log(`\tjsapiProjectPath: ${jsapiProjectPath}`);


    const objects = new Map([['JNTViewERC20', JNTViewERC20],
                             ['jUSDViewERC20', jUSDViewERC20],
                             ['jEURViewERC20', jEURViewERC20],
                             ['jGBPViewERC20', jGBPViewERC20],
                             ['jAEDViewERC20', jAEDViewERC20],
                             ['jRUBViewERC20', jRUBViewERC20],
                             ['jCNYViewERC20', jCNYViewERC20],
                             ['jTBillViewERC20', jTBillViewERC20],
                             ['jTBillViewERC20Validatable', jTBillViewERC20Validatable],
                             ['jGDRViewERC20', jGDRViewERC20],
                             ['jGDRViewERC20Validatable', jGDRViewERC20Validatable]]);

    const contractAddress = new Map();

    const objectsArray  = Array.from(objects.keys());
    const promisesArray = objectsArray.map(
      (contractName) => objects.get(contractName).deployed());
    const instancesArray = await Promise.all(promisesArray);
    objectsArray.forEach(
      (contractName, i) => contractAddress.set(contractName, instancesArray[i].address));

    const data = `"accounts": ${JSON.stringify(accounts)},\n"contracts": ${JSON.stringify(contractAddress)}}`;
    fs.appendFileSync(jsonPath, data);

    exec(`cd ${jsapiProjectPath} && npm test`, (error, stdout, stderr) => {
      if (error) {
        return global.console.error(`exec error: ${error}`);
      }

      global.console.log(`stdout: ${stdout}`);
      global.console.log(`stderr: ${stderr}`);
    });
  });
});
