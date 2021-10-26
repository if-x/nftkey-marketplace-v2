"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Migrations = artifacts.require("Migrations");
module.exports = async (deployer) => {
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice", web3.utils.fromWei(gasPrice, "gwei"));
    await deployer.deploy(Migrations, { gasPrice });
};
