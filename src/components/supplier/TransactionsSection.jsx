import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';

const TransactionsSection = ({ account }) => {
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
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">From (Supplier)</th>
            <th className="border p-2">To (Manufacturer)</th>
            <th className="border p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td className="border p-2">{tx.transactionId.toString()}</td>
              <td className="border p-2">{new Date(tx.timestamp.toNumber() * 1000).toLocaleDateString()}</td>
              <td className="border p-2">{tx.sender.slice(0, 6)}...{tx.sender.slice(-4)}</td>
              <td className="border p-2">{tx.receiver.slice(0, 6)}...{tx.receiver.slice(-4)}</td>
              <td className="border p-2">₹{tx.amount.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsSection;