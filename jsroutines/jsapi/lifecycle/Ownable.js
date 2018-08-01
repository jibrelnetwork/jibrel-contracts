import { submitTxAndWaitConfirmation } from '../../util/SubmitTx';

const Promise = require('bluebird');

const Ownable = global.artifacts.require('Ownable.sol');


/**
 * Setters
 */

export const createOwnershipOffer = async (contractAddress, ownerAddress,
                                           proposedOwner) => {
  global.console.log('\tCreate ownership offer:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tproposedOwner - ${proposedOwner}`);
  await submitTxAndWaitConfirmation(
    Ownable
      .at(contractAddress)
      .createOwnershipOffer
      .sendTransaction,
    [proposedOwner, { from: ownerAddress }],
  );
  global.console.log('\t\tOwnership offer successfully created');
};

export const acceptOwnershipOffer = async (contractAddress, proposedOwner) => {
  global.console.log('\tAccept ownership offer:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tproposedOwner - ${proposedOwner}`);
  await submitTxAndWaitConfirmation(
    Ownable
      .at(contractAddress)
      .acceptOwnershipOffer
      .sendTransaction,
    [{ from: proposedOwner }],
  );
  global.console.log('\t\tOwnership offer successfully accepted');
};

export const cancelOwnershipOffer = async (contractAddress, ownerAddress) => {
  global.console.log('\tAccept ownership offer:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\towner/proposedOwner - ${ownerAddress}`);
  await submitTxAndWaitConfirmation(
    Ownable
      .at(contractAddress)
      .cancelOwnershipOffer
      .sendTransaction,
    [{ from: ownerAddress }],
  );
  global.console.log('\t\tOwnership offer successfully canceled');
};


/**
 * Getters
 */

export const getOwner = async (contractAddress) => Ownable.at(contractAddress).getOwner.call();

export const getProposedOwner = async (contractAddress) => Ownable.at(contractAddress).getProposedOwner.call();


/**
 * Events
 */

export const getOwnerAssignedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = Ownable.at(contractAddress).OwnerAssignedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getOwnershipOfferCreatedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = Ownable.at(contractAddress).OwnershipOfferCreatedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getOwnershipOfferAcceptedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = Ownable.at(contractAddress).OwnershipOfferAcceptedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getOwnershipOfferCancelledEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = Ownable.at(contractAddress).OwnershipOfferCancelledEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
