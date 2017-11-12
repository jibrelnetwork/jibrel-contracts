# Jibrel Ethereum smart contracts

The Jibrel contracts implements ERC20 compliant tokens:
* Crypto Depository Receipts (CryDRs) are smart contracts that represent the value of a real-world asset. 
* Jibrel Network Token (JNT) is a virtual currency used to purchase / redeem CryDRs. 

Users can convert Jibrel Network Token (JNT) into CryDRs representing fiat currencies, commodities, bonds or even securities. CryDRs can be transferred to another individual or entity, who can redeem the token for the underlying value in JNT with the Jibrel DAO. CryDRs have smart regulation embedded, meaning all transactions are KYC / AML compliant.


## Links

[Jibrel Network site](https://jibrel.network/)

[White Paper](https://github.com/jibrelnetwork/white_paper)


## How to test

Jibrel contracts integrates with [Truffle](https://github.com/ConsenSys/truffle), an Ethereum development environment. Please install Node.js and npm.


### Test contracts

Running associated unit tests as follows:

```
npm test
``` 


### Coverage test

Running coverage as follows:

```
npm run coverage
```

