// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction {
    struct TransactionData {
        uint transactionId;
        address sender;
        address receiver;
        uint amount;
        string materialName;
        uint orderId;
        uint timestamp;
    }

    uint public transactionCount;
    mapping(uint => TransactionData) public transactions;

    event TransactionRecorded(uint indexed transactionId, address sender, address receiver, uint amount, string materialName, uint orderId);

    function recordTransaction(
        address sender,
        address receiver,
        uint amount,
        string memory materialName,
        uint orderId
    ) external {
        transactionCount++;
        transactions[transactionCount] = TransactionData(
            transactionCount,
            sender,
            receiver,
            amount,
            materialName,
            orderId,
            block.timestamp
        );
        emit TransactionRecorded(transactionCount, sender, receiver, amount, materialName, orderId);
    }

    function getTransactions() external view returns (TransactionData[] memory) {
        TransactionData[] memory result = new TransactionData[](transactionCount);
        for (uint i = 1; i <= transactionCount; i++) {
            result[i - 1] = transactions[i];
        }
        return result;
    }
}