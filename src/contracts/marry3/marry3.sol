// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./marry3-token.sol";
import "../ownership/ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Marry3 is Ownable, Marry3Token {
    using ECDSA for bytes32;
    string private nonce = "i will";
    string private burnNonce = "fine";
    string constant NO_ENOUGH_ETH = "no enough eth";
    string constant INVALID_SIGN = "Invalid signature";

    uint256 private constant priceStep = 0.005 * (10**18);
    uint256 private constant priceMin = 0.01 * (10**18);
    uint256 private priceMax = 0.05 * (10**18);

    bytes32 private merkleRoot;

    function isWhiteList(address _address, bytes32[] calldata _merkleProof)
        private
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encodePacked(_address));
        if (MerkleProof.verify(_merkleProof, merkleRoot, leaf)) {
            return true;
        }
        return false; // Or you can mint tokens here
    }

    function setMercleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function getPrice() external view returns (uint256) {
        return _getPrice();
    }

    function getPriceByProof(bytes32[] calldata _merkleProof)
        external
        view
        returns (uint256)
    {
        if (isWhiteList(tx.origin, _merkleProof)) {
            return 0;
        } else {
            return _getPrice();
        }
    }

    function getMarryCount() external view returns (uint256) {
        return _totalIndex / 2;
    }

    /**
     * A  all can mint token,but a can be trigger or accepter
     */
    function mint(
        address _addressA,
        address _addressB,
        ERC721_520Token.Sex _sexA,
        ERC721_520Token.Sex _sexB,
        bytes calldata _signatureB,
        bytes32[] calldata _merkleProof
    ) external payable {
        if (!isWhiteList(tx.origin, _merkleProof)) {
            require(_getPrice() <= msg.value, NO_ENOUGH_ETH);
        }

        require(_addressA != address(0), ZERO_ADDRESS);
        require(_addressB != address(0), ZERO_ADDRESS);
        require(_addressA == tx.origin, "addressA  must be the tx.origin");
        // check _signatureB
        require(_verify(_hash(nonce), _signatureB, _addressB), INVALID_SIGN);
        super._mint(_addressA, _addressB, _sexA, _sexB);
    }

    /**
     * admin can mint directly，for white list users
     */
    function mintByOwner(
        address _addressA,
        address _addressB,
        ERC721_520Token.Sex _sexA,
        ERC721_520Token.Sex _sexB
    ) external onlyOwner {
        super._mint(_addressA, _addressB, _sexA, _sexB);
    }

    /**
     * in future the owner will be dao contract, burn can be invoked by dao contract
     */
    function burnByOwner(address _addressA, address _addressB)
        external
        onlyOwner
    {
        super._burn(_addressA, _addressB);
    }

    /**
     * A 发起，B 接受, 销毁
     */
    function burn(
        address _addressB,
        bytes memory _signatureB,
        bytes32[] calldata _merkleProof
    ) external payable {
        if (!isWhiteList(tx.origin, _merkleProof)) {
            require(_getPrice() * 2 <= msg.value, NO_ENOUGH_ETH);
        }

        require(_addressB != address(0), ZERO_ADDRESS);
        require(
            _verify(_hash(burnNonce), _signatureB, _addressB),
            INVALID_SIGN
        );
        super._burn(tx.origin, _addressB);
    }

    function _getPrice() private view returns (uint256) {
        uint256 n = 0;
        uint256 c = 100;
        uint256 count = _totalIndex / 2;
        while (count >= c && n <= 9) {
            n++;
            c = c + (n + 1) * 100;
        }
        uint256 price = priceMin + priceStep * n;
        return price <= priceMax ? price : priceMax;
    }

    constructor() {}

    function _hash(string memory hash) private pure returns (bytes32) {
        return keccak256(abi.encode(hash));
    }

    function _verify(
        bytes32 hash,
        bytes memory _token,
        address _signer
    ) private pure returns (bool) {
        return (_recover(hash, _token) == _signer);
    }

    function _recover(bytes32 hash, bytes memory _token)
        private
        pure
        returns (address)
    {
        return hash.toEthSignedMessageHash().recover(_token);
    }

    function updateNonce(string memory _nonce) external onlyOwner {
        nonce = _nonce;
    }

    function updateBurnNonce(string memory _nonce) external onlyOwner {
        burnNonce = _nonce;
    }

    function updatePriceMax(uint256 _priceMax) external onlyOwner {
        priceMax = _priceMax;
    }

    function withdraw(address payable recipient) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "Withdraw failed.");
    }

    fallback() external payable {}

    receive() external payable {}
}
