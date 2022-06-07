const { expect } = require("chai");

describe("erc520-token", function() {
  let nfToken, owner, bob, jane, sara;
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const id1 = 0;
  const id2 = 1;

  beforeEach(async () => {
    const nftContract = await ethers.getContractFactory("Marry3");
    nfToken = await nftContract.deploy();
    [owner, bob, jane, sara] = await ethers.getSigners();
    await nfToken.deployed();
  });

  it("correctly checks all the supported interfaces", async function() {
    expect(await nfToken.supportsInterface("0x80ac58cd")).to.equal(true);
    expect(await nfToken.supportsInterface("0x5b5e139f")).to.equal(false);
  });

  it("correctly mints two NFT for A and B", async function() {
    expect(await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1)).to.emit(
      nfToken,
      "Transfer"
    );
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  });

  it("throws when trying to get count of NFTs owned by 0x0 address", async function() {
    await expect(nfToken.balanceOf(zeroAddress)).to.be.revertedWith("003001");
  });

  it("throws when trying to mint nft second time for A", async function() {
    await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    await expect(
      nfToken.connect(owner).mintByOwner(bob.address, sara.address, 0, 1)
    ).to.be.revertedWith("address already has a partner");
  });

  it("throws when trying to mint nft second time for B", async function() {
    await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    await expect(
      nfToken.connect(owner).mintByOwner(sara.address, jane.address, 0, 3)
    ).to.be.revertedWith("address already has a partner");
  });

  it("throws when trying to mint NFT to 0x0 address", async function() {
    await expect(
      nfToken.connect(owner).mintByOwner(zeroAddress, jane.address, 0, 1)
    ).to.be.revertedWith("003001");
  });

  it("finds the correct owner of NFToken id", async function() {
    const trans = await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    const result = await trans.wait();
    const tokenIDA = result.events[2].args[1];
    const tokenIDB = result.events[2].args[2];

    expect(await nfToken.ownerOf(tokenIDA)).to.equal(bob.address);
    expect(await nfToken.ownerOf(tokenIDB)).to.equal(jane.address);
  });

  it("check pair", async function() {
    const trans = await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    const result = await trans.wait();

    expect(await nfToken.check(bob.address, jane.address)).to.equal(true);

    await nfToken.connect(owner).burnByOwner(bob.address, jane.address);
    await trans.wait();

    await expect(nfToken.check(bob.address, jane.address)).to.be.revertedWith("not valid pair");
  });

  it("check pair", async function() {
    const trans = await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    const result = await trans.wait();

    const a = await nfToken.getPairInfo(bob.address);
  });

  it("throws when trying to find owner od non-existing NFT id", async function() {
    await expect(nfToken.ownerOf(id1)).to.be.revertedWith("003002");
  });

  it("throws when transfers NFT from owner", async function() {
    const trans = await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    const result = await trans.wait();
    const tokenIDA = result.events[2].args[1];
    const tokenIDB = result.events[2].args[2];
    await nfToken.connect(bob).approve(sara.address, tokenIDA);
    await expect(
      nfToken.connect(sara).transferFrom(bob.address, sara.address, tokenIDA)
    ).to.revertedWith("canot transfer");
    await expect(
      nfToken
        .connect(sara)
        ["safeTransferFrom(address,address,uint256)"](bob.address, sara.address, tokenIDA)
    ).to.revertedWith("canot transfer");
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.balanceOf(sara.address)).to.equal(0);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  });

  it("correctly burns two NFTs for A and B", async function() {
    const trans = await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    const result = await trans.wait();
    const tokenIDA = result.events[2].args[1];
    const tokenIDB = result.events[2].args[2];
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
    await nfToken.connect(owner).burnByOwner(jane.address, bob.address);
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(jane.address)).to.equal(0);
    await expect(nfToken.ownerOf(tokenIDA)).to.be.revertedWith("003002");

    await expect(nfToken.getPairInfo(bob.address)).to.be.revertedWith("not valid pair");
    await expect(nfToken.getPairInfo(jane.address)).to.be.revertedWith("not valid pair");
  });

  it("correctly burns two NFTs for A and B and mint again", async function() {
    const trans = await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    const result = await trans.wait();
    const tokenIDA = result.events[2].args[1];
    const tokenIDB = result.events[2].args[2];

    const trans2 = await nfToken.connect(owner).mintByOwner(sara.address, owner.address, 0, 1);
    const result2 = await trans2.wait();
    const tokenIDC = result2.events[2].args[1];
    const tokenIDD = result2.events[2].args[2];

    expect(await nfToken.balanceOf(sara.address)).to.equal(1);
    expect(await nfToken.balanceOf(owner.address)).to.equal(1);
    expect(await nfToken.totalSupply()).to.equal(4);

    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
    await nfToken.connect(owner).burnByOwner(bob.address, jane.address);
    expect(await nfToken.totalSupply()).to.equal(2);
    expect(await nfToken.getMarryCount()).to.equal(2);
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(jane.address)).to.equal(0);
    await expect(nfToken.ownerOf(tokenIDA)).to.be.revertedWith("003002");
    await expect(nfToken.ownerOf(tokenIDB)).to.be.revertedWith("003002");
    await expect(nfToken.getPairInfo(bob.address)).to.be.revertedWith("not valid pair");
    await expect(nfToken.getPairInfo(jane.address)).to.be.revertedWith("not valid pair");

    const trans3 = await nfToken.connect(owner).mintByOwner(bob.address, jane.address, 0, 1);
    const result3 = await trans3.wait();
    const tokenIDAA = result3.events[2].args[1];
    const tokenIDBB = result3.events[2].args[2];
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
    expect((await nfToken.getPairInfo(bob.address))[0].partner).to.equal(jane.address);
    expect((await nfToken.getPairInfo(jane.address))[0].partner).to.equal(bob.address);
    expect(await nfToken.totalSupply()).to.equal(4);
    expect(await nfToken.getMarryCount()).to.equal(3);
  });

  it("throws when trying to burn non existent NFT", async function() {
    await expect(nfToken.connect(owner).burnByOwner(bob.address, jane.address)).to.be.revertedWith(
      "not valid pair"
    );
  });

  // it.only('safeTransfer does not call onERC721Received to constructing contract', async function() {
  //   const sendsToSelfOnConstructContract = await ethers.getContractFactory('SendsToSelfOnConstruct');
  //   const sendsToSelfOnConstruct = await sendsToSelfOnConstructContract.deploy();
  //   expect(await sendsToSelfOnConstruct.deployed().deployTransaction).to.emit(sendsToSelfOnConstructContract, 'Transfer');

  //   console.log('here');
  //   // console.log(log);
  //   // console.log(sendsToSelfOnConstruct); No Receive event, 2x Transfer
  // });
});
