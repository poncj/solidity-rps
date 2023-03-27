
import { ethers } from "../lib/ethers/ethers-5.7.2.esm.min.js";
import { config } from "/config.js";

export async function getContractData() {

    let abi = await fetch("./RPS2_sol_RockPaperScissors.abi");
    abi = await abi.text();

    const contractData = {
        abi: abi,
        signer: false,
        contract: false,
        provider: false
    }

    // contractData.provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
    // contractData.signer = new ethers.Wallet(config.PRIVATE_KEY, contractData.provider);
    // contractData.contract = new ethers.Contract(config.CONTRACT_ADDRESS, contractData.abi, contractData.signer);

    /*
        ganache JsonRpcProvider
        when deployed to productin blockchain use Web3Provider:
        
        web3 production
    */
    contractData.provider = new ethers.providers.Web3Provider(window.ethereum, config.TESTNET_ID); //id
    let listAccounts = await contractData.provider.send("eth_requestAccounts", []);
    let signer = await contractData.provider.getSigner(listAccounts[0]);
    signer.address = await signer.getAddress(); // could couse problems later
    contractData.signer = signer
    contractData.contract = await new ethers.Contract(config.CONTRACT_ADDRESS, contractData.abi, contractData.signer);

    return Object.freeze(contractData);
}


