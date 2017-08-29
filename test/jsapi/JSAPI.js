const JNTViewERC20               = global.artifacts.require('JNTViewERC20.sol');
const jUSDViewERC20              = global.artifacts.require('jUSDViewERC20.sol');
const jEURViewERC20              = global.artifacts.require('jEURViewERC20.sol');
const jGBPViewERC20              = global.artifacts.require('jGBPViewERC20.sol');
const jAEDViewERC20              = global.artifacts.require('jAEDViewERC20.sol');
const jRUBViewERC20              = global.artifacts.require('jRUBViewERC20.sol');
const jCNYViewERC20              = global.artifacts.require('jCNYViewERC20.sol');
const jGDRViewERC20              = global.artifacts.require('jGDRViewERC20.sol');
const jTBillViewERC20            = global.artifacts.require('jTBillViewERC20.sol');
const jGDRViewERC20Validatable   = global.artifacts.require('jGDRViewERC20Validatable.sol');
const jTBillViewERC20Validatable = global.artifacts.require('jTBillViewERC20Validatable.sol');

const Promise  = require('bluebird');
const fs       = require('fs');
const path     = require('path');
const { spawn } = require('child_process');

function consoleLog(msg) {
  global.console.log(msg);
}

function consoleError(msg) {
  global.console.error('\x1b[31m%s\x1b[0m', msg);
}

global.after(() => {
  global.contract('jsapi', async (accounts) => {

    global.it('build json', async () => {
      const jsonPath = path.resolve(__dirname, '../../.jsapi.json');
      const jsapiProjectPath = path.resolve(__dirname, '../../../jibrel-contracts-jsapi');
      global.console.log(`\tjsonPath: ${jsonPath}`);
      global.console.log(`\tjsapiProjectPath: ${jsapiProjectPath}`);

      const contracts = {
        JNTViewERC20,
        jUSDViewERC20,
        jEURViewERC20,
        jGBPViewERC20,
        jAEDViewERC20,
        jRUBViewERC20,
        jCNYViewERC20,
        jGDRViewERC20,
        jTBillViewERC20,
        jGDRViewERC20Validatable,
        jTBillViewERC20Validatable,
      };

      const contractNames = Object.keys(contracts);
      const contractAddresses = {};

      const contractInstances = await Promise.map(contractNames, name => contracts[name].deployed());

      contractNames.forEach((name, index) => {
        contractAddresses[name] = contractInstances[index].address;
      });

      const data = `\n\t"accounts": ${JSON.stringify(accounts)},\n\t"contracts": ${JSON.stringify(contractAddresses)}\n}`;

      fs.appendFileSync(jsonPath, data);

      const jsapiTests = spawn('npm', ['test'], {
        cwd: jsapiProjectPath,
        env: { ...process.env, JSON_PATH: jsonPath, RPCPORT: 8560 },
      });

      jsapiTests.on('error', (err) => {
        consoleError('Failed to start jsapi tests');
        consoleError(err);
      });

      jsapiTests.stdout.on('data', msg => consoleLog(msg.toString()));
      jsapiTests.stderr.on('data', consoleError);
      jsapiTests.on('close', () => consoleLog('jsapi tests finished'));
    });
  });
});
