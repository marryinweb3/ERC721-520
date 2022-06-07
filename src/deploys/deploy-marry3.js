const { ethers, network, run } = require("hardhat");
const { utils } = require("ethers");

const main = async () => {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");
  const [deployer] = await ethers.getSigners();
  const currentNetwork = network.name;

  // if (currentNetwork == "mainnet") return;

  const Marry3 = await ethers.getContractFactory("Marry3");
  const marry3 = await Marry3.deploy();

  await marry3.deployed();

  console.log(`Deployed Marry3 at ${marry3.address}`);

  // await (await marry3.setBaseURI("https://marry3.love/api/meta")).wait();

  // await (
  //   await marry3.mint(
  //     "0xF95555A29E58188147D3A3AcD6e2Ffeb04EA7dd5",
  //     "0x03f181DbCcfb8d7E3F23847E846e28575FFB902b"
  //   )
  // ).wait();

  // console.log(await marry3token.tokenURI(1));
  // console.log(await marry3token.tokenURI(2));
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
