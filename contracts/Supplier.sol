// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Admin.sol";
import "./Transaction.sol";

contract Supplier {
    Admin public adminContract;
    Transaction public transactionContract;

    struct Material {
        uint materialId;
        string materialName;
        uint quantity;
        uint pricePerKg;
        bool certified;
        address supplier;
    }

    struct Order {
        uint orderId;
        string materialName;
        uint quantity;
        address manufacturer;
        string status; // "pending", "supplied", "delivered"
    }

    struct Delivery {
        uint deliveryId;
        string materialName;
        uint quantity;
        address destination;
        string status;
        uint timestamp;
    }

    uint public materialCount;
    uint public orderCount;
    uint public deliveryCount;

    mapping(uint => Material) public materials;
    mapping(uint => Order) public orders;
    mapping(uint => Delivery) public deliveries;

    event MaterialAdded(uint indexed materialId, string materialName, uint quantity, uint pricePerKg, bool certified, address supplier);
    event OrderReceived(uint indexed orderId, string materialName, uint quantity, address manufacturer);
    event DeliveryCreated(uint indexed deliveryId, string materialName, uint quantity, address destination);

    constructor(address _adminContract, address _transactionContract) {
        adminContract = Admin(_adminContract);
        transactionContract = Transaction(_transactionContract);
    }

    modifier onlyVerifiedSupplier() {
        require(adminContract.isVerified(msg.sender, "Supplier"), "Not a verified supplier");
        _;
    }

    function addMaterial(
        string memory materialName,
        uint quantity,
        uint pricePerKg,
        bool certified
    ) external onlyVerifiedSupplier {
        materialCount++;
        materials[materialCount] = Material(materialCount, materialName, quantity, pricePerKg, certified, msg.sender);
        emit MaterialAdded(materialCount, materialName, quantity, pricePerKg, certified, msg.sender);
    }

    function receiveOrder(
        uint orderId,
        string memory materialName,
        uint quantity,
        address manufacturer
    ) external {
        orderCount++;
        orders[orderCount] = Order(orderId, materialName, quantity, manufacturer, "pending");
        emit OrderReceived(orderId, materialName, quantity, manufacturer);
    }

    function createDelivery(
        uint orderId,
        string memory materialName,
        uint quantity,
        address destination
    ) external onlyVerifiedSupplier {
        require(keccak256(abi.encodePacked(orders[orderId].status)) == keccak256(abi.encodePacked("pending")), "Order not pending");

        deliveryCount++;
        deliveries[deliveryCount] = Delivery(deliveryCount, materialName, quantity, destination, "shipped", block.timestamp);
        orders[orderId].status = "supplied";

        transactionContract.recordTransaction(msg.sender, destination, quantity * materials[orderId].pricePerKg, materialName, orderId);
        emit DeliveryCreated(deliveryCount, materialName, quantity, destination);
    }

    function getMaterials() external view returns (Material[] memory) {
        Material[] memory result = new Material[](materialCount);
        for (uint i = 1; i <= materialCount; i++) {
            result[i - 1] = materials[i];
        }
        return result;
    }

    function getDeliveries() external view returns (Delivery[] memory) {
        Delivery[] memory result = new Delivery[](deliveryCount);
        for (uint i = 1; i <= deliveryCount; i++) {
            result[i - 1] = deliveries[i];
        }
        return result;
    }
}