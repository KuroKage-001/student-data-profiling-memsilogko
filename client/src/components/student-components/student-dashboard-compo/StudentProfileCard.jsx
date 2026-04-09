import { useAuth } from '../../../context/AuthContext';
import { FaUser, FaEnvelope, FaIdCard, FaGraduationCap } from 'react-icons/fa';

const StudentProfileCard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <FaUser className="text-white text-2xl sm:text-3xl" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.name || 'Student'}</h3>
          <p className="text-sm text-gray-600">{user?.role === 'student' ? 'Student' : user?.role}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <FaEnvelope className="text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">{user?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <FaIdCard className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Student ID</p>
            <p className="text-sm font-medium">{user?.student_id || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Program</p>
            <p className="text-sm font-medium">{user?.program || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;
