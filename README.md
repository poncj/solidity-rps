# Assignment 3 | Rock Paper Scissors

## How to use

Everything in the `/deploy/` folder is intended to be used on local machine.

Everything in the `/production/` folder is intended to be uploaded to the hosting.

So for a successful installation, we must first deploy the contract, and then upload the files from the production folder to the hosting.

### How to /deploy/ contract

1. Download full repository to your local machine.

2. Open /deploy/ folder via VS Code

3. Create the .env file inside /deploy/ folder and specify your `PRIVATE_KEY` in it from which the contract will be deployed.

3. Also specify `RPC_URL` in the .env file.

3. Open terminal and start to execute commands:

This command will install all the libraries needed to deploy the contracts

```bash
npm i
```

4. Type next command. It will deploy the contract.

```bash
node deploy.js
```

4. Аfter executing the previous command in the terminal we should see the contract address. You must copy this address and specify it in your .env as `CONTRACT_ADDRESS`.

This is where the deployment of contract ends. Now we need to configure the files of the /production/ folder.

### How to configure /production/

1. Open /production/ folder via VS Code.

2. Specify the `RPC_URL`, and `CONTRACT_ADDRESS` parameters you specified earlier in the .env file in config.js

3. Specify `TESTNET_ID` as chain_id

This ends the setup of the /production/ folder. Now you need to upload the files of the /production/ folder to the hosting.

## Done!
