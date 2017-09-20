const SafeMathMock      = global.artifacts.require("SafeMathMock.sol");

const UtilsTestRoutines = require('../../../routine/misc/UtilsTest');


global.contract('SafeMath', (accounts) => {
  const owner = accounts[1];

  let safeMath;

  global.before(async () => {
    safeMath = await SafeMathMock.new({ from: owner });
  });

  global.it("multiplies correctly", async () => {
    let a = 5678;
    let b = 1234;
    let mult = await safeMath.multiply(a, b);
    let result = await safeMath.result();
    global.assert.strictEqual(result.toNumber(), a*b);
  });

  global.it("adds correctly", async () => {
    let a = 5678;
    let b = 1234;
    let add = await safeMath.add(a, b);
    let result = await safeMath.result();

    global.assert.strictEqual(result.toNumber(), a+b);
  });

  global.it("subtracts correctly", async () => {
    let a = 5678;
    let b = 1234;
    let subtract = await safeMath.subtract(a, b);
    let result = await safeMath.result();

    global.assert.strictEqual(result.toNumber(), a-b);
  });

  global.it("should throw an error if subtraction result would be negative", async () => {
    let a = 1234;
    let b = 5678;

    await UtilsTestRoutines.checkContractThrows(safeMath.subtract.call,
                                                [a, b],
                                                'It should not be possible');
  });

  global.it("should throw an error on addition overflow", async () => {
    let a = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
    let b = 1;

    await UtilsTestRoutines.checkContractThrows(safeMath.add.call,
                                                [a, b],
                                                'It should not be possible');
  });

  global.it("should throw an error on multiplication overflow", async () => {
    let a = 115792089237316195423570985008687907853269984665640564039457584007913129639933;
    let b = 2;

    await UtilsTestRoutines.checkContractThrows(safeMath.multiply.call,
                                                [a, b],
                                                'It should not be possible');
  });
});
