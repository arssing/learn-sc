//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT721 is ERC721Enumerable, Ownable {
    uint public maxSupply = 10;
    mapping (uint => string) tokenURIs;

    constructor (
        string memory _name, 
        string memory _symbol
    ) 
    ERC721(_name, _symbol) {}

    function mint(address _recipient, string memory _tokenURI) public onlyOwner {
        uint256 newTokenId = totalSupply() + 1;
        require(newTokenId <= maxSupply, "NFT721::mint:max NFT limit");

        _safeMint(_recipient, newTokenId);
        tokenURIs[newTokenId] = _tokenURI;
    }

    function tokenURI(uint _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "NFT721::tokenURI:nonexistent token");
        return tokenURIs[_tokenId];
    }
}