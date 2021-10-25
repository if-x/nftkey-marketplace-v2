import {
  NFTKEYMarketplaceV2Instance,
  TestERC20Instance,
  TestERC721Instance,
} from "../../types/truffle-contracts";

const TestERC20 = artifacts.require("TestERC20");
const TestERC721 = artifacts.require("TestERC721");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");

export const templates = async (accounts: Truffle.Accounts) => {
  let paymentToken: TestERC20Instance;
  let erc721: TestERC721Instance;
  let marketplaceInstance: NFTKEYMarketplaceV2Instance;

  before(async () => {
    paymentToken = await TestERC20.deployed();
    erc721 = await TestERC721.deployed();
    marketplaceInstance = await NFTKEYMarketplaceV2.deployed();
  });

  it("Test case", async () => {});
};
