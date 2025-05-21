import React, { useState } from 'react';
import { FaRocket, FaTools } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useBlockchain } from '../../context/BlockchainContext';

const PartsProductionSection = () => {
  const { contracts } = useBlockchain();

  const [formData, setFormData] = useState({
    partName: '',
    serialBatch: '',
    materialUsed: '',
    status: 'In Progress',
    manufactureDate: '',
    deliveryDate: '',
  });

  const [producedParts, setProducedParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const TARGET_MANUFACTURER_WALLET = "0xD65Cb02E0078F98dA3422Aa8818d92d6A664365F"; // ✅ Change if needed

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { partName, serialBatch, materialUsed, status, manufactureDate, deliveryDate } = formData;

    if (!partName || !serialBatch || !materialUsed || !manufactureDate || !deliveryDate) {
      toast.error('❗ Please fill all fields');
      return;
    }

    if (!contracts.manufacturer) {
      toast.error('❌ Manufacturer contract not found');
      return;
    }

    try {
      setLoading(true);
      const tx = await contracts.manufacturer.producePart(
        partName,
        serialBatch,
        materialUsed,
        TARGET_MANUFACTURER_WALLET,
        status,
        manufactureDate,
        deliveryDate
      );
      await tx.wait();

      toast.success(`✅ Part created! Tx: ${tx.hash.slice(0, 10)}...`);
      setProducedParts(prev => [...prev, { ...formData, txHash: tx.hash }]);

      setFormData({
        partName: '', serialBatch: '', materialUsed: '', status: 'In Progress', manufactureDate: '', deliveryDate: ''
      });

    } catch (err) {
      toast.error('❌ Transaction failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 border border-green-300">
        <div className="text-center mb-6">
          <FaTools className="text-5xl mx-auto text-black mb-2" />
          <h2 className="text-3xl font-extrabold text-black">Produce New Part</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="partName" placeholder="🛠️ Part Name *" value={formData.partName} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-green-300 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-black" />

          <input name="serialBatch" placeholder="🔢 Serial/Batch Number *" value={formData.serialBatch} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-green-300 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-black" />

          <input name="materialUsed" placeholder="⚙️ Material Used *" value={formData.materialUsed} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-green-300 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-black" />

          <select name="status" value={formData.status} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-green-300 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-black">
            <option value="In Progress">⏳ In Progress</option>
            <option value="Quality Check">🧪 Quality Check</option>
            <option value="Ready for Ship">🚚 Ready for Ship</option>
          </select>

          <input type="date" name="manufactureDate" value={formData.manufactureDate} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-green-300 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-black" />

          <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-green-300 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-black" />

          <button type="submit" disabled={loading}
            className="w-full py-3 mt-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 shadow-lg transition-all flex items-center justify-center gap-2">
            <FaRocket /> {loading ? 'Processing...' : 'Create Part with MetaMask'}
          </button>
        </form>
      </div>

      {producedParts.length > 0 && (
        <div className="max-w-5xl mx-auto mt-12 bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 shadow-xl rounded-2xl p-6 border border-purple-200">
          <h3 className="text-2xl font-semibold text-black mb-4">🧾 Produced Parts</h3>
          <table className="w-full text-left border border-purple-200">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="py-2 px-3">Part Name</th>
                <th className="py-2 px-3">Serial</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {producedParts.map((p, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-3 text-black">{p.partName}</td>
                  <td className="py-2 px-3 text-black">{p.serialBatch}</td>
                  <td className="py-2 px-3 text-black">{p.status}</td>
                  <td className="py-2 px-3 text-blue-600 underline">
                    <a href={`https://mumbai.polygonscan.com/tx/${p.txHash}`} target="_blank" rel="noopener noreferrer">
                      {p.txHash.slice(0, 10)}...
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PartsProductionSection;
