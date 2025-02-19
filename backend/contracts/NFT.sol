// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title An NFT Creation Contract
 * @author Abel Sisay
 * @notice This contract is for creating an NFT Contract
 * @dev Implements the ERC721URIStorage contract from OpenZeppelin
 */

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;

    constructor() ERC721("MY NFT", "MYF") {}

    function mint(string memory _tokenURI) external returns (uint256) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }
}
