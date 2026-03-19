import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserGraduate } from 'react-icons/fa';

const PortalCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
      <div 
        onClick={() => navigate('/admin/login')}
        className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-orange-600 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
      >
        <div className="flex items-center mb-3">
          <div className="text-orange-600 text-2xl mr-3"><FaUserShield /></div>
          <h3 className="text-lg md:text-xl font-semibold text-black group-hover:text-orange-600 transition-colors">Admin Portal</h3>
        </div>
        <p className="text-gray-600 text-xs md:text-sm mb-3">
          Access comprehensive student and faculty profiling tools, manage data, and generate detailed reports.
        </p>
        <div className="flex items-center text-orange-600 text-xs font-medium">
          <span>Access Dashboard</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-5 cursor-not-allowed group opacity-60 shadow-sm">
        <div className="flex items-center mb-3">
          <div className="text-gray-400 text-2xl mr-3"><FaUserGraduate /></div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-400">Student Portal</h3>
        </div>
        <p className="text-gray-400 text-xs md:text-sm mb-3">
          Coming Soon - Student access to profiles, academic records, and personal information management.
        </p>
        <div className="flex items-center text-gray-400 text-xs font-medium">
          <span>Coming Soon</span>
          <span className="ml-2">⏳</span>
        </div>
      </div>
    </div>
  );
};

export default PortalCards;
