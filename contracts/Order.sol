// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Order {
    struct OrderDetails {
        uint orderId;
        address supplier;
        address manufacturer;
        string materialName;
        uint quantity;
        string status;
        uint timestamp;
    }

    mapping(uint => OrderDetails) public orders;
    uint public orderCount;

    event OrderCreated(uint orderId, address supplier, address manufacturer, string materialName, uint quantity, uint timestamp);

    function createOrder(address supplier, address manufacturer, string memory materialName, uint quantity) external {
        orderCount++;
        orders[orderCount] = OrderDetails(orderCount, supplier, manufacturer, materialName, quantity, "pending", block.timestamp);
        emit OrderCreated(orderCount, supplier, manufacturer, materialName, quantity, block.timestamp);
    }

    function updateOrderStatus(uint orderId, string memory status) external {
        require(orders[orderId].orderId != 0, "Order does not exist");
        orders[orderId].status = status;
    }
}