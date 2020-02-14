import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';

const SafeMathMock = global.artifacts.require('SafeMathMock.sol');


global.contract('SafeMath', (accounts) => {
  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();

  let safeMathMockInstance;

  global.before(async () => {
    safeMathMockInstance = await SafeMathMock.new({ from: ethAccounts.owner });
  });

  global.it('multiplies correctly', async () => {
    const a = 5678;
    const b = 1234;
    await safeMathMockInstance.multiply(a, b);
    const result = await safeMathMockInstance.result();

    global.assert.strictEqual(result.toNumber(), a * b);
  });

  global.it('adds correctly', async () => {
    const a = 5678;
    const b = 1234;
    await safeMathMockInstance.add(a, b);
    const result = await safeMathMockInstance.result();

    global.assert.strictEqual(result.toNumber(), a + b);
  });

  global.it('subtracts correctly', async () => {
    const a = 5678;
    const b = 1234;
    await safeMathMockInstance.subtract(a, b);
    const result = await safeMathMockInstance.result();

    global.assert.strictEqual(result.toNumber(), a - b);
  });

  global.it('should throw an error if subtraction result would be negative', async () => {
    const a = 1234;
    const b = 5678;
    // global.assert.throws(() => {safeMathMockInstance.subtract(a, b)})
    const isThrows = await CheckExceptions.isContractThrows(safeMathMockInstance.subtract, [a, b]);
    global.assert.strictEqual(isThrows, true, 'It should not be possible');
  });

  global.it('should throw an error on addition overflow', async () => {
    const a = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const b = 1;

    const isThrows = await CheckExceptions.isContractThrows(safeMathMockInstance.add, [a, b]);
    global.assert.strictEqual(isThrows, true, 'It should not be possible');
  });

  global.it('should throw an error on multiplication overflow', async () => {
    const a = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const b = 2;

    const isThrows = await CheckExceptions.isContractThrows(safeMathMockInstance.multiply, [a, b]);
    global.assert.strictEqual(isThrows, true, 'It should not be possible');
  });
});
