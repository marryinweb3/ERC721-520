// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./marry3-token.sol";
import "../ownership/ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Marry3 is Ownable {
    Marry3Token private token;
    using ECDSA for bytes32;
    string private nonce = "i will";
    string private burnNonce = "fine";

    uint256 private constant priceStep = 0.01 * (10**18);
    uint256 private constant priceMin = 0.01 * (10**18);
    uint256 private priceMax = 0.1 * (10**18);

    // marry count
    uint256 private marryCount = 1;

    function getPrice() public view returns (uint256) {
        return _getPrice();
    }

    function getMarryCount() public view returns (uint256) {
        return marryCount;
    }

    function mint(
        address _addressA,
        address _addressB,
        ERC520.Sex _sexA,
        ERC520.Sex _sexB,
        bytes calldata _signatureB
    ) external payable {
        require(_getPrice() <= msg.value, "no enough eth");
        require(_addressA != address(0), "addressA cannot be the zero address");
        require(_addressB != address(0), "addressB cannot be the zero address");
        require(_addressA == msg.sender, "addressA must be the msg.sender");
        // check _signatureB
        require(
            _verify(_hash(nonce), _signatureB, _addressB),
            "Invalid signature."
        );
        token.mint(_addressA, _addressB, _sexA, _sexB);
        marryCount++;
    }

    /**
     * admin can mint directly，for white list users
     */
    function mintByOwner(
        address _addressA,
        address _addressB,
        ERC520.Sex _sexA,
        ERC520.Sex _sexB
    ) external onlyOwner {
        token.mint(_addressA, _addressB, _sexA, _sexB);
        marryCount++;
    }

    function burnByOwner(address _addressA, address _addressB)
        external
        onlyOwner
    {
        token.burn(_addressA, _addressB);
    }

    function burn(
        address _addressA,
        address _addressB,
        bytes memory _signatureB
    ) external payable onlyOwner {
        require(_getPrice() * 2 <= msg.value, "no enough eth");
        require(_addressA != address(0), "addressA cannot be the zero address");
        require(_addressB != address(0), "addressB cannot be the zero address");
        require(
            _verify(_hash(burnNonce), _signatureB, _addressB),
            "Invalid signature."
        );
        token.burn(_addressA, _addressB);
    }

    /**
    0    0.01,  +100*0.01 = 1
    100  0.02,  +200*0.02 = 4
    300  0.03,  +300*0.03 = 9
    600  0.04,  +400*0.04 = 16
    1000 0.05,  +500*0.05 = 25
    1500 0.06,  +600*0.06 = 36
    2100 0.07,  +700*0.07 = 49
    2800 0.08,  +800*0.08 = 64
    3600 0.09,  +900*0.09 = 81
    4500+ 0.10,  +5500*0.10 = 550
    10000+ 0.10,  total = 1+4+9+16+25+36+49+64+81+550 = 835 E 


    0    0.01 
    100  0.02
    300  0.03
    600  0.04
    1000 0.05
    1500 0.06
    2100 0.07
    2800 0.08
    3600 0.09
    4500+ 0.10
    */
    function _getPrice() private view returns (uint256) {
        uint8 n = 0;
        uint8 c = 100;
        while (marryCount >= c && n <= 9) {
            n++;
            c = c + (n + 1) * 100;
        }
        uint256 price = priceMin + priceStep * n;
        return price <= priceMax ? price : priceMax;
    }

    constructor(address _token) {
        token = Marry3Token(_token);
    }

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

    function _checkPrice(uint256 price) private {
        require(msg.value >= price, "GCLX: Mei duo gei ETH.");
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
