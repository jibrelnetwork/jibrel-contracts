const ChangeableSupplyToken = artifacts.require('ChangeableSupplyToken.sol');

contract('ChangeableSupplyToken', (accounts) => {
  let token;

  beforeEach(async () => {
    token = await ChangeableSupplyToken.new({ from: accounts[0] });
    await token.enableManager.sendTransaction(accounts[1], { from: accounts[0] });
    await token.grantManagerPermission.sendTransaction(accounts[1], 'mint', { from: accounts[0] });
    await token.enableManager.sendTransaction(accounts[2], { from: accounts[0] });
    await token.grantManagerPermission.sendTransaction(accounts[2], 'burn', { from: accounts[0] });
  });

  it('should start with a totalSupply of 0', async () => {
    const totalSupply = await token.totalSupply.call();

    assert.equal(totalSupply, 0);
  });

  it('should mint a given amount of tokens to a given address', async () => {
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 0);

    await token.mint.sendTransaction(accounts[9], 100, { from: accounts[1] });

    const balance1 = await token.balanceOf.call(accounts[9]);
    assert.equal(balance1.toNumber(), 100);

    const totalSupply = await token.totalSupply.call();
    assert.equal(totalSupply.toNumber(), 100);
  });

  it('should burn a given amount of tokens', async () => {
    const balance0 = await token.balanceOf.call(accounts[9]);
    assert.equal(balance0.toNumber(), 0);

    await token.mint.sendTransaction(accounts[9], 100, { from: accounts[1] });

    const balance1 = await token.balanceOf.call(accounts[9]);
    assert.equal(balance1.toNumber(), 100);

    const totalSupply0 = await token.totalSupply.call();
    assert.equal(totalSupply0.toNumber(), 100);

    await token.burn.sendTransaction(accounts[9], 50, { from: accounts[2] });

    const balance2 = await token.balanceOf.call(accounts[9]);
    assert.equal(balance2.toNumber(), 50);

    const totalSupply1 = await token.totalSupply.call();
    assert.equal(totalSupply1.toNumber(), 50);
  });
});
