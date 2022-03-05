// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
contract MockERC20 is ERC20Burnable {
    mapping(address => bool) public minter;
    uint8 internal decimals_;

    constructor(
    ) ERC20("Truong's Coin", "NDT") {
        decimals_ = 18;
        uint256 totalTokens = 100000000 * 10**uint256(decimals());
        _mint(msg.sender, totalTokens);
    }

    function decimals() public view virtual override returns (uint8) {
        return decimals_;
    }


}
