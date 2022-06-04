![two-logo](https://user-images.githubusercontent.com/897401/171177043-083c392f-f7a1-4155-9a34-4a866604ca69.png)

<p align="center">
  <a href="https://Marry3.love"><img src="https://img.shields.io/badge/https%3A%2F%2FMarry3.love-F41870?&labelColor=1D1D1D&logo=googlechrome&style=flat-square" /></a>
  <a href="https://github.com/marryinweb3/ERC721-520"><img src="https://img.shields.io/badge/https%3A%2F%2FERC520.com-F41870?&labelColor=1D1D1D&logo=googlechrome&style=flat-square" /></a>
</p> 
<p align="center">
  <a href="https://twitter.com/marryinweb3"><img src="https://img.shields.io/badge/%40marryinweb3-F41870?&labelColor=1D1D1D&logo=twitter&style=flat-square" /></a>
</p>

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

<a href="https://github.com/marryinweb3/ERC721-520"><img src="https://user-images.githubusercontent.com/897401/171176759-123d5777-0f36-4680-a2ef-25f07ff44618.png" height="80" /></a>

#### ERC721-520 Token — Reference Implementation

Mainnet Contract (Marry3 Certificate)：https://etherscan.io/token/0x70c82f15103f972ab058eca784c45dcdcf53b5c2

> 在 2022 年 5 月 20 日这天，此 ERC721-520 核心合约将部署至 Ethereum 公链，并铸造 Web3 世界第一对 Marry3 Certificate，以此献给我的爱人

> 这一天是我们结婚 7 周年，恋爱 8 周年纪念日，也是我们在 Web3 世界结婚的第一天，愿未来所有“地址”和它们背后的你们都能在这里得到来自合约的祝福！

> ERC721-520 的命名既是源于此处

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

This is a specification based on the ERC721 standard that defines a necessary intimacy in the web3 world: marriage. Its valid certificate is the token in this contract. You or other products can query the pairing status and past records of any address through the official contract, official website, etc.

ERC721-520 Token is an implementation of NFT-like Soulbound Token Standard [Vitalik's Blog Post about Soulbound](https://vitalik.ca/general/2022/01/26/soulbound.html)

- implement from erc721, most NFT usage scenarios are seamlessly compatible
- non-transferable and non-sellable, one person can only have one valid Token at the same time.
- mint paired soulbound token through multi-signature flow, Mint will issue 2 Soulbound Tokens at one time.
- can be destroyed through multi-signature flow, and new Soulbound Token can be minted with other addresses after burn.

这是一个基于 ERC721 标准的规范，定义了在 web3 世界中一个必要的亲密关系：婚姻。它的有效证件即本合约中的 token，您或者其他产品可通过官方合约、官方网站等查询任意地址的配对状态及过往记录。

ERC721-520 Token 是 NFT-like Soulbound Token Standard（灵魂绑定凭证） 的一种实现 [Vitalik's Blog Post about Soulbound](https://vitalik.ca/general/2022/01/26/soulbound.html)

- ERC721-520 Token 不可转让，不可售卖，一个人同时只能有一个有效 Token
- ERC721-520 Token 由二者通过多签协商后，一次性 Mint 出 2 个 Token
- ERC721-520 Token 可以通过多签协商销毁，销毁后可以与其他地址铸造新的 Token
- ERC721-520 Token 是 ERC721 兼容的，大部分 NFT 使用场景都无缝支持

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

ERC721-520 完全基于 ERC721 扩展，并添加以下新的 feature：

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
- ✓ 俩证: correctly mints two NFT for A and B (47ms)
- ✓ throws when trying to get count of NFTs owned by 0x0 address
- ✓ 不可重婚: throws when trying to mint nft second time for A
- ✓ 不可重婚: throws when trying to mint nft second time for B
- ✓ throws when trying to mint NFT to 0x0 address
- ✓ finds the correct owner of NFToken id
- ✓ throws when trying to find owner od non-existing NFT id
- ✓ 不能出轨: throws when transfers NFT from owner
- ✓ 离婚: corre- ctly burns two NFTs for A and B (47ms)

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
