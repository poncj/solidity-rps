import { config } from "/config.js";
import { ethers } from "../lib/ethers/ethers-5.7.2.esm.min.js";

export class ModelContract {
    constructor(data) {
        this.contract = data.contract;
        this.abi = data.abi;
        this.signer = data.signer;
    };

    async getMinBet() {
        return await this.contract.minBet();
    }
    
    async Rock(value) {
        const options = {
            value: ethers.utils.parseUnits(value),
            gasLimit: config.BASE_GAS_LIMIT,
        }
        return await this.contract.Rock(options);
    }

    async Paper(value) {
        const options = {
            value: ethers.utils.parseUnits(value),
            gasLimit: config.BASE_GAS_LIMIT,
        }
        return await this.contract.Paper(options);
    }

    async Scissors(value) {
        const options = {
            value: ethers.utils.parseUnits(value),
            gasLimit: config.BASE_GAS_LIMIT,
        }
        return await this.contract.Scissors(options);
    }

    async Refill(value) {
        const options = {
            value: ethers.utils.parseUnits(value),
            gasLimit: config.BASE_GAS_LIMIT,
        }
        return await this.contract.Refill(options);
    }
}