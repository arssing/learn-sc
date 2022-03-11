//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT1155 is ERC1155, Ownable {

    constructor (
        string memory _initURI
    ) 
    ERC1155(_initURI) {}

    function mint(uint _tokenId, uint _amount) public onlyOwner {
        _mint(msg.sender, _tokenId, _amount, "");
    }

    function uri(uint _tokenId) public view override returns (string memory) {
        return (
            string(abi.encodePacked(
                super.uri(_tokenId),
                Strings.toString(_tokenId),
                ".json"
            ))
        );
    }
}