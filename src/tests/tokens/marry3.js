const { expect } = require("chai");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const whitelistAddress = [
  "0xF95555A29E58188147D3A3AcD6e2Ffeb04EA7dd5",
  "0xfe1fa387C545Ac7bfA46F6d720baA16902037F10",
  "0x4374311B5d68E9eC496B70a55b8dD9469c804D1C",
  "0xF4634A201A7E923Ee7c009B47389C9a0533EF537"
];

const nonce = "i will";
const burnnonce = "fine";

describe("marry3", function() {
  let nfToken, owner, bob, jane, sara;
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const id1 = 0;
  const id2 = 1;

  beforeEach(async () => {
    const nftContract = await ethers.getContractFactory("Marry3");
    nfToken = await nftContract.deploy();
    [owner, p1, p2, p3, p4, p5, p6] = await ethers.getSigners();

    whitelistAddress.push(p1.address);
    whitelistAddress.push(p2.address);
    whitelistAddress.push(p3.address);
    await nfToken.deployed();
  });

  it("correctly mints two NFT for A and B", async function() {
    // await nfToken.connect(owner).setMarryCount(100);

    const leafNodes = whitelistAddress.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    await (await nfToken.connect(owner).setMercleRoot(merkleTree.getHexRoot())).wait();

    const proof = merkleTree.getHexProof(keccak256(p1.address));
    const hash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string"], [nonce]));

    const message = ethers.utils.arrayify(hash);
    const signature = await p2.signMessage(message);
    expect(
      await nfToken
        .connect(p1)
        ["mint(address,address,uint8,uint8,bytes,bytes32[])"](
          p1.address,
          p2.address,
          0,
          1,
          signature,
          proof
        )
    ).to.emit(nfToken, "Transfer");

    expect(await nfToken.balanceOf(p1.address)).to.equal(1);
    expect(await nfToken.balanceOf(p2.address)).to.equal(1);
    const proof5 = merkleTree.getHexProof(keccak256(p5.address));
    const signature5 = await p6.signMessage(message);
    expect(
      await nfToken
        .connect(p5)
        ["mint(address,address,uint8,uint8,bytes,bytes32[])"](
          p5.address,
          p6.address,
          0,
          1,
          signature5,
          proof5,
          {
            value: ethers.utils.parseEther("0.1")
          }
        )
    ).to.emit(nfToken, "Transfer");

    expect(await nfToken.balanceOf(p5.address)).to.equal(1);
    expect(await nfToken.balanceOf(p6.address)).to.equal(1);

    const hashburn = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(["string"], [burnnonce])
    );

    const messageburn = ethers.utils.arrayify(hashburn);
    const signatureburn6 = await p6.signMessage(messageburn);

    expect(
      await nfToken
        .connect(p5)
        ["burn(address,bytes,bytes32[])"](p6.address, signatureburn6, proof5, {
          value: ethers.utils.parseEther("0.1")
        })
    ).to.emit(nfToken, "Burned");
    expect(await nfToken.balanceOf(p5.address)).to.equal(0);
    expect(await nfToken.balanceOf(p6.address)).to.equal(0);
  });

  // it("throws when trying to get count of NFTs owned by 0x0 address", async function() {
  //   await expect(nfToken.balanceOf(zeroAddress)).to.be.revertedWith("003001");
  // });

  // it("throws when trying to mint nft second time for A", async function() {
  //   await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   await expect(nfToken.connect(owner).mint(bob.address, sara.address, 0, 1)).to.be.revertedWith(
  //     "address already has a partner"
  //   );
  // });

  // it("throws when trying to mint nft second time for B", async function() {
  //   await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   await expect(nfToken.connect(owner).mint(sara.address, jane.address, 0, 1)).to.be.revertedWith(
  //     "address already has a partner"
  //   );
  // });

  // it("throws when trying to mint NFT to 0x0 address", async function() {
  //   await expect(nfToken.connect(owner).mint(zeroAddress, jane.address, 0, 1)).to.be.revertedWith(
  //     "003001"
  //   );
  // });

  // it("finds the correct owner of NFToken id", async function() {
  //   const trans = await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   const result = await trans.wait();
  //   const tokenIDA = result.events[2].args[1];
  //   const tokenIDB = result.events[2].args[2];

  //   expect(await nfToken.ownerOf(tokenIDA)).to.equal(bob.address);
  //   expect(await nfToken.ownerOf(tokenIDB)).to.equal(jane.address);
  // });

  // it("check pair", async function() {
  //   const trans = await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   const result = await trans.wait();

  //   expect(await nfToken.check(bob.address, jane.address)).to.equal(true);
  // });

  // it("check pair", async function() {
  //   const trans = await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   const result = await trans.wait();

  //   const a = await nfToken.getPairInfo(bob.address);
  // });

  // it("throws when trying to find owner od non-existing NFT id", async function() {
  //   await expect(nfToken.ownerOf(id1)).to.be.revertedWith("003002");
  // });

  // it("throws when transfers NFT from owner", async function() {
  //   const trans = await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   const result = await trans.wait();
  //   const tokenIDA = result.events[2].args[1];
  //   const tokenIDB = result.events[2].args[2];
  //   await nfToken.connect(bob).approve(sara.address, tokenIDA);
  //   await expect(
  //     nfToken.connect(sara).transferFrom(bob.address, sara.address, tokenIDA)
  //   ).to.revertedWith("canot transfer");
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(1);
  //   expect(await nfToken.balanceOf(sara.address)).to.equal(0);
  //   expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  // });

  // it("correctly burns two NFTs for A and B", async function() {
  //   const trans = await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   const result = await trans.wait();
  //   const tokenIDA = result.events[2].args[1];
  //   const tokenIDB = result.events[2].args[2];
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(1);
  //   expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  //   await nfToken.connect(owner).burn(jane.address, bob.address);
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(0);
  //   expect(await nfToken.balanceOf(jane.address)).to.equal(0);
  //   await expect(nfToken.ownerOf(tokenIDA)).to.be.revertedWith("003002");

  //   await expect(nfToken.getPairInfo(bob.address)).to.be.revertedWith("not valid pair");
  //   await expect(nfToken.getPairInfo(jane.address)).to.be.revertedWith("not valid pair");
  // });

  // it("correctly burns two NFTs for A and B and mint again", async function() {
  //   const trans = await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   const result = await trans.wait();
  //   const tokenIDA = result.events[2].args[1];
  //   const tokenIDB = result.events[2].args[2];

  //   const trans2 = await nfToken.connect(owner).mint(sara.address, owner.address, 0, 1);
  //   const result2 = await trans2.wait();
  //   const tokenIDC = result2.events[2].args[1];
  //   const tokenIDD = result2.events[2].args[2];
  //   expect(await nfToken.balanceOf(sara.address)).to.equal(1);
  //   expect(await nfToken.balanceOf(owner.address)).to.equal(1);
  //   expect(await nfToken.totalSupply()).to.equal(4);

  //   expect(await nfToken.balanceOf(bob.address)).to.equal(1);
  //   expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  //   await nfToken.connect(owner).burn(bob.address, jane.address);
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(0);
  //   expect(await nfToken.balanceOf(jane.address)).to.equal(0);
  //   await expect(nfToken.ownerOf(tokenIDA)).to.be.revertedWith("003002");
  //   await expect(nfToken.ownerOf(tokenIDB)).to.be.revertedWith("003002");
  //   await expect(nfToken.getPairInfo(bob.address)).to.be.revertedWith("not valid pair");
  //   await expect(nfToken.getPairInfo(jane.address)).to.be.revertedWith("not valid pair");

  //   const trans3 = await nfToken.connect(owner).mint(bob.address, jane.address, 0, 1);
  //   const result3 = await trans3.wait();
  //   const tokenIDAA = result3.events[2].args[1];
  //   const tokenIDBB = result3.events[2].args[2];
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(1);
  //   expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  //   expect((await nfToken.getPairInfo(bob.address))[0].partner).to.equal(jane.address);
  //   expect((await nfToken.getPairInfo(jane.address))[0].partner).to.equal(bob.address);
  //   expect(await nfToken.totalSupply()).to.equal(6);
  // });

  // it("throws when trying to burn non existent NFT", async function() {
  //   await expect(nfToken.connect(owner).burn(bob.address, jane.address)).to.be.revertedWith(
  //     "not valid pair"
  //   );
  // });

  // it.only('safeTransfer does not call onERC721Received to constructing contract', async function() {
  //   const sendsToSelfOnConstructContract = await ethers.getContractFactory('SendsToSelfOnConstruct');
  //   const sendsToSelfOnConstruct = await sendsToSelfOnConstructContract.deploy();
  //   expect(await sendsToSelfOnConstruct.deployed().deployTransaction).to.emit(sendsToSelfOnConstructContract, 'Transfer');

  //   console.log('here');
  //   // console.log(log);
  //   // console.log(sendsToSelfOnConstruct); No Receive event, 2x Transfer
  // });
});
