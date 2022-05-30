const { expect } = require("chai");

describe("erc520-token", function() {
  let nfToken, owner, bob, jane, sara;
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const id1 = 0;
  const id2 = 1;

  beforeEach(async () => {
    const nftContract = await ethers.getContractFactory("Marry3Token");
    nfToken = await nftContract.deploy();
    [owner, bob, jane, sara] = await ethers.getSigners();
    await nfToken.deployed();
  });

  it("correctly checks all the supported interfaces", async function() {
    expect(await nfToken.supportsInterface("0x80ac58cd")).to.equal(true);
    expect(await nfToken.supportsInterface("0x5b5e139f")).to.equal(false);
  });

  it("correctly mints two NFT for A and B", async function() {
    expect(
      await nfToken.connect(owner).mint(
        bob.address,
        jane.address,
        {
          sex: 0,
          ens: "yootou.eth"
        },
        {
          sex: 1,
          ens: "eleven3.eth"
        }
      )
    ).to.emit(nfToken, "Transfer");
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  });

  it("throws when trying to get count of NFTs owned by 0x0 address", async function() {
    await expect(nfToken.balanceOf(zeroAddress)).to.be.revertedWith("003001");
  });

  it("throws when trying to mint nft second time for A", async function() {
    await nfToken.connect(owner).mint(
      bob.address,
      jane.address,
      {
        sex: 0,
        ens: "yootou.eth"
      },
      {
        sex: 1,
        ens: "shiyi.eth"
      }
    );
    await expect(
      nfToken.connect(owner).mint(
        bob.address,
        sara.address,
        {
          sex: 0,
          ens: "yootou.eth"
        },
        {
          sex: 1,
          ens: "shiyi.eth"
        }
      )
    ).to.be.revertedWith("address already has a partner");
  });

  it("throws when trying to mint nft second time for B", async function() {
    await nfToken.connect(owner).mint(
      bob.address,
      jane.address,
      {
        sex: 0,
        ens: "yootou.eth"
      },
      {
        sex: 1,
        ens: "shiyi.eth"
      }
    );
    await expect(
      nfToken.connect(owner).mint(
        sara.address,
        jane.address,
        {
          sex: 0,
          ens: "yootou.eth"
        },
        {
          sex: 1,
          ens: "shiyi.eth"
        }
      )
    ).to.be.revertedWith("address already has a partner");
  });

  it("throws when trying to mint NFT to 0x0 address", async function() {
    await expect(
      nfToken.connect(owner).mint(
        zeroAddress,
        jane.address,
        {
          sex: 0,
          ens: "yootou.eth"
        },
        {
          sex: 1,
          ens: "shiyi.eth"
        }
      )
    ).to.be.revertedWith("003001");
  });

  it("finds the correct owner of NFToken id", async function() {
    const trans = await nfToken.connect(owner).mint(
      bob.address,
      jane.address,
      {
        sex: 0,
        ens: "yootou.eth"
      },
      {
        sex: 1,
        ens: "shiyi.eth"
      }
    );
    const result = await trans.wait();
    const tokenIDA = result.events[2].args[1];
    const tokenIDB = result.events[2].args[2];

    expect(await nfToken.ownerOf(tokenIDA)).to.equal(bob.address);
    expect(await nfToken.ownerOf(tokenIDB)).to.equal(jane.address);
  });

  it("check pair", async function() {
    const trans = await nfToken.connect(owner).mint(
      bob.address,
      jane.address,
      {
        sex: 0,
        ens: "yootou.eth"
      },
      {
        sex: 1,
        ens: "shiyi.eth"
      }
    );
    const result = await trans.wait();

    expect(await nfToken.check(bob.address, jane.address)).to.equal(true);
  });

  it("check pair", async function() {
    const trans = await nfToken.connect(owner).mint(
      bob.address,
      jane.address,
      {
        sex: 0,
        ens: "yootou.eth"
      },
      {
        sex: 1,
        ens: "shiyi.eth"
      }
    );
    const result = await trans.wait();

    const a = await nfToken.getPairInfo(bob.address);
  });

  it("throws when trying to find owner od non-existing NFT id", async function() {
    await expect(nfToken.ownerOf(id1)).to.be.revertedWith("003002");
  });

  // it("correctly approves account", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   expect(await nfToken.connect(bob).approve(sara.address, id1)).to.emit(nfToken, "Approval");
  //   expect(await nfToken.getApproved(id1)).to.equal(sara.address);
  // });

  // it("correctly cancels approval", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await nfToken.connect(bob).approve(sara.address, id1);
  //   await nfToken.connect(bob).approve(zeroAddress, id1);
  //   expect(await nfToken.getApproved(id1)).to.equal(zeroAddress);
  // });

  // it("throws when trying to get approval of non-existing NFT id", async function() {
  //   await expect(nfToken.getApproved(id1)).to.be.revertedWith("003002");
  // });

  // it("throws when trying to approve NFT ID from a third party", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await expect(nfToken.connect(sara).approve(sara.address, id1)).to.be.revertedWith("003003");
  // });

  // it("correctly sets an operator", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   expect(await nfToken.connect(bob).setApprovalForAll(sara.address, true)).to.emit(
  //     nfToken,
  //     "ApprovalForAll"
  //   );
  //   expect(await nfToken.isApprovedForAll(bob.address, sara.address)).to.equal(true);
  // });

  // it("correctly sets then cancels an operator", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await nfToken.connect(bob).setApprovalForAll(sara.address, true);
  //   await nfToken.connect(bob).setApprovalForAll(sara.address, false);
  //   expect(await nfToken.isApprovedForAll(bob.address, sara.address)).to.equal(false);
  // });

  it("throws when transfers NFT from owner", async function() {
    const trans = await nfToken.connect(owner).mint(
      bob.address,
      jane.address,
      {
        sex: 0,
        ens: "yootou.eth"
      },
      {
        sex: 1,
        ens: "shiyi.eth"
      }
    );
    const result = await trans.wait();
    const tokenIDA = result.events[2].args[1];
    const tokenIDB = result.events[2].args[2];
    await nfToken.connect(bob).approve(sara.address, tokenIDA);
    await expect(
      nfToken.connect(sara).transferFrom(bob.address, sara.address, tokenIDA)
    ).to.revertedWith("canot transfer");
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.balanceOf(sara.address)).to.equal(0);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  });

  // it("correctly transfers NFT from approved address", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await nfToken.connect(bob).approve(sara.address, id1);
  //   await nfToken.connect(sara).transferFrom(bob.address, jane.address, id1);
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(0);
  //   expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  //   expect(await nfToken.ownerOf(id1)).to.equal(jane.address);
  // });

  // it("correctly transfers NFT as operator", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await nfToken.connect(bob).setApprovalForAll(sara.address, true);
  //   await nfToken.connect(sara).transferFrom(bob.address, jane.address, id1);
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(0);
  //   expect(await nfToken.balanceOf(jane.address)).to.equal(1);
  //   expect(await nfToken.ownerOf(id1)).to.equal(jane.address);
  // });

  // it("throws when trying to transfer NFT as an address that is not owner, approved or operator", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await expect(
  //     nfToken.connect(sara).transferFrom(bob.address, jane.address, id1)
  //   ).to.be.revertedWith("003004");
  // });

  // it("throws when trying to transfer NFT to a zero address", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await expect(
  //     nfToken.connect(bob).transferFrom(bob.address, zeroAddress, id1)
  //   ).to.be.revertedWith("003001");
  // });

  // it("throws when trying to transfer an invalid NFT", async function() {
  //   await expect(
  //     nfToken.connect(bob).transferFrom(bob.address, sara.address, id1)
  //   ).to.be.revertedWith("003004");
  // });

  // it("throws when trying to transfer an invalid NFT", async function() {
  //   await expect(
  //     nfToken.connect(bob).transferFrom(bob.address, sara.address, id1)
  //   ).to.be.revertedWith("003004");
  // });

  // it("correctly safe transfers NFT from owner", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   expect(
  //     await nfToken
  //       .connect(bob)
  //       ["safeTransferFrom(address,address,uint256)"](bob.address, sara.address, id1)
  //   ).to.emit(nfToken, "Transfer");
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(0);
  //   expect(await nfToken.balanceOf(sara.address)).to.equal(1);
  //   expect(await nfToken.ownerOf(id1)).to.equal(sara.address);
  // });

  // it("throws when trying to safe transfers NFT from owner to a smart contract", async function() {
  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await expect(
  //     nfToken
  //       .connect(bob)
  //       ["safeTransferFrom(address,address,uint256)"](bob.address, nfToken.address, id1)
  //   ).to.be.revertedWith(
  //     "Transaction reverted: function selector was not recognized and there's no fallback function"
  //   );
  // });

  // it("correctly safe transfers NFT from owner to smart contract that can receive NFTs", async function() {
  //   const tokenReceiverContract = await ethers.getContractFactory("NFTokenReceiverTestMock");
  //   const tokenReceiver = await tokenReceiverContract.deploy();
  //   await tokenReceiver.deployed();

  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   await nfToken
  //     .connect(bob)
  //     ["safeTransferFrom(address,address,uint256)"](bob.address, tokenReceiver.address, id1);
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(0);
  //   expect(await nfToken.balanceOf(tokenReceiver.address)).to.equal(1);
  //   expect(await nfToken.ownerOf(id1)).to.equal(tokenReceiver.address);
  // });

  // it("correctly safe transfers NFT from owner to smart contract that can receive NFTs with data", async function() {
  //   const tokenReceiverContract = await ethers.getContractFactory("NFTokenReceiverTestMock");
  //   const tokenReceiver = await tokenReceiverContract.deploy();
  //   await tokenReceiver.deployed();

  //   await nfToken.connect(owner).mint(bob.address, id1);
  //   expect(
  //     await nfToken
  //       .connect(bob)
  //       ["safeTransferFrom(address,address,uint256,bytes)"](
  //         bob.address,
  //         tokenReceiver.address,
  //         id1,
  //         "0x01"
  //       )
  //   ).to.emit(nfToken, "Transfer");
  //   expect(await nfToken.balanceOf(bob.address)).to.equal(0);
  //   expect(await nfToken.balanceOf(tokenReceiver.address)).to.equal(1);
  //   expect(await nfToken.ownerOf(id1)).to.equal(tokenReceiver.address);
  // });

  it("correctly burns two NFTs for A and B", async function() {
    const trans = await nfToken.connect(owner).mint(
      bob.address,
      jane.address,
      {
        sex: 0,
        ens: "yootou.eth"
      },
      {
        sex: 1,
        ens: "shiyi.eth"
      }
    );
    const result = await trans.wait();
    const tokenIDA = result.events[2].args[1];
    const tokenIDB = result.events[2].args[2];
    expect(await nfToken.balanceOf(bob.address)).to.equal(1);
    expect(await nfToken.balanceOf(jane.address)).to.equal(1);
    await nfToken.connect(owner).burn(bob.address, jane.address);
    expect(await nfToken.balanceOf(bob.address)).to.equal(0);
    expect(await nfToken.balanceOf(jane.address)).to.equal(0);
    await expect(nfToken.ownerOf(tokenIDA)).to.be.revertedWith("003002");
  });

  // it("throws when trying to burn non existent NFT", async function() {
  //   await expect(nfToken.connect(owner).burn(id1)).to.be.revertedWith("003002");
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
