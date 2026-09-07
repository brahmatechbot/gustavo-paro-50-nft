// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title Gustavo Paro 50
/// @notice Immutable one-of-one ERC-721 tribute celebrating Gustavo Paro's 50th birthday.
contract GustavoParo50 is ERC721 {
    uint256 public constant TRIBUTE_TOKEN_ID = 1;
    string public constant TOKEN_METADATA_URI = "https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/1.json";
    string public constant COLLECTION_METADATA_URI =
        "https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/collection.json";

    constructor(address tributeRecipient) ERC721("Gustavo Paro 50", "PARO50") {
        require(tributeRecipient != address(0), "recipient required");
        _mint(tributeRecipient, TRIBUTE_TOKEN_ID);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return TOKEN_METADATA_URI;
    }

    function contractURI() external pure returns (string memory) {
        return COLLECTION_METADATA_URI;
    }
}
