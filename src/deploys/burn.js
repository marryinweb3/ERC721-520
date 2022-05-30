const { ethers, network, run } = require("hardhat");
const { utils } = require("ethers");

const main = async () => {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");
  const [deployer] = await ethers.getSigners();
  const currentNetwork = network.name;

  if (currentNetwork == "mainnet") return;
  //   const Marry3Token = await ethers.getContractFactory("Marry3Token");
  //   const marry3token = await Marry3Token.deploy();

  //   await marry3token.deployed();

  // console.log(`Deployed Marry3Token at ${marry3token.address}`);

  const Marry3 = await ethers.getContractFactory("Marry3");
  const marry3 = Marry3.attach("0x12f938AE64b4e73D7D8Ef30dA9A4BB45B944A595");

  //   await marry3.deployed();

  //   console.log(`Deployed Marry3 at ${marry3.address}`);

  //   await (await marry3token.setBaseURI("https://marry3-dev.vercel.app/api/meta")).wait();
  await (
    await marry3["burnByOwner(address,address)"](
      "0xF95555A29E58188147D3A3AcD6e2Ffeb04EA7dd5",
      "0xfe1fa387c545ac7bfa46f6d720baa16902037f10"
    )
  ).wait();

  console.log("transferOwnership");

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
