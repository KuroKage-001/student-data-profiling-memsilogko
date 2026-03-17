import { FaShieldAlt, FaClock, FaChartBar, FaDesktop } from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    { icon: FaShieldAlt, title: 'Data Security', desc: 'Advanced encryption and secure data handling' },
    { icon: FaClock, title: 'Real-time Updates', desc: 'Instant data synchronization and updates' },
    { icon: FaChartBar, title: 'Comprehensive Reports', desc: 'Detailed analytics and reporting tools' },
    { icon: FaDesktop, title: 'User-friendly Interface', desc: 'Intuitive design for seamless navigation' }
  ];

  return (
    <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
      <h3 className="text-base md:text-lg font-semibold text-black mb-4 text-center">
        System Features & Benefits
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, idx) => (
          <div key={idx} className="text-center">
            <div className="text-orange-600 text-xl md:text-2xl mb-2 flex justify-center">
              <feature.icon />
            </div>
            <h4 className="font-semibold text-black mb-1 text-sm">{feature.title}</h4>
            <p className="text-gray-600 text-xs">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
