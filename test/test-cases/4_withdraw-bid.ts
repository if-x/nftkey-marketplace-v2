import {
  NFTKEYMarketplaceV2Instance,
  TestERC20Instance,
  TestERC721Instance,
} from "../../types/truffle-contracts";

const TestERC721 = artifacts.require("TestERC721");
const TestERC20 = artifacts.require("TestERC20");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");

export const testWithdrawBid = async (accounts: Truffle.Accounts) => {
  let paymentToken: TestERC20Instance;
  let erc721: TestERC721Instance;
  let marketplaceInstance: NFTKEYMarketplaceV2Instance;

  before(async () => {
    paymentToken = await TestERC20.deployed();
    erc721 = await TestERC721.deployed();
    marketplaceInstance = await NFTKEYMarketplaceV2.deployed();
  });

  it("Should withdraw bid", async () => {
    const highestBidsBefore = await marketplaceInstance.getTokenHighestBid(
      erc721.address,
      0
    );

    const receipt = await marketplaceInstance.withdrawBidForToken(
      erc721.address,
      0,
      {
        from: accounts[6],
      }
    );
    console.log("Withdraw bid gas", receipt.receipt.gasUsed);

    const bids = await marketplaceInstance.getTokenBids(erc721.address, 0);
    assert.equal(bids.length, 4);

    const highestBidsAfter = await marketplaceInstance.getTokenHighestBid(
      erc721.address,
      0
    );

    assert.notEqual(highestBidsBefore.bidder, highestBidsAfter.bidder);
    assert.isAbove(
      Number(web3.utils.fromWei(highestBidsBefore.value)),
      Number(web3.utils.fromWei(highestBidsAfter.value))
    );
  });

  it("Should remove allowance and make bid invalid", async () => {
    const account = accounts[2];

    const bidBefore = await marketplaceInstance.getBidderTokenBid(
      erc721.address,
      0,
      account
    );
    assert.equal(bidBefore.bidder, account);

    await paymentToken.approve(marketplaceInstance.address, 0, {
      from: account,
    });

    const bidAfter = await marketplaceInstance.getBidderTokenBid(
      erc721.address,
      0,
      account
    );
    assert.notEqual(bidAfter.bidder, account);
  });
};

// After Withdraw Bids
//
// 0 => 2ETH => account3
// 0 => 3ETH => account4
// 0 => 4ETH => account5
//
// 1 => 1ETH => account6
// 2 => 1ETH => account6
// 3 => 1ETH => account6
