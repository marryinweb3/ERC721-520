// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../tokens/erc520.sol";
import "../tokens/nf-token-enumerable.sol";

contract ERC520Token is NFTokenEnumerable, ERC520 {
    string constant HAS_PAIR = "address already has a partner";
    string constant NO_VALID_PAIR = "not valid pair";

    mapping(address => AddressInfo) internal addressPools;

    constructor() {}

    event Minted(address minter, uint256 tokenIdA, uint256 tokenIdB);
    /**
     * @dev A descriptive name for a collection of NFTs.
     */
    string internal nftName;

    /**
     * @dev An abbreviated name for NFTokens.
     */
    string internal nftSymbol;

    /**
     * @dev Returns a descriptive name for a collection of NFTokens.
     * @return _name Representing name.
     */
    function name() external view returns (string memory _name) {
        _name = nftName;
    }

    /**
     * @dev Returns an abbreviated name for NFTokens.
     * @return _symbol Representing symbol.
     */
    function symbol() external view returns (string memory _symbol) {
        _symbol = nftSymbol;
    }

    // 只有授权的合约可以调用，所以此合约无法由用户直接 mint
    function _mint(
        address _addressA,
        address _addressB,
        Sex _sexA,
        Sex _sexB
    ) internal virtual {
        // check address not in others partner
        AddressInfo memory addressInfoA = addressPools[_addressA];
        require(addressInfoA.partner == address(0), HAS_PAIR);
        AddressInfo memory addressInfoB = addressPools[_addressB];
        require(addressInfoB.partner == address(0), HAS_PAIR);

        //@todo mint token
        uint256 _tokenIdA = tokens.length + 1;
        super._mint(_addressA, _tokenIdA);
        uint256 _tokenIdB = tokens.length + 1;
        super._mint(_addressB, _tokenIdB);

        addressInfoA.tokenId = _tokenIdA;
        addressInfoB.tokenId = _tokenIdB;

        addressInfoA.sex = _sexA;
        addressInfoB.sex = _sexB;

        addressInfoA.partner = _addressB;
        addressInfoB.partner = _addressA;

        addressInfoA.time = block.timestamp;
        addressInfoB.time = block.timestamp;

        addressPools[_addressA] = addressInfoA;
        addressPools[_addressB] = addressInfoB;

        emit Minted(msg.sender, _tokenIdA, _tokenIdB);
    }

    function _burn(address _addressA, address _addressB) internal virtual {
        require(_addressA != address(0), ZERO_ADDRESS);
        require(_addressB != address(0), ZERO_ADDRESS);

        AddressInfo memory addressInfoA = addressPools[_addressA];
        require(addressInfoA.partner == _addressB, NO_VALID_PAIR);
        AddressInfo memory addressInfoB = addressPools[_addressB];
        require(addressInfoB.partner == _addressA, NO_VALID_PAIR);

        super._burn(addressInfoA.tokenId);
        super._burn(addressInfoB.tokenId);

        addressInfoA.partner = address(0);
        addressInfoB.partner = address(0);

        addressPools[_addressA] = addressInfoA;
        addressPools[_addressB] = addressInfoB;
    }

    /**
     * 检查两个地址是否合法夫妻
     */
    function check(address _a, address _b)
        external
        view
        override
        returns (bool)
    {
        AddressInfo memory addressInfoA = addressPools[_a];
        require(addressInfoA.partner != address(0), NO_VALID_PAIR);
        AddressInfo memory addressInfoB = addressPools[_b];
        require(addressInfoB.partner != address(0), NO_VALID_PAIR);

        return addressInfoA.partner == _b && addressInfoB.partner == _a;
    }

    /**
     * get address info and partner info
     */
    function getPairInfo(address _a)
        public
        view
        override
        returns (AddressInfo memory, AddressInfo memory)
    {
        AddressInfo memory addressInfoA = addressPools[_a];
        require(addressInfoA.partner != address(0), NO_VALID_PAIR);
        AddressInfo memory addressInfoB = addressPools[addressInfoA.partner];
        require(addressInfoB.partner != address(0), NO_VALID_PAIR);
        return (addressInfoA, addressInfoB);
    }

    /**
     * please implement this function
     */
    function tokenURI(uint256 _tokenId)
        external
        view
        virtual
        override
        validNFToken(_tokenId)
        returns (string memory)
    {
        return "";
    }

    function _transfer(address _to, uint256 _tokenId) internal override {
        revert("canot transfer");
    }
}
