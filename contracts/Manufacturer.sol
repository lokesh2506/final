// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Admin.sol";
import "./Supplier.sol";
import "./Transaction.sol";

contract Manufacturer {
    Admin public adminContract;
    Supplier public supplierContract;
    Transaction public transactionContract;

    struct Order {
        uint orderId;
        string materialName;
        uint quantity;
        address supplier;
        uint totalPrice;
    }

    uint public orderCount;

    mapping(uint => Order) public orders;

    event OrderPlaced(uint indexed orderId, string materialName, uint quantity, address supplier, uint totalPrice);

    constructor(address _adminContract, address _supplierContract, address _transactionContract) {
        adminContract = Admin(_adminContract);
        supplierContract = Supplier(_supplierContract);
        transactionContract = Transaction(_transactionContract);
    }

    modifier onlyVerifiedManufacturer() {
        require(adminContract.isVerified(msg.sender, "Manufacturer"), "Not a verified manufacturer");
        _;
    }

    function placeOrder(
        address supplier,
        string memory materialName,
        uint quantity,
        uint totalPrice
    ) external payable onlyVerifiedManufacturer {
        require(msg.value == totalPrice, "Incorrect payment amount");

        orderCount++;
        orders[orderCount] = Order(orderCount, materialName, quantity, supplier, totalPrice);
        supplierContract.receiveOrder(orderCount, materialName, quantity, msg.sender);

        transactionContract.recordTransaction(msg.sender, supplier, totalPrice, materialName, orderCount);
        emit OrderPlaced(orderCount, materialName, quantity, supplier, totalPrice);

        payable(supplier).transfer(totalPrice);
    }

    function getOrders() external view returns (Order[] memory) {
        Order[] memory result = new Order[](orderCount);
        for (uint i = 1; i <= orderCount; i++) {
            result[i - 1] = orders[i];
        }
        return result;
    }
}