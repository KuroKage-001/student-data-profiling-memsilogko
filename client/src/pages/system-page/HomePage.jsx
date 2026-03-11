import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-black mb-4">CCS</h1>
          <h2 className="text-3xl font-semibold text-black mb-2">Comprehensive Profiling System</h2>
          <p className="text-xl text-gray-600">Advanced Student and Faculty Management Platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div 
            onClick={() => navigate('/admin/login')}
            className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-orange-600 transition-colors cursor-pointer group"
          >
            <div className="text-orange-600 text-6xl mb-4">🔐</div>
            <h3 className="text-2xl font-semibold text-black mb-2 group-hover:text-orange-600 transition-colors">
              Admin Portal
            </h3>
            <p className="text-gray-600">
              Access comprehensive student and faculty profiling tools, manage data, and generate reports.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-orange-600 transition-colors cursor-pointer group opacity-50">
            <div className="text-gray-400 text-6xl mb-4">👨‍🎓</div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
              Student Portal
            </h3>
            <p className="text-gray-400">
              Coming Soon - Student access to profiles, academic records, and personal information.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">
            Secure, comprehensive, and user-friendly profiling system
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>✓ Data Security</span>
            <span>✓ Real-time Updates</span>
            <span>✓ Comprehensive Reports</span>
            <span>✓ User-friendly Interface</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;