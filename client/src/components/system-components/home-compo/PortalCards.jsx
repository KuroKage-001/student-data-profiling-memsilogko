import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

const PortalCards = () => {
  const navigate = useNavigate();

  const portals = [
    {
      path: '/admin/portal',
      icon: <FaUserShield />,
      title: 'Admin Portal',
      description: 'System administration, user management, and comprehensive oversight of all platform operations.',
      color: 'orange',
      label: 'Access Dashboard'
    },
    {
      path: '/faculty/portal',
      icon: <FaChalkboardTeacher />,
      title: 'Faculty Portal',
      description: 'Faculty and Department Chair access to student profiling, academic management, and reporting tools.',
      color: 'blue',
      label: 'Access Portal'
    },
    {
      path: '/student/portal',
      icon: <FaUserGraduate />,
      title: 'Student Portal',
      description: 'Student access to profiles, academic records, and personal information management.',
      color: 'green',
      label: 'Access Portal'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-6">
      {portals.map((portal, index) => (
        <div 
          key={index}
          onClick={() => navigate(portal.path)}
          className={`bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-${portal.color}-600 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md`}
        >
          <div className="flex items-center mb-3">
            <div className={`text-${portal.color}-600 text-2xl mr-3`}>{portal.icon}</div>
            <h3 className={`text-lg md:text-xl font-semibold text-black group-hover:text-${portal.color}-600 transition-colors`}>
              {portal.title}
            </h3>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-3">
            {portal.description}
          </p>
          <div className={`flex items-center text-${portal.color}-600 text-xs font-medium`}>
            <span>{portal.label}</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortalCards;
