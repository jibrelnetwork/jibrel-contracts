import { submitTxAndWaitConfirmation } from '../../../routine/misc/SubmitTx';

const CrydrViewBase             = global.artifacts.require('CrydrViewBase.sol');
const CrydrViewERC20Validatable = global.artifacts.require('CrydrViewERC20Validatable.sol');
const CrydrViewERC20Named       = global.artifacts.require('ERC20Named.sol');


export const testContractIsERC20Named = async (contractAddress) => {
  global.console.log('\tTest that contract is ERC20Named');

  await CrydrViewERC20Named.at(contractAddress).name.call();
  await CrydrViewERC20Named.at(contractAddress).symbol.call();
  await CrydrViewERC20Named.at(contractAddress).decimals.call();
  await CrydrViewERC20Named.at(contractAddress).getNameHash.call();
  await CrydrViewERC20Named.at(contractAddress).getSymbolHash.call();
};

export const testContractIsCrydrViewERC20Validatable = async (contractAddress, accounts) => {
  global.console.log('\tTest that contract is CrydrViewERC20Validatable ');

  const owner             = accounts[0];
  const investor01        = accounts[4];
  const investor02        = accounts[5];

  await CrydrViewERC20Validatable.at(contractAddress).isReceivingAllowed.call(investor01, 5 * (10 ** 18));
  await CrydrViewERC20Validatable.at(contractAddress).isSpendingAllowed.call(investor01, 5 * (10 ** 18));
  await CrydrViewERC20Validatable.at(contractAddress).isTransferAllowed.call(investor01, investor02, 5 * (10 ** 18));
  await CrydrViewERC20Validatable.at(contractAddress).isApproveAllowed.call(investor01, owner, 5 * (10 ** 18));
  await CrydrViewERC20Validatable.at(contractAddress).isApprovedSpendingAllowed.call(investor01, owner, 5 * (10 ** 18));
  await CrydrViewERC20Validatable.at(contractAddress).isTransferFromAllowed.call(owner, investor01, investor02, 5 * (10 ** 18));
};
