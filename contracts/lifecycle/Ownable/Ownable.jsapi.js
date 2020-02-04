import { submitTxAndWaitConfirmation } from '../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const OwnableArtifact = global.artifacts.require('Ownable.sol');


/**
 * Setters
 */

export const createOwnershipOffer = async (contractAddress, ownerAddress,
                                           proposedOwner) => {
  global.console.log('\tCreate ownership offer:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tproposedOwner - ${proposedOwner}`);
  // await submitTxAndWaitConfirmation(
  //   OwnableArtifact
  //     .at(contractAddress)
  //     .createOwnershipOffer
  //     .sendTransaction,
  //   [proposedOwner],
  //   { from: ownerAddress }
  // );
  const instance = await OwnableArtifact.at(contractAddress);
  await instance.createOwnershipOffer(proposedOwner, { from: ownerAddress });
  global.console.log('\t\tOwnership offer successfully created');
};

export const acceptOwnershipOffer = async (contractAddress, proposedOwner) => {
  global.console.log('\tAccept ownership offer:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tproposedOwner - ${proposedOwner}`);
  // await submitTxAndWaitConfirmation(
  //   OwnableArtifact
  //     .at(contractAddress)
  //     .acceptOwnershipOffer
  //     .sendTransaction,
  //   [],
  //   { from: proposedOwner }
  // );
  const instance = await OwnableArtifact.at(contractAddress);
  await instance.acceptOwnershipOffer({ from: proposedOwner });
  global.console.log('\t\tOwnership offer successfully accepted');
};

export const cancelOwnershipOffer = async (contractAddress, ownerAddress) => {
  global.console.log('\tAccept ownership offer:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\towner/proposedOwner - ${ownerAddress}`);
  // await submitTxAndWaitConfirmation(
  //   OwnableArtifact
  //     .at(contractAddress)
  //     .cancelOwnershipOffer
  //     .sendTransaction,
  //   [],
  //   { from: ownerAddress }
  // );
  const instance = await OwnableArtifact.at(contractAddress);
  await instance.cancelOwnershipOffer({ from: ownerAddress });
  global.console.log('\t\tOwnership offer successfully canceled');
};


/**
 * Getters
 */

export const getProposedOwner = async (contractAddress) => OwnableArtifact.at(contractAddress).getProposedOwner.call();


/**
 * Events
 */

export const getOwnerAssignedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = OwnableArtifact.at(contractAddress).OwnerAssignedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getOwnershipOfferCreatedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = OwnableArtifact.at(contractAddress).OwnershipOfferCreatedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getOwnershipOfferAcceptedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = OwnableArtifact.at(contractAddress).OwnershipOfferAcceptedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getOwnershipOfferCancelledEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = OwnableArtifact.at(contractAddress).OwnershipOfferCancelledEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
