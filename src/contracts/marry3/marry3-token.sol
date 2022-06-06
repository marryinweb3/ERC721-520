// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../tokens/erc721_520-token.sol";
import "../ownership/ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Marry3Token is ERC721_520Token, Ownable {
    string baseURI = "";

    // Resolver public defaultResolver;

    constructor() {
        nftName = "Marry3";
        nftSymbol = "Marry3 Certificate";
        baseURI = "https://marry3.love/api/meta";
    }

    // function mint(
    //     address _addressA,
    //     address _addressB,
    //     Sex _sexA,
    //     Sex _sexB
    // ) public onlyOwner {
    //     super._mint(_addressA, _addressB, _sexA, _sexB);
    // }

    // function burn(address _addressA, address _addressB) public onlyOwner {
    //     super._burn(_addressA, _addressB);
    // }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721_520Token)
        returns (string memory)
    {
        string memory tokenIdString = _uint256tostring(tokenId);

        return string(abi.encodePacked(baseURI, "/", tokenIdString, ".json"));
    }

    function _uint256tostring(uint256 _value)
        private
        pure
        returns (string memory)
    {
        return Strings.toString(_value);
    }

    function setBaseURI(string calldata _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }
}
