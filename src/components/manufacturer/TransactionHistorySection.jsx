import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';

const TransactionHistorySection = ({ account }) => {
  const { contract } = useContext(BlockchainContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const txs = await contract.getTransactions();
        const filteredTxs = txs.filter(
          (tx) =>
            tx.sender.toLowerCase() === account.toLowerCase() ||
            tx.receiver.toLowerCase() === account.toLowerCase()
        );
        setTransactions(filteredTxs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (contract && account) {
      fetchTransactions();
    }
  }, [contract, account]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Transaction ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Action Type</th>
            <th className="border p-2">From</th>
            <th className="border p-2">To</th>
            <th className="border p-2">Part/Material</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td className="border p-2">{tx.transactionId.toString()}</td>
              <td className="border p-2">{new Date(tx.timestamp.toNumber() * 1000).toLocaleDateString()}</td>
              <td className="border p-2">Order Placed</td>
              <td className="border p-2">{tx.sender.slice(0, 6)}...{tx.sender.slice(-4)}</td>
              <td className="border p-2">{tx.receiver.slice(0, 6)}...{tx.receiver.slice(-4)}</td>
              <td className="border p-2">{tx.materialName || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistorySection;