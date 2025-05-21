// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PartProduction {
    struct Part {
        string partName;
        string serialBatch;
        string materialUsed;
        string manufacturer;
        string status;
        string manufactureDate;
        string deliveryDate;
    }

    Part[] public parts;

    event PartProduced(
        string partName,
        string serialBatch,
        string materialUsed,
        string manufacturer,
        string status,
        string manufactureDate,
        string deliveryDate
    );

    function producePart(
        string memory _partName,
        string memory _serialBatch,
        string memory _materialUsed,
        string memory _manufacturer,
        string memory _status,
        string memory _manufactureDate,
        string memory _deliveryDate
    ) public {
        parts.push(
            Part(
                _partName,
                _serialBatch,
                _materialUsed,
                _manufacturer,
                _status,
                _manufactureDate,
                _deliveryDate
            )
        );
        emit PartProduced(_partName, _serialBatch, _materialUsed, _manufacturer, _status, _manufactureDate, _deliveryDate);
    }

    function getAllParts() public view returns (Part[] memory) {
        return parts;
    }
}
