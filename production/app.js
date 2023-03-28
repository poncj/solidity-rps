import { getContractData } from './assets/js/contract/connect.js';
import { ModelContract } from './assets/js/contract/modelContract.js';
import { ethers } from './assets/js/lib/ethers/ethers-5.7.2.esm.min.js';
import './assets/js/lib/jquery/jquery-3.6.4.min.js';

let appState = {
    last_block: 0,
    loading: false
}

async function run() {
    
    const contractData = await getContractData();
    const contract = new ModelContract(contractData);

    appState.loading = true;

    let minBet = await contract.getMinBet();
    
    let contractAmount = await contractData.provider.getBalance(contractData.contract.address);
    let signerAmount = await contractData.provider.getBalance(contractData.signer.address);

    $("#contract_amount").text(`${ethers.utils.formatEther(contractAmount)} TBNB`);
    $("#address_amount").text(`${ethers.utils.formatEther(signerAmount)} TBNB`);
    $("#minBet").text(`${ethers.utils.formatEther(minBet)} TBNB`);
    
   
    appState.last_block = await getHistory(contractData, appState.last_block);
    
    appState.loading = false;

    $('.choice').on('click', async function() {

        try {

            $("#log_message").text("Loading...");

            $('#log_amount').removeClass();
            $('#log_amount').addClass('bg-opacity-25 card-footer text-body-secondary');
            $('#log_amount').text(`--`);

            if (appState.loading) {
                $("#log_message").text("Wait! Loading...");
                return false;
            }
            
            appState.loading = true;

            let inputValue = $('#bet_amount').val().trim();
            
            if (inputValue == "") {
                $("#log_message").text("Error! Bet is too small");
                appState.loading = false;
                return false;
            }

            const _inputValue = parseFloat(inputValue);

            if (isNaN(_inputValue)) {
                $("#log_message").text("Error! Bet is not a number");
                appState.loading = false;
                return false;
            }
            
            signerAmount = await contractData.provider.getBalance(contractData.signer.address);
            contractAmount = await contractData.provider.getBalance(contractData.contract.address);
            
            const _signerAmount = parseFloat(ethers.utils.formatEther(signerAmount));
            const _contractAmount = parseFloat(ethers.utils.formatEther(contractAmount));

            const _minBet = parseFloat(ethers.utils.formatEther(minBet));

            if (_inputValue < _minBet) {
                $("#log_message").text("Error! Bet is too small");
                appState.loading = false;
                return false;
            }

            if (_inputValue > _signerAmount) {
                $("#log_message").text("Error! Your balance is too low");
                appState.loading = false;
                return false;
            }            

            if (_inputValue > _contractAmount) {
                $("#log_message").text("Error! Contract balance is too low");
                appState.loading = false;
                return false;
            }
            
            const choice = $(this).attr('id');

            if (choice == 'rock') {

                let response = await contract.Rock(inputValue);
                let result = await response.wait();
                let [GamePlayed] = result.events;

                contractAmount = await contractData.provider.getBalance(contractData.contract.address);
                signerAmount = await contractData.provider.getBalance(contractData.signer.address);

                $("#contract_amount").text(`${ethers.utils.formatEther(contractAmount)} TBNB`);
                $("#address_amount").text(`${ethers.utils.formatEther(signerAmount)} TBNB`);
                $("#log_message").text(GamePlayed.args[2]);

                printGameResult(GamePlayed.args);

                appState.last_block = await getHistory(contractData, appState.last_block);
                appState.loading = false;
            } else if (choice == 'paper') {

                let response = await contract.Paper(inputValue);
                let result = await response.wait();
                let [GamePlayed] = result.events;

                contractAmount = await contractData.provider.getBalance(contractData.contract.address);
                signerAmount = await contractData.provider.getBalance(contractData.signer.address);

                $("#contract_amount").text(`${ethers.utils.formatEther(contractAmount)} TBNB`);
                $("#address_amount").text(`${ethers.utils.formatEther(signerAmount)} TBNB`);
                $("#log_message").text(GamePlayed.args[2]);
                
                printGameResult(GamePlayed.args);

                appState.last_block = await getHistory(contractData, appState.last_block);
                appState.loading = false;
            } else if (choice == 'scissors') {

                let response = await contract.Scissors(inputValue);
                let result = await response.wait();
                let [GamePlayed] = result.events;

                contractAmount = await contractData.provider.getBalance(contractData.contract.address);
                signerAmount = await contractData.provider.getBalance(contractData.signer.address);

                $("#contract_amount").text(`${ethers.utils.formatEther(contractAmount)} TBNB`);
                $("#address_amount").text(`${ethers.utils.formatEther(signerAmount)} TBNB`);
                $("#log_message").text(GamePlayed.args[2]);

                printGameResult(GamePlayed.args);
                
                appState.last_block = await getHistory(contractData, appState.last_block);
                appState.loading = false;
            } else {
                appState.loading = false;
                throw "Bad option. Refresh page";
            }
        } catch(err) {
            $("#log_message").text('ERROR. Check console for details!');
            console.log(err);
            appState.loading = false;
        }
    });
}


// ONLY 5000 BLOCKS ALLOWED
async function getHistory(contractData, last_block) {

    let historyData;   
    let filterFrom = contractData.contract.filters.GamePlayed(contractData.signer.address);
    
    if (last_block == 0) {
        historyData = await contractData.contract.queryFilter(filterFrom, -500);
    } else {
        historyData = await contractData.contract.queryFilter(filterFrom, last_block);
    }

    printHistory(historyData, last_block);
    
    if (historyData.length > 0) {
        return historyData[historyData.length - 1].blockNumber;
    } else {
        return last_block;
    }
}

/*
async function getHistory2(contractData, last_block) {
    let etherscanProvider = await new ethers.providers.EtherscanProvider();
    let history = await etherscanProvider.getHistory(contractData.signer.address);
    console.log(history);
}
*/

function printHistory(historyData, last_block) {
    historyData.forEach(element => {
        if (element.blockNumber == last_block && last_block != 0) {
            return; // only for foreach;
        }
        let status = element.args[1];
        let html = ``;
        if (status == 0) { // draw
            html = `
                <tr class="table-light">
                    <th scope="row">DRAW</th>
                    <td>${ethers.utils.formatEther(element.args[3])} TBNT</td>
                </tr>
            `;
        } else if (status == 1) { //won
            html = `
                <tr class="table-success">
                    <th scope="row">WIN</th>
                    <td>+${ethers.utils.formatEther(element.args[4])} TBNT</td>
                </tr>
            `;
        } else if (status == 2) { // lost
            html = `
                <tr class="table-danger">
                    <th scope="row">LOSS</th>
                    <td>-${ethers.utils.formatEther(element.args[3])} TBNT</td>
                </tr>
            `;
        }
        if (html != ``) {
            $('#history_block_tbody').prepend(html);
        }
    });
}

function printGameResult(args) {
    let classHtml = 'bg-opacity-25 card-footer text-body-secondary';

    $('#log_amount').removeClass();
    $('#log_amount').addClass(classHtml);

    if (args[1] === 0) {
        //draw
        $('#log_amount').text(`Bet was ${ethers.utils.formatEther(args[3])} TBNB`);
    } else if (args[1] === 1) {
        //playerWon
        $('#log_amount').addClass('bg-success');
        $('#log_amount').text(`You won ${ethers.utils.formatEther(args[4])} TBNB`);
    } else if (args[1] === 2) {
        //playerlost
        $('#log_amount').addClass('bg-danger');
        $('#log_amount').text(`You lost ${ethers.utils.formatEther(args[3])} TBNB`);
    } else {
        //error
        $('#log_amount').text(`--`);
    }
}

$(async function() {
    if (window.ethereum) {
        await run();
        window.ethereum.on('accountsChanged', async function () {
            appState.last_block = 0;
            $('.choice').off('click');
            $('#history_block_tbody').html('');
            $('#bet_amount').val('');
            $('#log_message').text('Place a bet and choose option!');
            $('#log_amount').text('--');
            $('#log_amount').removeClass();
            $('#log_amount').addClass('bg-opacity-50 card-footer text-body-secondary');
            await run();
        })
    } else {
        $('#log_message').text('ERROR! Metamask not found. Connect metamask and refresh page');
    } 
});
