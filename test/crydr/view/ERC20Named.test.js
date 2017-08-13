/* eslint-disable no-multi-spaces */
const ERC20Named       = global.artifacts.require('ERC20Named.sol');

global.contract('ERC20Named', () => {
  let ERC20NamedContract;

  const originalName = 'testName';
  const originalSymbol = 'testSymbol';
  const originalDecimals = 18;
  const originalNameHash = '0x698c8efcda9e563cf153563941b60fc5ac88336fc58d361eb0888686fadb9976';
  const originalSymbolHash = '0x6a2f03a1dba5e9dbeb18b55ac2076e1af9f5f2b7411cb1dbef111c70934e1686';

  global.beforeEach(async () => {
    ERC20NamedContract = await ERC20Named.new(originalName, originalSymbol, originalDecimals);
  });

  global.it('check getters functions', async () => {
    const contractName = await ERC20NamedContract.name();
    global.assert.equal(contractName, originalName);
    const contractSymbol = await ERC20NamedContract.symbol();
    global.assert.equal(contractSymbol, originalSymbol);
    const contractDecimals = await ERC20NamedContract.decimals();
    global.assert.equal(contractDecimals, originalDecimals);
    const contractNameHash = await ERC20NamedContract.getNameHash();
    global.assert.equal(contractNameHash, originalNameHash);
    const contractSymbolHash = await ERC20NamedContract.getSymbolHash();
    global.assert.equal(contractSymbolHash, originalSymbolHash);
  });
});
