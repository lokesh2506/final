import React from 'react';
import { FaCogs, FaDollarSign } from 'react-icons/fa';

const HomeSection = ({ stats }) => {
  const metrics = [
    {
      metric: 'Total Parts Produced',
      value: stats.totalPartsProduced || 0,
      unit: 'parts',
      icon: <FaCogs className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-blue-100',
    },
    {
      metric: 'Total Transactions',
      value: stats.totalTransactions || 0,
      unit: 'transactions',
      icon: <FaDollarSign className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50',
      iconBgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="home-section py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {metrics.map((item, index) => (
            <div
              key={index}
              className={`relative ${item.bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 w-full max-w-md`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${item.iconBgColor} rounded-full flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.metric}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-extrabold text-gray-900">{item.value}</p>
                    <span className="text-sm text-gray-500">{item.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
