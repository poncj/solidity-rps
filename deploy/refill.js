// FOR NODE.JS ONLY

const ethers = require("ethers");
const fs = require('fs');
require('dotenv').config();

const abi = fs.readFileSync("./RPS2_sol_RockPaperScissors.abi", "utf-8"); // fetch

async function refill() {

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, account);
    await contract.Refill({value: ethers.utils.parseUnits(process.env.REFILL_AMOUNT)});
    let balance = await provider.getBalance(contract.address);

    console.log(`Contract balance is ${balance}`);
}

refill().then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1);
});

