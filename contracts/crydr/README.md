CryDRs
======

Usually Ethereum tokens conform to the ERC20 standard.
But in Jibrel we need a few major features.
First of all, we need to change logic of transactions approval time to time.
Essentially, this means that we need to upgrade contracts.
But at the same time we need to keep all log records and storage unchanged.

This means that naive implementation of ERC20 do not fit our needs.

Workable approach:
- View - ERC20 contract. We can have more than one View that support different standards.
- Model - contract with the storage, holds data structure `mapping(address => uint256) balances;`
- Controller - contract that receives calls from View, checks validity, calls Model to change storage.
Model accepts calls only from Controller.
Controller implements features to manage token (like mint/burn tokens).

Benefits:
- Controller can be changed at any time. This allows us to update business-logic of the token without drawbacks
- For one token we can have multiple Views that support different standards

General guidelines:
- checks and modifiers - be as strict as possible
- errors - throw as early as possible
- provide additional methods to check whether tx possible or not


