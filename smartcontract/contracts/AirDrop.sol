// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract AirDrop is EIP712, AccessControl {
    using SafeERC20 for IERC20;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public closingTime;
    address private tokenAddress_;

    /* ========== GOVERNANCE ========== */
    constructor(string memory _name, uint256 _closingTime, address _tokenAddress, address _minter)
    EIP712(_name, "1.0.0")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _minter);
        closingTime = _closingTime;
        tokenAddress_ = _tokenAddress;
    }

    

    function setClosingTime(uint256 _closingTime) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        closingTime = _closingTime;
    }
     function setTokenAddress(address _tokenAddress) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        tokenAddress_ = _tokenAddress;
    }

    /* ========== VIEW FUNCTIONS ========== */
    function tokenAddress() external view returns (address) {
        return tokenAddress_;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */
    function redeem(address _account, uint256 _amount, bytes calldata _signature)
    external
    {
        require(block.timestamp >= closingTime, "Too early");
        require(_verify(_hash(_account, _amount), _signature), "Invalid signature");
        IERC20(tokenAddress_).safeTransfer(
            _account,
            _amount
        );
    }

    function _hash(address _account, uint256 _amount)
    internal view returns (bytes32)
    {
        return _hashTypedDataV4(keccak256(abi.encode(
            keccak256("Truong's AirDrop(uint256 amount,address account)"),
            _amount,
            _account
        )));
    }

    function _verify(bytes32 _digest, bytes memory _signature)
    internal view returns (bool)
    {
        return hasRole(MINTER_ROLE, ECDSA.recover(_digest, _signature));
    }

    /* ========== EMERGENCY ========== */
    receive() external payable {}

    function rescueStuckErc20(address _token) external  {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        require(
            block.timestamp >= closingTime + 14 days,
            "only can withdraw token at least 14 days after closing time"
        );
        IERC20(_token).safeTransfer(
            msg.sender,
            IERC20(_token).balanceOf(address(this))
        );
    }

    function rescueStuckBnb() external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        require(
            block.timestamp >= closingTime + 14 days,
            "only can withdraw BNB at least 14 days after closing time"
        );
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to withdraw BNB left");
    }
}