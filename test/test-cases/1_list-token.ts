import {
  NFTKEYMarketplaceV2Instance,
  TestERC20Instance,
  TestERC721Instance,
} from "../../types/truffle-contracts";
import { TokenListed } from "../../types/truffle-contracts/INFTKEYMarketplaceV2";
import { assertRevert } from "../test-utils/assertions";
import { getUnixTimeAfterDays } from "../test-utils/timestamp";

const TestERC20 = artifacts.require("TestERC20");
const TestERC721 = artifacts.require("TestERC721");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");

const TOKEN_SUPPLY = 5;

export const testListToken = async (accounts: Truffle.Accounts) => {
  let paymentToken: TestERC20Instance;
  let erc721: TestERC721Instance;
  let marketplaceInstance: NFTKEYMarketplaceV2Instance;

  before(async () => {
    paymentToken = await TestERC20.deployed();
    erc721 = await TestERC721.deployed();
    marketplaceInstance = await NFTKEYMarketplaceV2.deployed();
  });

  it("Should mint payment tokens batch 1", async () => {
    // Mint payment tokens
    for (let i = 0; i < 7; i++) {
      await paymentToken.mint(web3.utils.toWei("10"), {
        from: accounts[i + 1],
      });
    }
  });

  it("Should mint ERC721", async () => {
    // Mint ERC721 tokens
    for (let i = 0; i < TOKEN_SUPPLY; i++) {
      await erc721.mint({ from: accounts[i + 1] });
    }
  });

  it("Should not be able to list if not approved", async () => {
    await assertRevert(
      marketplaceInstance.listToken(
        erc721.address,
        0,
        web3.utils.toWei("1"),
        getUnixTimeAfterDays(2),
        { from: accounts[1] }
      ),
      "Listing is not valid",
      "This token is not allowed to transfer by this contract"
    );
  });

  it("Should approve NFT spending", async () => {
    // Approve ERC721 tokens
    const promises = [];
    for (let i = 0; i < TOKEN_SUPPLY; i++) {
      promises.push(
        erc721.setApprovalForAll(marketplaceInstance.address, true, {
          from: accounts[i + 1],
        })
      );
    }
    await Promise.all(promises);
  });

  it("Should list token for sale", async () => {
    const receipt = await marketplaceInstance.listToken(
      erc721.address,
      0,
      web3.utils.toWei("1"),
      getUnixTimeAfterDays(2),
      { from: accounts[1] }
    );

    console.log("Listing gas", receipt.receipt.gasUsed);

    const tokenListedLog = receipt.logs.find(
      (log) => log.event === "TokenListed"
    ) as Truffle.TransactionLog<TokenListed>;

    assert.equal(tokenListedLog.args.listing.seller, accounts[1]);
    assert.equal(web3.utils.fromWei(tokenListedLog.args.listing.value), "1");
    assert.equal(tokenListedLog.args.tokenId.toNumber(), 0);
  });

  it("Should have one listing", async () => {
    const listing = await marketplaceInstance.getTokenListing(
      erc721.address,
      0
    );

    assert.equal(listing.seller, accounts[1]);
    assert.equal(web3.utils.fromWei(listing.value), "1");
    assert.equal(Number(listing.tokenId), 0);
    const listings = await marketplaceInstance.getTokenListings(
      erc721.address,
      0,
      10
    );
    assert.equal(listings.length, 1);
    assert.equal(listings[0].seller, listing.seller);
  });

  it("Should update listing token", async () => {
    const receipt = await marketplaceInstance.listToken(
      erc721.address,
      0,
      web3.utils.toWei("2"),
      getUnixTimeAfterDays(2),
      { from: accounts[1] }
    );

    const tokenListedLog = receipt.logs.find(
      (log) => log.event === "TokenListed"
    ) as Truffle.TransactionLog<TokenListed>;

    assert.equal(tokenListedLog.args.listing.seller, accounts[1]);
    assert.equal(web3.utils.fromWei(tokenListedLog.args.listing.value), "2");
    assert.equal(tokenListedLog.args.tokenId.toNumber(), 0);
  });

  it("Should list other tokens", async () => {
    const promises = [];
    for (let i = 0; i < TOKEN_SUPPLY; i++) {
      promises.push(
        marketplaceInstance.listToken(
          erc721.address,
          i,
          web3.utils.toWei("1"),
          getUnixTimeAfterDays(2),
          {
            from: accounts[i + 1],
          }
        )
      );
    }

    const receipts = await Promise.all(promises);
    console.log("Listing gas 1", receipts[1].receipt.gasUsed);
    console.log("Listing gas 2", receipts[2].receipt.gasUsed);

    const startTime = Date.now();
    const listings = await marketplaceInstance.getTokenListings(
      erc721.address,
      0,
      10
    );
    const endTime = Date.now();

    console.log("Query time", endTime - startTime);

    assert.equal(listings.length, TOKEN_SUPPLY);
  });
};

// After
// 0 => 2ETH => account1
// 1-4 => 1ETH => account2-5
