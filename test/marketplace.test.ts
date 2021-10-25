import { testListToken } from "./test-cases/1_list-token";
import { testDelistToken } from "./test-cases/2_delist-token";
import { testBidToken } from "./test-cases/3_bid-token";
import { testWithdrawBid } from "./test-cases/4_withdraw-bid";
import { testBuyToken } from "./test-cases/5_buy-token";
import { testAcceptBid } from "./test-cases/6_accept-bid";
import { testTransferToken } from "./test-cases/7_transfer-token";

// TODO: test royalty
contract("NFTKEYMarketPlaceV2", (accounts) => {
  // List
  describe("List token", async () => testListToken(accounts));

  // Delist;
  describe("Delist token", async () => testDelistToken(accounts));

  // Bid
  describe("Bid token", async () => testBidToken(accounts));

  // Withdraw bid
  describe("Withdraw token bid", async () => testWithdrawBid(accounts));

  // Buy token
  describe("Buy token", async () => testBuyToken(accounts));

  // Accept bid
  describe("Accept bid", async () => testAcceptBid(accounts));

  // Transfer
  describe("Transfer token", async () => testTransferToken(accounts));
});
