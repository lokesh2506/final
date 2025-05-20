// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./Admin.sol";
import "./Supplier.sol";
import "./Transaction.sol";

contract Manufacturer {
    Admin public adminContract;
    Supplier public supplierContract;
    Transaction public transactionContract;

    constructor(address _admin, address _supplier, address _transaction) {
        adminContract = Admin(_admin);
        supplierContract = Supplier(_supplier);
        transactionContract = Transaction(_transaction);
    }

    struct Order {
        uint256 id;
        string materialName;
        uint256 quantity;
        uint256 totalPrice;
        address manufacturer;
        address supplier;
        string status; // placed, delivered
    }

    uint256 public orderCounter;
    mapping(uint256 => Order) public orders;

    event OrderPlaced(
        uint256 indexed id,
        string materialName,
        uint256 quantity,
        uint256 totalPrice,
        address indexed supplier,
        address indexed manufacturer
    );

    modifier onlyVerifiedManufacturer() {
        require(adminContract.isVerified(msg.sender, Admin.Role.Manufacturer), "Manufacturer not verified"); // 1 => Manufacturer
        _;
    }

    function placeOrder(
        string memory materialName,
        uint256 quantity,
        address supplier,
        uint256 pricePerKg
    ) external payable onlyVerifiedManufacturer {
        uint256 totalPrice = quantity * pricePerKg;
        require(msg.value == totalPrice, "Incorrect ETH sent");

        // Call Supplier.receiveOrder
        supplierContract.receiveOrder(materialName, quantity, msg.sender, totalPrice);

        orderCounter++;
        orders[orderCounter] = Order(
            orderCounter,
            materialName,
            quantity,
            totalPrice,
            msg.sender,
            supplier,
            "placed"
        );

        // Log transaction
        transactionContract.recordTransaction(
            msg.sender,
            supplier,
            totalPrice,
            materialName,
            orderCounter
        );

        // Transfer payment
        payable(supplier).transfer(totalPrice);

        emit OrderPlaced(orderCounter, materialName, quantity, totalPrice, supplier, msg.sender);
    }

    function getAllOrders() external view returns (Order[] memory) {
        Order[] memory result = new Order[](orderCounter);
        for (uint256 i = 0; i < orderCounter; i++) {
            result[i] = orders[i + 1];
        }
        return result;
    }
}
