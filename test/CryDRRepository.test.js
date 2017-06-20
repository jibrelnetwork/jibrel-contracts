const InvestorRepository = artifacts.require('InvestorRepository.sol');
const CryDRRepository    = artifacts.require('CryDRRepository.sol');
const jUSD               = artifacts.require('jUSD.sol');
const jEUR               = artifacts.require('jEUR.sol');


contract('CryDRRepository', (accounts) => {
  let investorsRepo;
  let crydrRepo;

  const owner   = accounts[0];
  const manager = accounts[1];

  beforeEach(async () => {
    investorsRepo = await InvestorRepository.new({ from: owner });
    crydrRepo     = await CryDRRepository.new({ from: owner });
    await crydrRepo.enableManager.sendTransaction(manager, { from: owner });
    await crydrRepo.grantManagerPermission.sendTransaction(manager, 'add_crydr', { from: owner });
    await crydrRepo.grantManagerPermission.sendTransaction(manager, 'remove_crydr', { from: owner });
  });

  it('should add CryDRs and lookup them', async () => {
    let crydrNumber;
    let crydrAddress;

    const jUSDToken = await jUSD.new(investorsRepo.address, { from: owner });
    const jEURToken = await jEUR.new(investorsRepo.address, { from: owner });

    crydrNumber = await crydrRepo.crydrNumber.call();
    assert.equal(crydrNumber.toNumber(), 0);
    await crydrRepo.addCryDR.sendTransaction(jUSDToken.address, 'USD CryDR', 'jUSD', { from: manager });
    crydrNumber = await crydrRepo.crydrNumber.call();
    assert.equal(crydrNumber.toNumber(), 1);
    await crydrRepo.addCryDR.sendTransaction(jEURToken.address, 'EUR CryDR', 'jEUR', { from: manager });
    crydrNumber = await crydrRepo.crydrNumber.call();
    assert.equal(crydrNumber.toNumber(), 2);

    crydrAddress = await crydrRepo.lookupCryDR.call('jUSD');
    assert.equal(crydrAddress.toString(), jUSDToken.address);

    crydrAddress = await crydrRepo.lookupCryDR.call('jEUR');
    assert.equal(crydrAddress.toString(), jEURToken.address);

    await crydrRepo.removeCryDR.sendTransaction(jEURToken.address, 'EUR CryDR', 'jEUR', { from: manager });
    crydrNumber = await crydrRepo.crydrNumber.call();
    assert.equal(crydrNumber.toNumber(), 1);
  });

  it('should generate JSON with the CryDR data', async () => {
    const jUSDToken = await jUSD.new(investorsRepo.address, { from: owner });
    const jEURToken = await jEUR.new(investorsRepo.address, { from: owner });

    await crydrRepo.addCryDR.sendTransaction(jUSDToken.address, 'USD CryDR', 'jUSD', { from: manager });
    await crydrRepo.addCryDR.sendTransaction(jEURToken.address, 'EUR CryDR', 'jEUR', { from: manager });
    const crydrNumber = await crydrRepo.crydrNumber.call();
    assert.equal(crydrNumber.toNumber(), 2);

    const crydrDataString = await crydrRepo.getCryDRData.call();
    const crydrData       = JSON.parse(crydrDataString);
    assert.equal(crydrData.length, 2);

    // check correctness of json fields
    const allowedProperties = new Set(['address', 'name', 'symbol']);
    for (let i = 0; i < crydrData.length; i += 1) {
      let numberOfValidProperties = 0;
      const crydrObjectProperties = Object.keys(crydrData[i]);
      for (let z = 0; z < crydrObjectProperties.length; z += 1) {
        const property = crydrObjectProperties[z];
        if (Object.prototype.hasOwnProperty.call(crydrData[i], property)) {
          assert.isTrue(allowedProperties.has(property));
          assert.isAbove(crydrData[i][property].length, 0);
          numberOfValidProperties += 1;
        }
      }
      assert.equal(numberOfValidProperties, 3);
    }

    // check content
    let jUSDFound = false;
    let jEURFound = false;
    for (let i = 0; i < crydrData.length; i++) {
      let crydrAddress;
      let crydrName;
      let crydrSymbol;

      const crydrObjectProperties = Object.keys(crydrData[i]);
      for (let z = 0; z < crydrObjectProperties.length; z += 1) {
        const property = crydrObjectProperties[z];
        if (Object.prototype.hasOwnProperty.call(crydrData[i], property)) {
          if (property === 'address') {
            crydrAddress = crydrData[i][property];
          } else if (property === 'name') {
            crydrName = crydrData[i][property];
          } else if (property === 'symbol') {
            crydrSymbol = crydrData[i][property];
          }
        }
      }

      if (crydrAddress === jUSDToken.address && crydrName === 'USD CryDR' && crydrSymbol === 'jUSD') {
        jUSDFound = true;
      } else if (crydrAddress === jEURToken.address && crydrName === 'EUR CryDR' && crydrSymbol === 'jEUR') {
        jEURFound = true;
      }
    }
    assert.isTrue(jUSDFound);
    assert.isTrue(jEURFound);
  });
});
