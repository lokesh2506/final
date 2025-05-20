import React, { useState, useEffect } from 'react';
import { FaBuilding, FaSearch, FaFileAlt, FaExclamationTriangle, FaCalendar } from 'react-icons/fa';

const HomeSection = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const iconMap = {
    'Total Entities Monitored': <FaBuilding className="w-6 h-6 text-blue-600" />,
    'Total Inspections Conducted': <FaSearch className="w-6 h-6 text-purple-600" />,
    'Total Certifications Issued': <FaFileAlt className="w-6 h-6 text-green-600" />,
    'Violation Records': <FaExclamationTriangle className="w-6 h-6 text-orange-600" />,
    'Upcoming Audits': <FaCalendar className="w-6 h-6 text-teal-600" />,
  };

  const colorMap = {
    'Total Entities Monitored': { bgColor: 'blue-50', iconBgColor: 'blue-100' },
    'Total Inspections Conducted': { bgColor: 'purple-50', iconBgColor: 'purple-100' },
    'Total Certifications Issued': { bgColor: 'green-50', iconBgColor: 'green-100' },
    'Violation Records': { bgColor: 'orange-50', iconBgColor: 'orange-100' },
    'Upcoming Audits': { bgColor: 'teal-50', iconBgColor: 'teal-100' },
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        const enrichedData = data.map(item => ({
          ...item,
          icon: iconMap[item.metric] || <FaBuilding className="w-6 h-6 text-blue-600" />,
          ...colorMap[item.metric],
        }));
        setMetrics(enrichedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-section py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          {Array.from({ length: Math.ceil(metrics.length / 2) }, (_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-6">
              {metrics.slice(rowIndex * 2, (rowIndex + 1) * 2).map((item, index) => (
                <div
                  key={index}
                  className={`relative bg-${item.bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 w-[calc(50%-0.75rem)] min-w-[300px]`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${item.iconBgColor} rounded-full flex items-center justify-center`}>
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
              {metrics.slice(rowIndex * 2, (rowIndex + 1) * 2).length === 1 && (
                <div className="w-[calc(50%-0.75rem)] min-w-[300px]"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSection;