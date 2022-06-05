import { network, run, ethers } from "hardhat";
import { utils } from "ethers";

const main = async () => {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");
  const [deployer] = await ethers.getSigners();
  const currentNetwork = network.name;

  const Marry3Token = await ethers.getContractFactory("Marry3Token");
  const marry3token = await Marry3Token.deploy();

  await marry3token.deployed();

  console.log(`Deployed Marry3Token at ${marry3token.address}`);

  // const Marry3 = await ethers.getContractFactory("Marry3");
  // const marry3 = await Marry3.deploy(marry3token.address);

  // await marry3.deployed();

  // console.log(`Deployed Marry3 at ${marry3.address}`);

  // await (await marry3token.transferOwnership(marry3.address)).wait();

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
