const JNTViewERC20 = global.artifacts.require('JNTViewERC20.sol');


global.contract('JNTViewERC20', (accounts) => {
  let jntViewERC20Contract;

  const owner = accounts[0];

  global.beforeEach(async () => {
    jntViewERC20Contract = await JNTViewERC20.new({ from: owner });
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log(`\tjntViewERC20Contract: ${jntViewERC20Contract.address}`);
    global.assert.notEqual(jntViewERC20Contract.address, 0x0);

    const isPaused = await jntViewERC20Contract.getPaused.call();
    global.assert.equal(isPaused, true, 'Just deployed jntPayableService contract must be paused');

    const viewStandardName = await jntViewERC20Contract.getCrydrViewStandardName.call();
    global.assert.equal(viewStandardName, 'erc20', 'Expected that crydrViewStandardName is set');

    const contractName = await jntViewERC20Contract.name();
    global.assert.equal(contractName, 'Jibrel Network Token', 'Expected that tokenName is set');

    const contractSymbol = await jntViewERC20Contract.symbol();
    global.assert.equal(contractSymbol, 'JNT', 'Expected that tokenSymbol is set');

    const contractDecimals = await jntViewERC20Contract.decimals();
    global.assert.equal(contractDecimals, 18, 'Expected that tokenDecimals is set');
  });
});
