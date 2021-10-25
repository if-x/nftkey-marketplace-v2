import {
  NFTKEYMarketplaceV2Instance,
  TestERC721Instance,
} from "../../types/truffle-contracts";

const TestERC721 = artifacts.require("TestERC721");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");

export const testTransferToken = async (accounts: Truffle.Accounts) => {
  let erc721: TestERC721Instance;
  let marketplaceInstance: NFTKEYMarketplaceV2Instance;

  before(async () => {
    erc721 = await TestERC721.deployed();
    marketplaceInstance = await NFTKEYMarketplaceV2.deployed();
  });

  it("Should transfer token and make listing invalid", async () => {
    const tokenId = 2;
    const listingBefore = await marketplaceInstance.getTokenListing(
      erc721.address,
      tokenId
    );

    // @ts-ignore
    await erc721.safeTransferFrom(listingBefore.seller, accounts[1], tokenId, {
      from: listingBefore.seller,
    });

    const listingAfter = await marketplaceInstance.getTokenListing(
      erc721.address,
      tokenId
    );

    assert.equal(Number(listingAfter.tokenId), 0);
  });
};
