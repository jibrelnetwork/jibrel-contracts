// // eslint-disable-next-line import/prefer-default-export
export async function isContractThrows(functionObj, functionParams = [], msg = null) {
  if (typeof functionObj === 'undefined' || functionObj === null) {
    throw Error('Function is not defined.');
  }
  let isThrows = false;
  try {
    await functionObj(...functionParams);
  } catch (err) {

    if (err.message.includes('is not a function')) { throw err; }
    // todo check that there is no problem with arguments list
    // number of args should match func signature
    // types should match function signature
    // generally truffle should make these checks

    if (msg !== null){

      if (err.message.includes(msg)){
        isThrows = true;
      }else{
        isThrows = false;
        console.log('ASSERT THROWS:', err.message, 'EXPECTED:', msg);
      }
    }else{
      isThrows = true;
    }

  }
  return isThrows;
}



// eslint-disable-next-line import/prefer-default-export
// export async function isContractThrows(functionObj, functionParams = []) {
//   await functionObj(...functionParams);
//   return false;
// }
