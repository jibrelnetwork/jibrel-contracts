import * as OwnableInterfaceJSAPI from '../../contracts/lifecycle/Ownable/OwnableInterface.jsapi';
import * as OwnableJSAPI from '../../contracts/lifecycle/Ownable/Ownable.jsapi';

import * as DeployConfig from '../../jsroutines/jsconfig/DeployConfig';
import * as CheckExceptions  from '../../jsroutines/util/CheckExceptions';

const Ownable = global.artifacts.require('Ownable.sol');


global.contract('Ownable', (accounts) => {
  let ownableInstanceAddress;

  DeployConfig.setEthAccounts(accounts);
  const ethAccounts = DeployConfig.getEthAccounts();

  global.beforeEach(async () => {
    const ownableInstance = await Ownable.new({ from: ethAccounts.owner });
    ownableInstanceAddress = ownableInstance.address;

    global.console.log('\t\tcheck initial state of the deployed Ownable instance');
    const ownerReceived = await OwnableInterfaceJSAPI.getOwner(ownableInstanceAddress);
    global.assert.strictEqual(ownerReceived, ethAccounts.owner);
    const proposedOwner = await OwnableJSAPI.getProposedOwner(ownableInstanceAddress);
    global.assert.strictEqual(proposedOwner, '0x0000000000000000000000000000000000000000');
  });

  global.it('should check that offer to transfer ownership can be created', async () => {
    await OwnableJSAPI.createOwnershipOffer(ownableInstanceAddress, ethAccounts.owner, ethAccounts.testInvestor1);

    const ownerReceived = await OwnableInterfaceJSAPI.getOwner(ownableInstanceAddress);
    global.assert.strictEqual(ownerReceived, ethAccounts.owner);
    const proposedOwner = await OwnableJSAPI.getProposedOwner(ownableInstanceAddress);
    global.assert.strictEqual(proposedOwner, ethAccounts.testInvestor1);
  });

  global.it('should check that offer to transfer ownership can be cancelled', async () => {
    await OwnableJSAPI.createOwnershipOffer(ownableInstanceAddress, ethAccounts.owner, ethAccounts.testInvestor1);

    let ownerReceived = await OwnableInterfaceJSAPI.getOwner(ownableInstanceAddress);
    global.assert.strictEqual(ownerReceived, ethAccounts.owner);
    let proposedOwner = await OwnableJSAPI.getProposedOwner(ownableInstanceAddress);
    global.assert.strictEqual(proposedOwner, ethAccounts.testInvestor1);

    await OwnableJSAPI.cancelOwnershipOffer(ownableInstanceAddress, ethAccounts.owner);

    ownerReceived = await OwnableInterfaceJSAPI.getOwner(ownableInstanceAddress);
    global.assert.strictEqual(ownerReceived, ethAccounts.owner);
    proposedOwner = await OwnableJSAPI.getProposedOwner(ownableInstanceAddress);
    global.assert.strictEqual(proposedOwner, '0x0000000000000000000000000000000000000000');


    await OwnableJSAPI.createOwnershipOffer(ownableInstanceAddress, ethAccounts.owner, ethAccounts.testInvestor1);

    ownerReceived = await OwnableInterfaceJSAPI.getOwner(ownableInstanceAddress);
    global.assert.strictEqual(ownerReceived, ethAccounts.owner);
    proposedOwner = await OwnableJSAPI.getProposedOwner(ownableInstanceAddress);
    global.assert.strictEqual(proposedOwner, ethAccounts.testInvestor1);

    await OwnableJSAPI.cancelOwnershipOffer(ownableInstanceAddress, ethAccounts.testInvestor1);

    ownerReceived = await OwnableInterfaceJSAPI.getOwner(ownableInstanceAddress);
    global.assert.strictEqual(ownerReceived, ethAccounts.owner);
    proposedOwner = await OwnableJSAPI.getProposedOwner(ownableInstanceAddress);
    global.assert.strictEqual(proposedOwner, '0x0000000000000000000000000000000000000000');
  });

  global.it('should check that offer to transfer ownership can be accepted', async () => {
    await OwnableJSAPI.createOwnershipOffer(ownableInstanceAddress, ethAccounts.owner, ethAccounts.testInvestor1);

    let ownerReceived = await OwnableInterfaceJSAPI.getOwner(ownableInstanceAddress);
    global.assert.strictEqual(ownerReceived, ethAccounts.owner);
    let proposedOwner = await OwnableJSAPI.getProposedOwner(ownableInstanceAddress);
    global.assert.strictEqual(proposedOwner, ethAccounts.testInvestor1);

    await OwnableJSAPI.acceptOwnershipOffer(ownableInstanceAddress, ethAccounts.testInvestor1);

    ownerReceived = await OwnableInterfaceJSAPI.getOwner(ownableInstanceAddress);
    global.assert.strictEqual(ownerReceived, ethAccounts.testInvestor1);
    proposedOwner = await OwnableJSAPI.getProposedOwner(ownableInstanceAddress);
    global.assert.strictEqual(proposedOwner, '0x0000000000000000000000000000000000000000');
  });

  global.it('should check exceptions related to creation of ownership transfer offer', async () => {
    let isThrows = await CheckExceptions.isContractThrows(OwnableJSAPI.createOwnershipOffer,
                                                          [ownableInstanceAddress, ethAccounts.testInvestor1, ethAccounts.testInvestor2]);
    global.assert.strictEqual(isThrows, true, 'Only current owner should be able to create an ownership offer');

    isThrows = await CheckExceptions.isContractThrows(OwnableJSAPI.createOwnershipOffer,
                                                      [ownableInstanceAddress, ethAccounts.owner, 0x0]);
    global.assert.strictEqual(isThrows, true, 'Address of proposed owner should be valid');

    await OwnableJSAPI.createOwnershipOffer(ownableInstanceAddress, ethAccounts.owner, ethAccounts.testInvestor1);

    isThrows = await CheckExceptions.isContractThrows(OwnableJSAPI.createOwnershipOffer,
                                                      [ownableInstanceAddress, ethAccounts.owner, ethAccounts.testInvestor2]);
    global.assert.strictEqual(isThrows, true, 'New offer should not be possible until the old one finished');
  });

  global.it('should check exceptions related to accepting of ownership transfer offer', async () => {
    await OwnableJSAPI.createOwnershipOffer(ownableInstanceAddress, ethAccounts.owner, ethAccounts.testInvestor1);

    let isThrows = await CheckExceptions.isContractThrows(OwnableJSAPI.acceptOwnershipOffer,
                                                          [ownableInstanceAddress, ethAccounts.owner]);
    global.assert.strictEqual(isThrows, true, 'Only proposed owner should be able to accept offer');
    isThrows = await CheckExceptions.isContractThrows(OwnableJSAPI.acceptOwnershipOffer,
                                                      [ownableInstanceAddress, ethAccounts.testInvestor2]);
    global.assert.strictEqual(isThrows, true, 'Only proposed owner should be able to accept offer');
  });

  global.it('should check exceptions related to cancellation of ownership transfer offer', async () => {
    await OwnableJSAPI.createOwnershipOffer(ownableInstanceAddress, ethAccounts.owner, ethAccounts.testInvestor1);

    const isThrows = await CheckExceptions.isContractThrows(OwnableJSAPI.cancelOwnershipOffer,
                                                            [ownableInstanceAddress, ethAccounts.testInvestor2]);
    global.assert.strictEqual(isThrows, true, 'Only owner and proposed owner should be able to cancel offer');
  });
});
