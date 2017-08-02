/* eslint-disable no-multi-spaces */

const CryDRRegistry       = global.artifacts.require('CryDRRegistry.sol');
const ERC20NamedInterface = global.artifacts.require('ERC20NamedInterface.sol');


global.contract('CryDRRegistry', async () => {
  global.it('should generate JSON with known CryDRs', async () => {
    const crydrRegistryAddress  = deploymentController.getCrydrRegistryAddress(global.deployer.network);
    const crydrRegistryInstance = CryDRRegistry.at(crydrRegistryAddress);

    const crydrDataStr = await crydrRegistryInstance.getCryDRData.call();
    const crydrData    = JSON.parse(crydrDataStr);

    const knownTokens = ['JNT', 'jUSD', 'jEUR', 'jGBP', 'jAED', 'jRUB', 'jCNY', 'jTBill', 'jGDR'];

    const expectedCrydrData = await Promise.all(
      knownTokens.map(async (crydrSymbol) => {
        const erc20ViewAddress = deploymentController.getCrydrViewAddress(global.deployer.network,
                                                                          crydrSymbol, 'erc20');
        const crydrName        = await ERC20NamedInterface
          .at(erc20ViewAddress)
          .name
          .call();
        return { symbol: crydrSymbol, name: crydrName, views: [{ apistandard: 'erc20', address: erc20ViewAddress }] };
      }));

    global.assert.deepEqual(crydrData, expectedCrydrData);
  });
});
