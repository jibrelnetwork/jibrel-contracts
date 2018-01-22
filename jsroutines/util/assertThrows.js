module.exports = async function assertThrows(handler, message) {
  if (!handler) {
    throw Error('Function is not defined.');
  }

  try {
    await handler;

    throw new Error(message || 'Expected that function call throws');
  } catch (err) {
    if (err.message.includes('is not a function')) {
      throw err;
    }

    // todo check that there is no problem with arguments list
    // number of args should match func signature
    // types should match function signature
    // generally truffle should make these checks
  }
};
