![two-logo](https://user-images.githubusercontent.com/897401/172005550-bead2997-6d74-4f5a-a75b-f2c91368dafc.png)

<p align="center">
  <a href="https://Marry3.love"><img src="https://img.shields.io/badge/https%3A%2F%2FMarry3.love-F41870?&labelColor=1D1D1D&logo=googlechrome&style=flat-square" /></a>
  <a href="https://github.com/marryinweb3/ERC721-520"><img src="https://img.shields.io/badge/https%3A%2F%2FERC520.com-F41870?&labelColor=1D1D1D&logo=googlechrome&style=flat-square" /></a>
</p> 
<p align="center">
  <a href="https://twitter.com/marryinweb3"><img src="https://img.shields.io/badge/%40marryinweb3-F41870?&labelColor=1D1D1D&logo=twitter&style=flat-square" /></a>
</p>

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

<a href="https://github.com/marryinweb3/ERC721-520"><img src="https://user-images.githubusercontent.com/897401/172005583-4469d4c0-946f-4977-abd6-386aea22f5ef.png" height="80" /></a>

#### ERC721-520 Token — A SBTs Implementation

Mainnet Contract (Marry3 Certificate)：https://etherscan.io/token/0x70c82f15103f972ab058eca784c45dcdcf53b5c2

> On May 20, 2022, this ERC721-520 core contract will be deployed to the Ethereum chain, and the world's first pair of Marry3 Certificates will be minted for my lover

> This day is our 7th wedding anniversary, the 8th anniversary of our relationship, and the first day of our marriage in the Web3 world. Wish all future "addresses" receive blessings from contracts here!

> The naming of ERC721-520 is derived from this, it's a ERC721 extension and SBTs special implement.

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

This is a specification based on the ERC721 standard that defines a necessary intimacy in the web3 world: marriage. Its valid certificate is the token in this contract. You or other products can query the pairing status and past records of any address through the official contract, official website, etc.

ERC721-520 Token is an implementation of NFT-like Soulbound Token [Vitalik's Blog Post about Soulbound](https://vitalik.ca/general/2022/01/26/soulbound.html)

- implement from erc721, most NFT usage scenarios are seamlessly compatible
- non-transferable and non-sellable, one person can only have one valid Token at the same time.
- mint paired soulbound token through multi-signature flow, Mint will issue 2 Soulbound Tokens at one time.
- can be destroyed through multi-signature flow, and new Soulbound Token can be minted with other addresses after burn.

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

### Marry3 Certificate

Marry3 (Marry in Web3) Certificate is just a basic and core contract implemented through the ERC721-520 protocol.

Around it, Marry3 DAPP will implement a series of application contracts, including but not limited to:

- Register the contract. Verify user identity and realize multi-signature common registration, registration record, payment, rebate and other capabilities.
- Multi-signature contracts. Through the binding relationship of ERC721-520 Token, the multi-signature agreement is transformed to realize the compatibility of multi-signature wallets.
- Deposit contracts. Through ERC20 Token and multi-signature contracts, applications such as deposit and withdrawal can be realized.
- Shared contracts. The binding relationship can be written and used by other third parties to open up the identity ecology.

Overall structure:

<img src="https://user-images.githubusercontent.com/897401/171990720-5d81e809-9d13-4d66-85b6-e847e9a66c9a.png"  />

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

### Standard

this token is base on ERC721 standard, and add some new feature：

new features:

- Two addresses: The two addresses must be together to mint the token
- Two certificates: two tokens will be mint at a time: two certificates
- No bigamy: An address can only be mint with one address at the same time. After mint, it cannot be mint again. You need to call divorce (divorce) to destroy the two tokens mint from the two.
- No derailment: ERC721-520 tokens cannot be transferred and can only be held by the minter
- Divorce: ERC721-520 tokens can be negotiated and destroyed. The process is similar to mint. After destruction, new tokens can be minted with other addresses.
- No gender restrictions: anyone of any gender can get married

new functions:

- mint: Mint two tokens at the same time through two addresses and assign them to two addresses respectively
- Through any token, you can query the specific information of the two tokens
- The user's marriage and divorce records are recorded in the contract, which can be queried
- Check: Pass in two addresses to check whether they are in the registered state
- Look up the marriage records of an address

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

### Test Case

- ✓ correctly checks all the supported interfaces
- ✓ correctly mints two NFT for A and B
- ✓ throws when trying to get count of NFTs owned by 0x0 address
- ✓ throws when trying to mint nft second time for A
- ✓ throws when trying to mint nft second time for B
- ✓ throws when trying to mint NFT to 0x0 address
- ✓ finds the correct owner of NFToken id
- ✓ check pair
- ✓ check pair
- ✓ throws when trying to find owner od non-existing NFT id
- ✓ throws when transfers NFT from owner
- ✓ correctly burns two NFTs for A and B
- ✓ correctly burns two NFTs for A and B and mint again
- ✓ throws when trying to burn non existent NFT

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

### Requirements

- NodeJS 12+ is supported
- Windows, Linux or macOS

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

### Installation

#### npm

_This is the recommended installation method if you want to use this package in your JavaScript project._

This project is [released as an npm module](https://www.npmjs.com/package/ERC721-520). You must install it using the `npm` command:

```
$ npm install ERC721-520
```

#### Source

_This is the recommended installation method if you want to improve the `nibbstack/ERC721-520` project._

Clone this repository and install the required `npm` dependencies:

```
$ git clone git@github.com:marryinweb3/ERC721-520.git
$ cd ERC721-520
$ npm install
```

Make sure that everything has been set up correctly:

```
$ npm run test
```

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

## Licence

See [LICENSE](./LICENSE) for details.
