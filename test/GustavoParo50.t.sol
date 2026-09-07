// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GustavoParo50} from "../src/GustavoParo50.sol";

contract GustavoParo50Test is Test {
    address internal recipient = address(0xB0B);

    function testConstructorMintsOneOfOneTribute() public {
        GustavoParo50 nft = new GustavoParo50(recipient);

        assertEq(nft.name(), "Gustavo Paro 50");
        assertEq(nft.symbol(), "PARO50");
        assertEq(nft.ownerOf(1), recipient);
        assertEq(nft.tokenURI(1), "https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/1.json");
        assertEq(nft.contractURI(), "https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/collection.json");
    }

    function testSupportsERC721AndMetadataInterfaces() public {
        GustavoParo50 nft = new GustavoParo50(recipient);
        assertTrue(nft.supportsInterface(0x80ac58cd));
        assertTrue(nft.supportsInterface(0x5b5e139f));
    }

    function testRejectsZeroRecipient() public {
        vm.expectRevert(bytes("recipient required"));
        new GustavoParo50(address(0));
    }

    function testNonexistentTokenURIReverts() public {
        GustavoParo50 nft = new GustavoParo50(recipient);
        vm.expectRevert();
        nft.tokenURI(2);
    }
}
