import { useStudentAcademicRecords } from '../../../hooks/student-dashboard-hook';
import { FaBook, FaCheckCircle } from 'react-icons/fa';
import { calculateCompletionPercentage } from '../../../utils/student-utilities/student-dashboard-utils';

const AcademicProgress = () => {
  const { data: academicData, isLoading, isError } = useStudentAcademicRecords();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
        <p className="text-red-600 text-center">Failed to load academic progress</p>
      </div>
    );
  }

  const totalUnits = academicData?.total_units || 0;
  const completedUnits = academicData?.completed_units || 0;
  const progressPercentage = calculateCompletionPercentage(completedUnits, totalUnits);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <FaBook className="text-orange-600 text-xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Academic Progress</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Course Completion</span>
            <span className="text-sm font-bold text-orange-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-linear-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{completedUnits}</p>
            <p className="text-xs text-gray-600">Units Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
            <p className="text-xs text-gray-600">Total Units</p>
          </div>
        </div>

        {academicData?.current_semester && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <FaCheckCircle className="text-green-600" />
            <p className="text-sm text-gray-700">
              Currently enrolled in <span className="font-semibold">{academicData.current_semester}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicProgress;
