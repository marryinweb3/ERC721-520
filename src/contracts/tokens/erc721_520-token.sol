// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../tokens/erc721_520.sol";
import "../tokens/nf-token-enumerable.sol";

contract ERC721_520Token is NFToken, ERC721_520 {
    string constant HAS_PAIR = "address already has a partner";
    string constant NO_VALID_PAIR = "not valid pair";

    mapping(address => AddressInfo) internal addressPools;

    constructor() {}

    event Minted(address minter, uint256 tokenIdA, uint256 tokenIdB);
    event Burned(address minter);
    /**
     * @dev A descriptive name for a collection of NFTs.
     */
    string internal nftName;

    /**
     * @dev An abbreviated name for NFTokens.
     */
    string internal nftSymbol;

    /**
     * only increase no decrease
     */
    uint256 internal _totalSupply = 0;
    uint256 internal _totalIndex = 0;

    /**
     * @dev Returns a descriptive name for a collection of NFTokens.
     * @return _name Representing name.
     */
    function name() external view returns (string memory _name) {
        _name = nftName;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Returns an abbreviated name for NFTokens.
     * @return _symbol Representing symbol.
     */
    function symbol() external view returns (string memory _symbol) {
        _symbol = nftSymbol;
    }

    /**
     * Only authorized contracts can be called, so this contract cannot be mint directly by users, but authorized contracts can be called by users
     */
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
        uint256 _tokenIdA = _totalIndex + 1;
        super._mint(_addressA, _tokenIdA);
        uint256 _tokenIdB = _totalIndex + 2;
        super._mint(_addressB, _tokenIdB);
        _totalSupply = _totalSupply + 2;
        _totalIndex = _totalIndex + 2;

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
        AddressInfo memory addressInfoA = addressPools[_addressA];
        require(addressInfoA.partner == _addressB, NO_VALID_PAIR);
        AddressInfo memory addressInfoB = addressPools[_addressB];
        require(addressInfoB.partner == _addressA, NO_VALID_PAIR);

        super._burn(addressInfoA.tokenId);
        super._burn(addressInfoB.tokenId);

        delete addressPools[_addressA];
        delete addressPools[_addressB];

        _totalSupply = _totalSupply - 2;

        emit Burned(msg.sender);
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
        returns (string memory)
    {
        return "";
    }

    function _transfer(address _to, uint256 _tokenId) internal override {
        revert("canot transfer");
    }
}
