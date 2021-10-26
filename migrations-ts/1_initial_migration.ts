const Migrations = artifacts.require("Migrations");

module.exports = async (deployer: Truffle.Deployer) => {
  const gasPrice = await web3.eth.getGasPrice();
  console.log("gasPrice", web3.utils.fromWei(gasPrice, "gwei"));

  await deployer.deploy(Migrations, { gasPrice });
};

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
