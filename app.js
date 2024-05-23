const contractAddress = '0x0F611dC0928E001a0AB7530E7C7f0eC77b6D6FD9';  // マイグレーション後のアドレスに置き換え
const contractABI = [
    // ABIの内容を貼り付け
    {
        "constant": false,
        "inputs": [
            {
                "name": "num",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let simpleStorage;

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("User denied account access")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    simpleStorage = new web3.eth.Contract(contractABI, contractAddress);
});

async function storeNumber() {
    const accounts = await web3.eth.getAccounts();
    const number = document.getElementById('numberInput').value;
    simpleStorage.methods.store(number).send({ from: accounts[0] })
        .on('receipt', function(receipt) {
            console.log('Number stored:', receipt);
        })
        .on('error', function(error, receipt) {
            console.error('Error storing number:', error);
        });
}

async function retrieveNumber() {
    simpleStorage.methods.retrieve().call()
        .then(function(result) {
            document.getElementById('displayArea').innerText = 'Stored Number: ' + result;
        })
        .catch(function(error) {
            console.error('Error retrieving number:', error);
        });
}
