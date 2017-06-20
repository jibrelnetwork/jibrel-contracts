// init the connection to the Ethereum network
window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('Please, install MetaMask!');
    }
    startApp();
});

// config params
let JibrelAPIAddress;
let JibrelAPI_ABI;
let CryDRRepo_ABI;
let ERC20_ABI;
let companyPaymentContractAddress;
let companyPaymentContractABI;

// payment function
function payOrder(oderId, orderValue) {
    // init Jibrel environment
    let JibrelAPIContract = window.web3.eth.contract(JibrelAPI_ABI).at(JibrelAPIAddress);
    let crydrRepoAddress = JibrelAPIContract.getCryDRRepository();
    let CryDRRepoContract = window.web3.eth.contract(CryDRRepo_ABI).at(crydrRepoAddress);
    let jUSDAddress = CryDRRepoContract.getCryDRAddress('USD');
    let jUSDContract = window.web3.eth.contract(ERC20_ABI).at(jUSDAddress);

    // init environment for the payment
    let paymentContract = window.web3.eth.contract(companyPaymentContractABI).at(companyPaymentContractAddress);

    // get config of the customer
    let customerAccount = window.web3.eth.accounts[0];

    // perform payment
    jUSDContract.approve(companyPaymentContractAddress, orderValue);
    // wait until user confirmed the tx
    paymentContract.payForOrder(orderId, orderValue, customerAccount);
    // wait until user confirmed the tx

    // done !
}
