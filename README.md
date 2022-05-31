<a href="https://github.com/marryinweb3/ERC520"><img src="https://www.marry3.love/ERC520-noborder.png" height="80" /></a>

### ERC-520 Token — Reference Implementation

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

在 2022 年 5 月 20 日这天，此 ERC520 核心合约将部署至 Ethereum 公链，并铸造 Web3 世界第一对 Marry3 Certificate，以此献给我的爱人

这一天是我们结婚 7 周年，恋爱 8 周年纪念日，也是我们在 Web3 世界结婚的第一天，愿未来所有“地址”和它们背后的你们都能在这里得到来自合约的祝福！

主网合约地址：https://etherscan.io/token/0x70c82f15103f972ab058eca784c45dcdcf53b5c2

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

这是一个基于 ERC721 标准的规范，定义了在 web3 世界中一个必要的亲密关系：婚姻。它的有效证件即本合约中的 token，您或者其他产品可通过官方合约、官方网站等查询任意地址的配对状态及过往记录。

Dapp:

<a href="https://marry3.love"><img src="https://www.marry3.love/logo-slogon.png" height="80" /></a>

ERC520 Token 是 NFT-like Soulbound Token Standard（灵魂绑定凭证） 的一种实现 [Vitalik's Blog Post about Soulbound](https://vitalik.ca/general/2022/01/26/soulbound.html)

- ERC520 Token 不可转让，不可售卖，一个人同时只能有一个有效 Token
- ERC520 Token 由二者通过多签协商后，一次性 Mint 出 2 个 Token
- ERC520 Token 可以通过多签协商销毁，销毁后可以与其他地址铸造新的 Token

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

### Marry3 Certificate

Marry3(Marry in Web3) Certificate 只是通过 ERC520 协议实现的一个最基本的、核心的合约。

围绕它，Marry3 DAPP 将实现一系列应用合约，包括并不限于：

- 登记合约。校验用户身份并实现多签的共同登记，登记记录，付费，返利等能力。
- 多签合约。通过 ERC520 Token 的绑定关系，改造多签协议，实现多签钱包的兼容。
- 存款合约。通过 ERC20 Token 和 多签合约，实现存款和取款等应用。
- 共享合约。可由其他第三方写入和使用绑定关系，打通身份生态。

<img src="https://marry3.love/Marry3eco.png"  />

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

### Standard

ERC520 完全基于 ERC721 扩展，并添加以下新的 feature：

this token is base on ERC721 standard, and add some new feature：

new features:

- 俩人：必须两个地址一起才可以 mint 出来 token
- 俩证：一次会 mint 两个 token 出来：两证
- 不可重婚：一个地址只能同时与一个地址 mint，mint 之后不能再 mint ，需要调用 divorce （离婚），销毁二者 mint 出来的两个 token
- 不能出轨：ERC520 token 不可 transfer，只能由 minter 持有
- 离婚：ERC520 token 可以协商销毁，流程与 mint 类似，销毁后可以重新与其他地址铸造新的 token
- 不限制性别：任何性别的人都可以结婚

new functions:

- mint: 通过两个地址同时 mint 两个 token，分别分配给两个地址
- 通过任何一个 token 都可以查询到两个 token 的具体信息
- 用户的结婚和离婚记录均记录在合约中，可查询
- 校验：传入两个地址校验是否在登记状态
- 查询某个地址的婚姻记录

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

This project is [released as an npm module](https://www.npmjs.com/package/erc520). You must install it using the `npm` command:

```
$ npm install erc520
```

#### Source

_This is the recommended installation method if you want to improve the `nibbstack/erc520` project._

Clone this repository and install the required `npm` dependencies:

```
$ git clone git@github.com:marryinweb3/erc520.git
$ cd erc520
$ npm install
```

Make sure that everything has been set up correctly:

```
$ npm run test
```

![line](https://user-images.githubusercontent.com/897401/171048003-7b7adb40-9f72-4bfc-84de-e948892bf7f9.png)

## Licence

See [LICENSE](./LICENSE) for details.
