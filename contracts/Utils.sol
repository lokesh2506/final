// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Fine.sol";

contract Utils {
    enum Role { Supplier, Manufacturer, MRO, Airline, RegulatoryAuthority }

    function roleToString(Role role) external pure returns (string memory) {
        if (role == Role.Supplier) return "Supplier";
        if (role == Role.Manufacturer) return "Manufacturer";
        if (role == Role.MRO) return "MRO";
        if (role == Role.Airline) return "Airline";
        if (role == Role.RegulatoryAuthority) return "RegulatoryAuthority";
        return "Unknown";
    }
}
