"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestERC20 = artifacts.require("TestERC20");
const TestERC721 = artifacts.require("TestERC721");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");
module.exports = async (deployer, network
// accounts: string[]
) => {
    console.log(network);
    if (network === "development") {
        await deployer.deploy(TestERC721);
        const erc721 = await TestERC721.deployed();
        console.log(`TestERC721 deployed at ${erc721.address} in network: ${network}.`);
        await deployer.deploy(TestERC20);
        const erc20 = await TestERC20.deployed();
        console.log(`TestERC20 deployed at ${erc20.address} in network: ${network}.`);
        await deployer.deploy(NFTKEYMarketplaceV2, erc20.address);
        const marketplaceV2 = await NFTKEYMarketplaceV2.deployed();
        console.log(`NFTKEYMarketplaceV2 deployed at ${marketplaceV2.address} in network: ${network}.`);
    }
    if (network === "bsctestnet") {
        // await deployer.deploy(
        //   NFTKEYMarketplaceV2,
        //   "0xae13d989dac2f0debff460ac112a837c89baa7cd" // WBNB Testnet
        // );
        // const marketplaceV2 = await NFTKEYMarketplaceV2.deployed();
        // console.log(
        //   `NFTKEYMarketplaceV2 for Life deployed at ${marketplaceV2.address} in network: ${network}.`
        // );
    }
    if (network === "bsc") {
        await deployer.deploy(NFTKEYMarketplaceV2, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" // WBNB
        );
        const marketplaceV2 = await NFTKEYMarketplaceV2.deployed();
        console.log(`NFTKEYMarketplaceV2 for Binance Bull Society deployed at ${marketplaceV2.address} in network: ${network}.`);
    }
    if (network === "ropsten") {
        // await deployer.deploy(
        //   NFTKEYMarketplaceV2,
        //   "0xc778417E063141139Fce010982780140Aa0cD5Ab" // WETH Ropsten
        // );
        // const marketplaceV2 = await NFTKEYMarketplaceV2.deployed();
        // console.log(
        //   `NFTKEYMarketplaceV2 for Spunks deployed at ${marketplaceV2.address} in network: ${network}.`
        // );
    }
    if (network === "main") {
        // await deployer.deploy(
        //   NFTKEYMarketplaceV2,
        //   "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" // WETH
        // );
        // const marketplaceV2 = await NFTKEYMarketplaceV2.deployed();
        // console.log(
        //   `NFTKEYMarketplaceV2 for Spunks deployed at ${marketplaceV2.address} in network: ${network}.`
        // );
    }
};
