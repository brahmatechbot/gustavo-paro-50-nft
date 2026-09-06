// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title Gustavo Paro 50
/// @notice A one-of-one ERC-721 tribute NFT celebrating Gustavo Paro's 50th birthday.
contract GustavoParo50 is ERC721, Ownable {
    using Strings for uint256;

    uint256 public constant TRIBUTE_TOKEN_ID = 1;
    string private _baseTokenURI;

    event BaseURIUpdated(string newBaseURI);

    constructor(string memory initialBaseURI, address initialOwner, address tributeRecipient)
        ERC721("Gustavo Paro 50", "PARO50")
        Ownable(initialOwner)
    {
        require(bytes(initialBaseURI).length > 0, "base URI required");
        require(initialOwner != address(0), "owner required");
        require(tributeRecipient != address(0), "recipient required");

        _baseTokenURI = initialBaseURI;
        _safeMint(tributeRecipient, TRIBUTE_TOKEN_ID);
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        require(bytes(newBaseURI).length > 0, "base URI required");
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat(_baseTokenURI, tokenId.toString(), ".json");
    }

    function contractURI() external view returns (string memory) {
        return string.concat(_baseTokenURI, "collection.json");
    }
}
