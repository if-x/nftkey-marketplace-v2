// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity =0.8.9;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/INFTKEYMarketplaceRoyalty.sol";

contract NFTKEYMarketplaceRoyalty is INFTKEYMarketplaceRoyalty, Ownable {
    uint256 public defaultRoyaltyFraction = 20; // By the factor of 1000, 2%
    uint256 public royaltyUpperLimit = 100; // By the factor of 1000, 10%

    mapping(address => ERC721CollectionRoyalty) private _collectionRoyalty;

    function _erc721Owner(address erc721Address)
        private
        view
        returns (address)
    {
        try Ownable(erc721Address).owner() returns (address _contractOwner) {
            return _contractOwner;
        } catch {
            return address(0);
        }
    }

    function royalty(address erc721Address)
        public
        view
        override
        returns (ERC721CollectionRoyalty memory)
    {
        if (_collectionRoyalty[erc721Address].setBy != address(0)) {
            return _collectionRoyalty[erc721Address];
        }

        address erc721Owner = _erc721Owner(erc721Address);
        if (erc721Owner != address(0)) {
            return
                ERC721CollectionRoyalty(
                    erc721Owner,
                    defaultRoyaltyFraction,
                    address(0)
                );
        }

        return ERC721CollectionRoyalty(address(0), 0, address(0));
    }

    function setRoyalty(
        address erc721Address,
        address royaltyRecipient,
        uint256 feeFraction
    ) external override {
        require(
            feeFraction <= royaltyUpperLimit,
            "Please set the royalty percentange below allowed range"
        );

        address authorisedAddress = royalty(erc721Address).recipient;

        if (authorisedAddress == address(0)) {
            authorisedAddress = owner();
        }

        require(
            msg.sender == authorisedAddress,
            "Only ERC721 contract owner or NFTKEY Marketplace owner is allowed to set Royalty"
        );

        _collectionRoyalty[erc721Address] = ERC721CollectionRoyalty(
            royaltyRecipient,
            feeFraction,
            msg.sender
        );

        emit SetRoyalty(erc721Address, royaltyRecipient, feeFraction);
    }

    function updateRoyaltyUpperLimit(uint256 _newUpperLimit)
        external
        onlyOwner
    {
        royaltyUpperLimit = _newUpperLimit;
    }
}
