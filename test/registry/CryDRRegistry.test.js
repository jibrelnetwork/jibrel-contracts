/* eslint-disable no-multi-spaces */

const CryDRRegistry       = global.artifacts.require('CryDRRegistry.sol');

const JNTViewERC20  = global.artifacts.require('JNTViewERC20.sol');
const jUSDViewERC20  = global.artifacts.require('jUSDViewERC20.sol');
const jEURViewERC20  = global.artifacts.require('jEURViewERC20.sol');
const jGBPViewERC20  = global.artifacts.require('jGBPViewERC20.sol');
const jAEDViewERC20  = global.artifacts.require('jAEDViewERC20.sol');
const jRUBViewERC20  = global.artifacts.require('jRUBViewERC20.sol');
const jCNYViewERC20  = global.artifacts.require('jCNYViewERC20.sol');
const jTBillViewERC20  = global.artifacts.require('jTBillViewERC20.sol');
const jGDRViewERC20  = global.artifacts.require('jGDRViewERC20.sol');


global.contract('CryDRRegistry', async () => {
  global.it('should generate JSON with known CryDRs', async () => {
    const crydrRegistryInstance = await CryDRRegistry.deployed();

    const crydrDataStr = await crydrRegistryInstance.getCryDRData.call();
    const crydrData    = JSON.parse(crydrDataStr);


    const expectedCrydrData = [
      {
        symbol: 'JNT',
        name:   'Jibrel Network Token',
        views:  [{ apistandard: 'erc20', address: (await JNTViewERC20.deployed()).address }],
      },
      {
        symbol: 'jUSD',
        name:   'United States dollar',
        views:  [{ apistandard: 'erc20', address: (await jUSDViewERC20.deployed()).address }],
      },
      {
        symbol: 'jEUR',
        name:   'Euro',
        views:  [{ apistandard: 'erc20', address: (await jEURViewERC20.deployed()).address }],
      },
      {
        symbol: 'jGBP',
        name:   'Pound sterling',
        views:  [{ apistandard: 'erc20', address: (await jGBPViewERC20.deployed()).address }],
      },
      {
        symbol: 'jAED',
        name:   'United Arab Emirates dirham',
        views:  [{ apistandard: 'erc20', address: (await jAEDViewERC20.deployed()).address }],
      },
      {
        symbol: 'jRUB',
        name:   'Russian ruble',
        views:  [{ apistandard: 'erc20', address: (await jRUBViewERC20.deployed()).address }],
      },
      {
        symbol: 'jCNY',
        name:   'Chinese yuan',
        views:  [{ apistandard: 'erc20', address: (await jCNYViewERC20.deployed()).address }],
      },
      {
        symbol: 'jTBill',
        name:   'Treasure bill',
        views:  [{ apistandard: 'erc20', address: (await jTBillViewERC20.deployed()).address }],
      },
      {
        symbol: 'jGDR',
        name:   'Global depositary receipt',
        views:  [{ apistandard: 'erc20', address: (await jGDRViewERC20.deployed()).address }],
      },
    ];

    global.assert.deepEqual(crydrData, expectedCrydrData);
  });
});
