// eslint-disable-next-line import/prefer-default-export
export async function checkContractThrows(functionObj, functionParams, notThrowMsg = null) {
  let isCaught = false;
  try {
    await functionObj(...functionParams);
  } catch (err) {
    if (err.message.includes('is not a function')) { throw err; }
    // todo check that there is no problem with arguments list
    // number of args should match func signature
    // types should match function signature
    // generally truffle should make these checks
    isCaught = true;
  }
  global.assert.equal(isCaught, true, (notThrowMsg === null) ? 'Expected that function call throws' : notThrowMsg);
}
