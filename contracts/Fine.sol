// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fine {
    struct FineInfo {
        address manufacturer;
        address mro;
        uint orderId;
        uint requiredDeliveryDate;
        uint actualDeliveryDate;
        uint fineAmount;
    }


    mapping(uint => FineInfo) public fines;
    uint public fineCount;

    event FineIssued(uint indexed orderId, address manufacturer, uint fineAmount);

    function issueFine(
        address manufacturer,
        address mro,
        uint orderId,
        uint requiredDeliveryDate,
        uint actualDeliveryDate,
        uint fineAmount
    ) external {
        fineCount++;
        fines[fineCount] = FineInfo(
            manufacturer,
            mro,
            orderId,
            requiredDeliveryDate,
            actualDeliveryDate,
            fineAmount
        );

        emit FineIssued(orderId, manufacturer, fineAmount);
    }

    function getAllFines() external view returns (FineInfo[] memory) {
        FineInfo[] memory all = new FineInfo[](fineCount);
        for (uint i = 1; i <= fineCount; i++) {
            all[i - 1] = fines[i];
        }
        return all;
    }
}
