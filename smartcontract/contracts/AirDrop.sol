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
    uint256 public startingTime;
    uint256 public receiverCount;
    address private tokenAddress_;
    mapping (uint256 => address) private receivers;
    mapping (address => uint256) private receiveAmount;

    /* ========== EVENTS ========== */
    event Claim(address account,uint256 amount);

    /* ========== MODIFIERS ========== */
    modifier onlyAdmin(){
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only Admin");
        _;
    }
    modifier isNotReceiver(){
        require(receiveAmount[msg.sender] == 0, "You have received this Air Drop");
        _;
    }
    /* ========== GOVERNANCE ========== */
    constructor(string memory _name, uint256 _startingTime, address _tokenAddress, address _minter)
    EIP712(_name, "1.0.0")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _minter);
        startingTime = _startingTime;
        tokenAddress_ = _tokenAddress;
    }

    function setstartingTime(uint256 _startingTime) external onlyAdmin{
        startingTime = _startingTime;
    }
    function setTokenAddress(address _tokenAddress) external onlyAdmin{
        tokenAddress_ = _tokenAddress;
    }

    /* ========== VIEW FUNCTIONS ========== */
    function tokenAddress() external view returns (address) {
        return tokenAddress_;
    }
    function receiverByIndex(uint256 index) external view returns(address){
        return receivers[index];
    }
    function amountHasReceived(address account) external view returns(uint256){
        return receiveAmount[account];
    }
    /* ========== MUTATIVE FUNCTIONS ========== */
    function claim(address _account, uint256 _amount, bytes calldata _signature)
    external isNotReceiver
    {
        require(block.timestamp >= startingTime, "Too early");
        require(_verify(_hash(_account, _amount), _signature), "Invalid signature");
        require(IERC20(tokenAddress_).balanceOf(address(this)) >= _amount, "Out of token");
        receiverCount += 1;
        receivers[receiverCount] = msg.sender;
        receiveAmount[msg.sender] = _amount;
        IERC20(tokenAddress_).safeTransfer(
            _account,
            _amount
        );
        emit Claim(_account, _amount);
    }

    function _hash(address _account, uint256 _amount)
    internal view returns (bytes32)
    {
        return _hashTypedDataV4(keccak256(abi.encode(
            keccak256("TruongsAirDrop(uint256 amount,address account)"),
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

    function rescueStuckErc20(address _token) external onlyAdmin {
        require(
            block.timestamp >= startingTime + 14 days,
            "only can withdraw token at least 14 days after starting time"
        );
        IERC20(_token).safeTransfer(
            msg.sender,
            IERC20(_token).balanceOf(address(this))
        );
    }

    function rescueStuckBnb() external onlyAdmin {
        require(
            block.timestamp >= startingTime + 14 days,
            "only can withdraw BNB at least 14 days after starting time"
        );
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to withdraw BNB left");
    }
}