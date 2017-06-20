const JibrelAPI = artifacts.require('JibrelAPI.sol');

contract('JibrelAPI', (accounts) => {
  let jibrelAPI;

  const owner   = accounts[0];
  const manager = accounts[1];

  const BODC               = accounts[2];
  const JibrelDAO          = accounts[3];
  const InvestorRepository = accounts[4];
  const CryDRRepository    = accounts[5];


  beforeEach(async () => {
    jibrelAPI = await JibrelAPI.new(BODC,
                                    JibrelDAO,
                                    InvestorRepository,
                                    CryDRRepository,
                                    { from: owner });
  });

  it('should be able to configure addresses', async () => {
    let BODCReceived;
    let JibrelDAOReceived;
    let InvestorRepositoryReceived;
    let CryDRRepositoryReceived;

    BODCReceived               = await jibrelAPI.getBODC.call();
    JibrelDAOReceived          = await jibrelAPI.getJibrelDAO.call();
    InvestorRepositoryReceived = await jibrelAPI.getInvestorRepository.call();
    CryDRRepositoryReceived    = await jibrelAPI.getCryDRRepository.call();
    assert.equal(BODCReceived.toString(), BODC);
    assert.equal(JibrelDAOReceived.toString(), JibrelDAO);
    assert.equal(InvestorRepositoryReceived.toString(), InvestorRepository);
    assert.equal(CryDRRepositoryReceived.toString(), CryDRRepository);

    await jibrelAPI.enableManager.sendTransaction(manager, { from: owner });
    await jibrelAPI.grantManagerPermission.sendTransaction(manager, 'set_bodc', { from: owner });
    await jibrelAPI.grantManagerPermission.sendTransaction(manager, 'set_jibrel_dao', { from: owner });
    await jibrelAPI.grantManagerPermission.sendTransaction(manager, 'set_investor_repo', { from: owner });
    await jibrelAPI.grantManagerPermission.sendTransaction(manager, 'set_crydr_repo', { from: owner });

    jibrelAPI.setBODC.sendTransaction(accounts[6], { from: manager });
    jibrelAPI.setJibrelDAO.sendTransaction(accounts[6], { from: manager });
    jibrelAPI.setInvestorRepository.sendTransaction(accounts[6], { from: manager });
    jibrelAPI.setCryDRRepository.sendTransaction(accounts[6], { from: manager });

    BODCReceived               = await jibrelAPI.getBODC.call();
    JibrelDAOReceived          = await jibrelAPI.getJibrelDAO.call();
    InvestorRepositoryReceived = await jibrelAPI.getInvestorRepository.call();
    CryDRRepositoryReceived    = await jibrelAPI.getCryDRRepository.call();
    assert.notEqual(BODCReceived.toString(), BODC);
    assert.notEqual(JibrelDAOReceived.toString(), JibrelDAO);
    assert.notEqual(InvestorRepositoryReceived.toString(), InvestorRepository);
    assert.notEqual(CryDRRepositoryReceived.toString(), CryDRRepository);
  });
});
