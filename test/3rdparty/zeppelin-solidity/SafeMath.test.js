const assertThrows = require('../../../jsroutines/util/assertThrows');
const { getAccounts } = require('../../../jsroutines/jsconfig/DeployConfig');

const SafeMathMock = artifacts.require('SafeMathMock');

const a = 5678;
const b = 1234;
const overflowUint = 115792089237316195423570985008687907853269984665640564039457584007913129639935;

contract('SafeMath', (accounts) => {
  const { owner } = getAccounts(accounts);

  let safeMathMockInstance;

  before(async () => {
    safeMathMockInstance = SafeMathMock.isDeployed()
      ? await SafeMathMock.deployed()
      : await SafeMathMock.new({ from: owner });
  });

  it('should multiple correctly', async () => {
    const result = await safeMathMockInstance.multiply(a, b);
    assert.strictEqual(result.toNumber(), a * b);
  });

  it('should divide correctly', async () => {
    const result = await safeMathMockInstance.divide(a, b);
    assert.strictEqual(result.toNumber(), Math.floor(a / b));
  });

  it('should add correctly', async () => {
    const result = await safeMathMockInstance.add(a, b);
    assert.strictEqual(result.toNumber(), a + b);
  });

  it('should subtract correctly', async () => {
    const result = await safeMathMockInstance.subtract(a, b);
    assert.strictEqual(result.toNumber(), a - b);
  });

  it('should throw an error on multiplication overflow', async () => {
    await assertThrows(safeMathMockInstance.multiply(overflowUint, b));
  });

  it('should throw an error on division by zero', async () => {
    await assertThrows(safeMathMockInstance.divide(a, 0));
  });

  it('should throw an error on addition overflow', async () => {
    await assertThrows(safeMathMockInstance.add(overflowUint, b));
  });

  it('should throw an error if subtraction result would be negative', async () => {
    await assertThrows(safeMathMockInstance.subtract(b, a));
  });
});
