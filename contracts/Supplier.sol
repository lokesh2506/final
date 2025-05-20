// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Admin.sol";
import "./Transaction.sol";

contract Supplier {
    Admin public admin;
    Transaction public transactionContract;

    constructor(address _admin, address _transaction) {
        admin = Admin(_admin);
        transactionContract = Transaction(_transaction);
    }

    struct Material {
        uint256 id;
        string name;
        string details;
        uint256 quantity;
        string serialNumber;
        string batchNumber;
        bool certified;
        string certifiedAuthority;
        uint256 pricePerKg;
        address supplier;
    }

    struct Order {
        uint256 id;
        string materialName;
        uint256 quantity;
        address manufacturer;
        address supplier;
        uint256 totalPrice;
        string status; // pending, supplied
    }

    struct Delivery {
        uint256 id;
        uint256 orderId;
        string materialName;
        uint256 quantity;
        address destination;
        string status;
        uint256 timestamp;
    }

    uint256 public materialCounter;
    uint256 public orderCounter;
    uint256 public deliveryCounter;

    mapping(uint256 => Material) public materials;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => Delivery) public deliveries;

    event MaterialAdded(uint256 indexed id, string name);
    event OrderReceived(uint256 indexed id, string materialName, uint256 quantity);
    event DeliveryCreated(uint256 indexed id, uint256 orderId, address destination);

    modifier onlyVerifiedSupplier() {
        require(admin.isVerified(msg.sender, Admin.Role.Supplier), "Supplier not verified");
        _;
    }

    function addMaterial(
        string memory name,
        string memory details,
        uint256 quantity,
        string memory serialNumber,
        string memory batchNumber,
        bool certified,
        string memory certifiedAuthority,
        uint256 pricePerKg
    ) external payable {
        emit Debug("Step 1: Checking verification");
        bool verified = admin.isVerified(msg.sender, Admin.Role.Supplier);
        require(verified, "Supplier is not verified");

        emit Debug("Step 2: Passed verification");
        require(msg.value >= 1e15, "Insufficient ETH: at least 0.001 required");

        emit Debug("Step 3: Passed ETH check");
        materialCounter++;
        materials[materialCounter] = Material(
            materialCounter,
            name,
            details,
            quantity,
            serialNumber,
            batchNumber,
            certified,
            certifiedAuthority,
            pricePerKg,
            msg.sender
        );

        emit MaterialAdded(materialCounter, name);
        emit Debug("Step 4: Material added successfully");
    }

    // Add this to top-level contract
    event Debug(string message);



    function receiveOrder(
        string memory materialName,
        uint256 quantity,
        address manufacturer,
        uint256 totalPrice
    ) external {
        orderCounter++;
        orders[orderCounter] = Order(
            orderCounter,
            materialName,
            quantity,
            manufacturer,
            msg.sender,
            totalPrice,
            "pending"
        );
        emit OrderReceived(orderCounter, materialName, quantity);
    }

    function createDelivery(
        uint256 orderId,
        string memory materialName,
        uint256 quantity,
        address destination
    ) external onlyVerifiedSupplier {
        require(
            keccak256(abi.encodePacked(orders[orderId].status)) == keccak256("pending"),
            "Order not pending"
        );

        deliveryCounter++;
        deliveries[deliveryCounter] = Delivery(
            deliveryCounter,
            orderId,
            materialName,
            quantity,
            destination,
            "shipped",
            block.timestamp
        );

        orders[orderId].status = "supplied";

        uint256 totalAmount = orders[orderId].totalPrice;
        transactionContract.recordTransaction(
            msg.sender,
            destination,
            totalAmount,
            materialName,
            orderId
        );

        emit DeliveryCreated(deliveryCounter, orderId, destination);
    }

    function getAllMaterials() external view returns (Material[] memory) {
        Material[] memory result = new Material[](materialCounter);
        for (uint256 i = 1; i <= materialCounter; i++) {
            result[i - 1] = materials[i];
        }
        return result;
    }

    function getAllDeliveries() external view returns (Delivery[] memory) {
        Delivery[] memory result = new Delivery[](deliveryCounter);
        for (uint256 i = 1; i <= deliveryCounter; i++) {
            result[i - 1] = deliveries[i];
        }
        return result;
    }
}
