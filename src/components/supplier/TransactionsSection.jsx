import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import { toast } from 'react-toastify';

const TransactionsSection = () => {
  const { account } = useContext(BlockchainContext);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/transactions/${account}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Transaction fetch error:', err);
      toast.error('❌ Failed to load transactions');
    }
  };

  useEffect(() => {
    if (account) fetchTransactions();
  }, [account]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2">Sl.no</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Wallet</th>
              <th className="border p-2">Action</th>
              <th className="border p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={tx._id || index} className="text-gray-800">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{tx.role}</td>
                <td className="border p-2">
                  {tx.wallet.slice(0, 6)}...{tx.wallet.slice(-4)}
                </td>
                <td className="border p-2">{tx.action}</td>
                <td className="border p-2">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsSection;
