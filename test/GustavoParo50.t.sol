// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {GustavoParo50} from "../src/GustavoParo50.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract GustavoParo50Test is Test {
    address internal owner = address(0xA11CE);
    address internal recipient = address(0xB0B);
    string internal baseURI = "https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/";

    function testConstructorMintsTributeToken() public {
        GustavoParo50 nft = new GustavoParo50(baseURI, owner, recipient);

        assertEq(nft.name(), "Gustavo Paro 50");
        assertEq(nft.symbol(), "PARO50");
        assertEq(nft.owner(), owner);
        assertEq(nft.ownerOf(1), recipient);
        assertEq(nft.tokenURI(1), "https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/1.json");
        assertEq(nft.contractURI(), "https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/collection.json");
    }

    function testOnlyOwnerCanUpdateBaseURI() public {
        GustavoParo50 nft = new GustavoParo50(baseURI, owner, recipient);

        vm.prank(recipient);
        vm.expectRevert();
        nft.setBaseURI("https://example.com/metadata/");

        vm.prank(owner);
        nft.setBaseURI("https://example.com/metadata/");
        assertEq(nft.tokenURI(1), "https://example.com/metadata/1.json");
    }

    function testRejectsZeroAddressesAndEmptyBaseURI() public {
        vm.expectRevert(bytes("base URI required"));
        new GustavoParo50("", owner, recipient);

        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableInvalidOwner.selector, address(0)));
        new GustavoParo50(baseURI, address(0), recipient);

        vm.expectRevert(bytes("recipient required"));
        new GustavoParo50(baseURI, owner, address(0));
    }
}
