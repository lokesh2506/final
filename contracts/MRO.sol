// contracts/MRO.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Admin.sol";
import "./Fine.sol";

contract MRO {
    Admin public adminContract;
    Fine public fineContract;

    constructor(address _admin, address _fine) {
        adminContract = Admin(_admin);
        fineContract = Fine(_fine);
    }

    struct ServiceOrder {
        uint orderId;
        string partName;
        uint quantity;
        address manufacturer;
        address mro;
        uint requiredDeliveryDate;
        uint actualDeliveryDate;
        string status; // "requested", "delivered", "late"
    }

    mapping(uint => ServiceOrder) public orders;
    uint public orderCount;

    event OrderRequested(uint orderId, string partName, address manufacturer);
    event OrderDelivered(uint orderId, address mro, string status);

    modifier onlyVerifiedMRO() {
        require(adminContract.isVerified(msg.sender, Admin.Role.MRO), "Not a verified MRO");
        _;
    }

    function requestOrder(
        string memory partName,
        uint quantity,
        address manufacturer,
        uint requiredDeliveryDate
    ) external onlyVerifiedMRO {
        orderCount++;
        orders[orderCount] = ServiceOrder(
            orderCount,
            partName,
            quantity,
            manufacturer,
            msg.sender,
            requiredDeliveryDate,
            0,
            "requested"
        );
        emit OrderRequested(orderCount, partName, manufacturer);
    }

    function markDelivered(
        uint orderId,
        uint actualDeliveryDate
    ) external onlyVerifiedMRO {
        require(orderId > 0 && orderId <= orderCount, "Invalid orderId");
        ServiceOrder storage order = orders[orderId];
        require(order.mro == msg.sender, "Unauthorized");

        order.actualDeliveryDate = actualDeliveryDate;

        if (actualDeliveryDate > order.requiredDeliveryDate) {
            uint delay = actualDeliveryDate - order.requiredDeliveryDate;
            uint fineAmount = delay * 100; // Simple fine logic: 100 wei per late day

            order.status = "late";

            fineContract.issueFine(
                order.manufacturer,
                msg.sender,
                orderId,
                order.requiredDeliveryDate,
                actualDeliveryDate,
                fineAmount
            );
        } else {
            order.status = "delivered";
        }

        emit OrderDelivered(orderId, msg.sender, order.status);
    }

    function getAllOrders() external view returns (ServiceOrder[] memory) {
        ServiceOrder[] memory all = new ServiceOrder[](orderCount);
        for (uint i = 1; i <= orderCount; i++) {
            all[i - 1] = orders[i];
        }
        return all;
    }
}
