const JNTViewERC20 = global.artifacts.require('JNTViewERC20.sol');


global.contract('JNTViewERC20', (accounts) => {
  let jntViewERC20Instance;

  const owner = accounts[0];

  global.beforeEach(async () => {
    jntViewERC20Instance = await JNTViewERC20.new({ from: owner });
  });

  global.it('should test that contract works as expected', async () => {
    global.console.log(`\tjntViewERC20Instance: ${jntViewERC20Instance.address}`);
    global.assert.notStrictEqual(jntViewERC20Instance.address, '0x0000000000000000000000000000000000000000');

    const isPaused = await jntViewERC20Instance.getPaused.call();
    global.assert.strictEqual(isPaused, true, 'Just deployed jntPayableService contract must be paused');

    const viewStandardName = await jntViewERC20Instance.getCrydrViewStandardName.call();
    global.assert.strictEqual(viewStandardName, 'erc20', 'Expected that crydrViewStandardName is set');

    const contractName = await jntViewERC20Instance.name();
    global.assert.strictEqual(contractName, 'Jibrel Network Token', 'Expected that tokenName is set');

    const contractSymbol = await jntViewERC20Instance.symbol();
    global.assert.strictEqual(contractSymbol, 'JNT', 'Expected that tokenSymbol is set');

    const contractDecimals = await jntViewERC20Instance.decimals();
    global.assert.strictEqual(contractDecimals.toNumber(), 18, 'Expected that tokenDecimals is set');
  });
});
