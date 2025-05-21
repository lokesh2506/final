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
    <div className="bg-white dark:bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        🔁 Transaction Activity
      </h2>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-400">No transactions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((tx, index) => (
            <div
              key={tx._id || index}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow hover:shadow-xl transition duration-300"
            >
              <div className="text-xs text-gray-400">#{index + 1}</div>
              <div className="text-lg font-semibold mt-1 mb-2 text-blue-700 dark:text-blue-400">
                {tx.role} - {tx.action}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Wallet:</span>{' '}
                <span className="font-mono text-sm text-yellow-500">
                  {tx.wallet}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                {new Date(tx.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsSection;
