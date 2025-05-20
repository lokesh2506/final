// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction {
    struct TxLog {
        uint txId;
        address sender;
        address receiver;
        string materialName;
        uint amount;
        uint orderId;
        uint timestamp;
    }

    uint public txCount;
    mapping(uint => TxLog) public transactions;

    event TransactionRecorded(
        uint txId,
        address indexed sender,
        address indexed receiver,
        string materialName,
        uint amount,
        uint orderId,
        uint timestamp
    );

    function recordTransaction(
        address sender,
        address receiver,
        uint amount,
        string memory materialName,
        uint orderId
    ) external {
        txCount++;
        transactions[txCount] = TxLog(
            txCount,
            sender,
            receiver,
            materialName,
            amount,
            orderId,
            block.timestamp
        );

        emit TransactionRecorded(
            txCount,
            sender,
            receiver,
            materialName,
            amount,
            orderId,
            block.timestamp
        );
    }

    function getAllTransactions() external view returns (TxLog[] memory) {
        TxLog[] memory result = new TxLog[](txCount);
        for (uint i = 1; i <= txCount; i++) {
            result[i - 1] = transactions[i];
        }
        return result;
    }
}
