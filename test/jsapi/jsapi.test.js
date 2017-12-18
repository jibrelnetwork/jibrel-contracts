const JNTController = global.artifacts.require('JNTController.sol');
const JNTViewERC20 = global.artifacts.require('JNTViewERC20.sol');
const jUSDViewERC20 = global.artifacts.require('jUSDViewERC20.sol');

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const { spawn } = require('child_process');

function consoleLog(msg) {
  global.console.log(msg);
}

function consoleError(msg) {
  global.console.error('\x1b[31m%s\x1b[0m', msg);
}

global.after(async () => {
  const accounts = global.web3.eth.accounts;

  const jsonPath = path.resolve(__dirname, '..', '..', '.jsapi.json');
  const jsapiProjectPath = path.resolve(__dirname, '..', '..', '..', 'jibrel-contracts-jsapi');
  global.console.log(`\tjsonPath: ${jsonPath}`);
  global.console.log(`\tjsapiProjectPath: ${jsapiProjectPath}`);

  const contracts = {
    JNTController,
    JNTViewERC20,
    jUSDViewERC20,
  };

  const contractNames = Object.keys(contracts);
  const contractAddresses = {};

  const contractInstances = await Promise.map(contractNames, (name) => contracts[name].deployed());

  contractNames.forEach((name, index) => {
    contractAddresses[name] = contractInstances[index].address;
  });

  const accountsStr = JSON.stringify(accounts);
  const contractAddressesStr = JSON.stringify(contractAddresses);
  const data = `\n\t"accounts": ${accountsStr},\n\t"contracts": ${contractAddressesStr}\n}`;

  fs.appendFileSync(jsonPath, data);

  try {
    fs.accessSync(jsapiProjectPath);
  } catch (e) {
    consoleLog('\n\njsapi project not found... Exit');

    return;
  }

  consoleLog('\n\njsapi project found... Launch tests');

  const jsapiTests = spawn('npm', ['test'], {
    cwd: jsapiProjectPath,
    env: { ...process.env, JSON_PATH: jsonPath, RPCPORT: 8560 },
  });

  jsapiTests.on('error', (err) => {
    consoleError('Failed to start jsapi tests');
    consoleError(err);
  });

  jsapiTests.stdout.on('data', (msg) => consoleLog(msg.toString()));
  jsapiTests.stderr.on('data', consoleError);
  jsapiTests.on('close', () => consoleLog('jsapi tests finished'));
});
