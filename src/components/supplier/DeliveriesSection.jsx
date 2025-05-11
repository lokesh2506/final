import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';

const DeliveriesSection = ({ account }) => {
  const { contract } = useContext(BlockchainContext);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const deliveryData = await contract.getDeliveries();
        const filteredDeliveries = deliveryData.filter(
          (delivery) => delivery.supplier.toLowerCase() === account.toLowerCase()
        );
        setDeliveries(filteredDeliveries);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    if (contract && account) {
      fetchDeliveries();
    }
  }, [contract, account]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Deliveries</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Delivery ID</th>
            <th className="border p-2">Material Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Manufacturer</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Tracking Number</th>
            <th className="border p-2">Delivery Date</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.deliveryId.toString()}>
              <td className="border p-2">{delivery.deliveryId.toString()}</td>
              <td className="border p-2">{delivery.materialName}</td>
              <td className="border p-2">{delivery.quantity.toString()} kg</td>
              <td className="border p-2">{delivery.destination.slice(0, 6)}...{delivery.destination.slice(-4)}</td>
              <td className="border p-2">{delivery.status}</td>
              <td className="border p-2">{delivery.trackingNumber || 'N/A'}</td>
              <td className="border p-2">{new Date(delivery.timestamp.toNumber() * 1000).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveriesSection;