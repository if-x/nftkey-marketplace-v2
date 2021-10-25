import {
  NFTKEYMarketplaceV2Instance,
  TestERC721Instance,
} from "../../types/truffle-contracts";
import { TokenDelisted } from "../../types/truffle-contracts/INFTKEYMarketplaceV2";
import { assertRevert } from "../test-utils/assertions";

const TestERC721 = artifacts.require("TestERC721");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");

export const testDelistToken = async (accounts: Truffle.Accounts) => {
  let erc721: TestERC721Instance;
  let marketplaceInstance: NFTKEYMarketplaceV2Instance;

  before(async () => {
    erc721 = await TestERC721.deployed();
    marketplaceInstance = await NFTKEYMarketplaceV2.deployed();
  });

  it("Should delist token", async () => {
    const receipt = await marketplaceInstance.delistToken(erc721.address, 1, {
      from: accounts[2],
    });

    console.log("Delist gas", receipt.receipt.gasUsed);

    const delistLog = receipt.logs.find(
      (log) => log.event === "TokenDelisted"
    ) as Truffle.TransactionLog<TokenDelisted>;

    assert.equal(delistLog.args.listing.seller, accounts[2]);
    assert.equal(Number(delistLog.args.tokenId), 1);

    const startTime = Date.now();
    const listings = await marketplaceInstance.getTokenListings(
      erc721.address,
      0,
      10
    );
    const endTime = Date.now();

    console.log("Query time", endTime - startTime);

    assert.equal(listings.length, 4);
  });

  it("Should revert if not token owner", async () => {
    await assertRevert(
      marketplaceInstance.delistToken(erc721.address, 3, { from: accounts[1] }),
      "Only token seller can delist token",
      "Only token seller can delist token"
    );
  });
};

// After
// 0 => 2ETH => account1
// 2-4 => 1ETH => account3-5
