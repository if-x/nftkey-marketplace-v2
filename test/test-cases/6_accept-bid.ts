import {
  NFTKEYMarketplaceV2Instance,
  TestERC20Instance,
  TestERC721Instance,
} from "../../types/truffle-contracts";
import { TokenBidAccepted } from "../../types/truffle-contracts/INFTKEYMarketplaceV2";

const TestERC20 = artifacts.require("TestERC20");
const TestERC721 = artifacts.require("TestERC721");
const NFTKEYMarketplaceV2 = artifacts.require("NFTKEYMarketplaceV2");

export const testAcceptBid = async (accounts: Truffle.Accounts) => {
  let paymentToken: TestERC20Instance;
  let erc721: TestERC721Instance;
  let marketplaceInstance: NFTKEYMarketplaceV2Instance;

  before(async () => {
    paymentToken = await TestERC20.deployed();
    erc721 = await TestERC721.deployed();
    marketplaceInstance = await NFTKEYMarketplaceV2.deployed();
  });

  it("Should accept bid", async () => {
    const tokenOwner = accounts[4]; // The owner after buy token
    const highestBid = await marketplaceInstance.getTokenHighestBid(
      erc721.address,
      0
    );

    await erc721.setApprovalForAll(marketplaceInstance.address, true, {
      from: tokenOwner,
    });

    const balanceBefore = await paymentToken.balanceOf(accounts[1]);

    const receipt = await marketplaceInstance.acceptBidForToken(
      erc721.address,
      0,
      highestBid.bidder,
      highestBid.value, // Should be 4ETH
      {
        from: tokenOwner,
      }
    );

    console.log("Accept bid gas", receipt.receipt.gasUsed);

    const acceptBidLog = receipt.logs.find(
      (log) => log.event === "TokenBidAccepted"
    ) as Truffle.TransactionLog<TokenBidAccepted>;

    console.log("serviceFee", web3.utils.fromWei(acceptBidLog.args.serviceFee));
    console.log("royaltyFee", web3.utils.fromWei(acceptBidLog.args.royaltyFee));

    assert.equal(
      web3.utils.fromWei(acceptBidLog.args.bid.value),
      web3.utils.fromWei(highestBid.value)
    );

    const balanceAfter = await paymentToken.balanceOf(tokenOwner);

    console.log("balanceBefore", web3.utils.fromWei(balanceBefore));
    console.log("balanceAfter", web3.utils.fromWei(balanceAfter));
  });
};

// After: Listings
// 2-4 => 1ETH => account3-5

// After: Bids
// 0 => 2ETH => account3
//
//
// 1 => 1ETH => account6
// 2 => 1ETH => account6
// 3 => 1ETH => account6
