"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestERC20 = artifacts.require("TestERC20");
const TestERC721 = artifacts.require("TestERC721");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");
const PaymentTokenAddress = {
    bsctestnet: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    bsc: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    ftm: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    avax: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    ropsten: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    main: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    matic: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
};
module.exports = async (deployer, network
// accounts: string[]
) => {
    const gasPrice = await web3.eth.getGasPrice();
    console.log("Gas price on", network, web3.utils.fromWei(gasPrice, "gwei"), "gwei");
    if (network === "development") {
        await deployer.deploy(TestERC721, { gasPrice });
        const erc721 = await TestERC721.deployed();
        console.log(`TestERC721 deployed at ${erc721.address} in network: ${network}.`);
        await deployer.deploy(TestERC20, { gasPrice });
        const erc20 = await TestERC20.deployed();
        console.log(`TestERC20 deployed at ${erc20.address} in network: ${network}.`);
        await deployer.deploy(NFTKEYMarketplaceV2, erc20.address, { gasPrice });
        const marketplaceV2 = await NFTKEYMarketplaceV2.deployed();
        console.log(`NFTKEYMarketplaceV2 deployed at ${marketplaceV2.address} in network: ${network}.`);
    }
    const paymentTokenAddress = PaymentTokenAddress[network];
    if (paymentTokenAddress) {
        await deployer.deploy(NFTKEYMarketplaceV2, paymentTokenAddress, {
            gasPrice,
        });
        const marketplaceV2 = await NFTKEYMarketplaceV2.deployed();
        console.log(`NFTKEYMarketplaceV2 deployed at ${marketplaceV2.address} in network: ${network}.`);
    }
};
