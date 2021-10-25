import {
  NFTKEYMarketplaceV2Instance,
  TestERC20Instance,
  TestERC721Instance,
} from "../../types/truffle-contracts";
import { assertRevert } from "../test-utils/assertions";
import { getUnixTimeAfterDays } from "../test-utils/timestamp";

const TestERC20 = artifacts.require("TestERC20");
const TestERC721 = artifacts.require("TestERC721");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");

export const testBidToken = async (accounts: Truffle.Accounts) => {
  let paymentToken: TestERC20Instance;
  let erc721: TestERC721Instance;
  let marketplaceInstance: NFTKEYMarketplaceV2Instance;

  before(async () => {
    paymentToken = await TestERC20.deployed();
    erc721 = await TestERC721.deployed();
    marketplaceInstance = await NFTKEYMarketplaceV2.deployed();
  });

  it("Should no able to bid on token if is owner", async () => {
    await assertRevert(
      marketplaceInstance.enterBidForToken(
        erc721.address,
        0,
        web3.utils.toWei("1"),
        getUnixTimeAfterDays(2),
        { from: accounts[1] }
      ),
      "Bid is not valid",
      "This Token belongs to this address"
    );
  });

  it("Should no able to bid on token before set allowance", async () => {
    await assertRevert(
      marketplaceInstance.enterBidForToken(
        erc721.address,
        0,
        web3.utils.toWei("1"),
        getUnixTimeAfterDays(2),
        { from: accounts[2] }
      ),
      "Bid is not valid",
      "Need to have enough token holding and allowance to bid on this token"
    );
  });

  it("Should approve payment token spending", async () => {
    // Approve payment tokens
    const promises = [];
    for (let i = 0; i < 7; i++) {
      promises.push(
        paymentToken.approve(
          marketplaceInstance.address,
          web3.utils.toWei("10"),
          {
            from: accounts[i + 1],
          }
        )
      );
    }
    await Promise.all(promises);
  });

  it("Should place bid on token", async () => {
    const balance = await paymentToken.balanceOf(accounts[2]);
    await paymentToken.approve(marketplaceInstance.address, balance, {
      from: accounts[2],
    });

    const receipt = await marketplaceInstance.enterBidForToken(
      erc721.address,
      0,
      web3.utils.toWei("1"),
      getUnixTimeAfterDays(2),
      { from: accounts[2] }
    );

    console.log("Bidding gas", receipt.receipt.gasUsed);

    const bids = await marketplaceInstance.getTokenBids(erc721.address, 0);
    assert.equal(bids[0].bidder, accounts[2]);
  });

  it("Should place mutiple bids", async () => {
    for (let i = 0; i < 4; i++) {
      const account = accounts[i + 3];
      const balance = await paymentToken.balanceOf(account);
      await paymentToken.approve(marketplaceInstance.address, balance, {
        from: account,
      });
      const receipt = await marketplaceInstance.enterBidForToken(
        erc721.address,
        0,
        web3.utils.toWei(`${i + 2}`),
        getUnixTimeAfterDays(2),
        { from: account }
      );
      console.log("Bidding gas", receipt.receipt.gasUsed);
    }
    for (let i = 0; i < 3; i++) {
      const receipt = await marketplaceInstance.enterBidForToken(
        erc721.address,
        i + 1,
        web3.utils.toWei("1"),
        getUnixTimeAfterDays(2),
        { from: accounts[6] }
      );
      console.log("Bidding gas", receipt.receipt.gasUsed);
    }

    const bids = await marketplaceInstance.getTokenBids(erc721.address, 0);
    assert.equal(bids.length, 5);

    const startTime = Date.now();
    const allHighestBids = await marketplaceInstance.getTokenHighestBids(
      erc721.address,
      0,
      10
    );
    const endTime = Date.now();
    assert.equal(allHighestBids.length, 4);
    console.log("Query time getAllTokenHighestBids", endTime - startTime);
  });
};

// After Bids
// 0 => 1ETH => account2
// 0 => 2ETH => account3
// 0 => 3ETH => account4
// 0 => 4ETH => account5
// 0 => 5ETH => account6
// 1 => 1ETH => account6
// 2 => 1ETH => account6
// 3 => 1ETH => account6
