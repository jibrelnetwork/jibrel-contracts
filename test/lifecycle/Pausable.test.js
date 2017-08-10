const Pausable = global.artifacts.require('Pausable.sol');


global.contract('Pausable', (accounts) => {
  let pausableContract;


  const owner   = accounts[0];
  const manager = accounts[1];

  global.beforeEach(async () => {
    pausableContract = await Pausable.new({ from: owner });
  });

  global.it('check Pausable contract', async () => {

    global.console.log(`\tpausableContract: ${pausableContract.address}`);
    global.assert.equal(pausableContract.address == 0x0, false);

    let isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, true, 'The paused must be true');

    let isTrow = false;
    await pausableContract.pause.sendTransaction().catch(() => {
      isTrow = true;
    });
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isTrow && isPaused, true,
      'It should throw an exception if pause called by any account other than the manager or when the contract IS paused');

    isTrow = false;
    await pausableContract.unpause.sendTransaction().catch(() => {
      isTrow = true;
    });
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isTrow && isPaused, true,
      'It should throw an exception if pause called by any account other than the manager or when the contract IS not paused');

    await pausableContract.enableManager.sendTransaction(manager, { from: owner });
    let isManagerEnabled = await pausableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);

    await pausableContract.grantManagerPermission.sendTransaction(manager, 'pause_contract', { from: owner });
    let isManagerAllowed = await pausableContract.isManagerAllowed.call(manager, 'pause_contract');
    global.assert.equal(isManagerAllowed, true);

    await pausableContract.grantManagerPermission.sendTransaction(manager, 'unpause_contract', { from: owner });
    isManagerAllowed = await pausableContract.isManagerAllowed.call(manager, 'unpause_contract');
    global.assert.equal(isManagerAllowed, true);

    isTrow = false;
    await pausableContract.pause.sendTransaction().catch(() => {
      isTrow = true;
    });
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isTrow && isPaused, true,
      'It should throw an exception when the contract IS paused');

    await pausableContract.unpause.sendTransaction({ from: manager });
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, false);

    await pausableContract.pause.sendTransaction({ from: manager });
    isPaused = await pausableContract.getPaused.call();
    global.assert.equal(isPaused, true);
  });
});
