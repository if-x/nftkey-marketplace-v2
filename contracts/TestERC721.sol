// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity =0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TestERC721 is ERC721Enumerable, Ownable {
    constructor() ERC721("Test ERC721", "T721") {}

    function mint() external {
        _safeMint(msg.sender, totalSupply());
    }
}
