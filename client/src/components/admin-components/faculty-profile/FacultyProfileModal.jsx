import { FaTimes } from 'react-icons/fa';

const FacultyProfileModal = ({ faculty, onClose }) => {
  if (!faculty) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">Faculty Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Photo and Basic Info */}
            <div className="xl:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-orange-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold">
                  {faculty.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-1 sm:mb-2">{faculty.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{faculty.id}</p>
                <p className="text-sm text-gray-600 mb-1">{faculty.position}</p>
                <p className="text-sm text-gray-600 mb-2 sm:mb-0">{faculty.department}</p>
                <span className="inline-block mt-2 sm:mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-semibold rounded-full">
                  {faculty.status}
                </span>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Contact Information */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-sm sm:text-base text-black break-all">{faculty.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Phone</label>
                    <p className="text-sm sm:text-base text-black">{faculty.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Office</label>
                    <p className="text-sm sm:text-base text-black">{faculty.office}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">Professional Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Department</label>
                    <p className="text-sm sm:text-base text-black">{faculty.department}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Position</label>
                    <p className="text-sm sm:text-base text-black">{faculty.position}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Specialization</label>
                    <p className="text-sm sm:text-base text-black">{faculty.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Hire Date</label>
                    <p className="text-sm sm:text-base text-black">{new Date(faculty.hireDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Current Courses */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">Current Courses</h4>
                <div className="space-y-2 sm:space-y-3">
                  {faculty.courses.map((course, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-1 sm:space-y-0">
                      <span className="text-sm sm:text-base text-black">{course}</span>
                      <span className="text-xs sm:text-sm text-gray-600">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">Performance Metrics</h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <span className="text-sm sm:text-base text-black">Student Satisfaction</span>
                    <div className="flex items-center">
                      <div className="w-full sm:w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '88%'}}></div>
                      </div>
                      <span className="text-sm sm:text-base text-black font-semibold whitespace-nowrap">4.4/5.0</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <span className="text-sm sm:text-base text-black">Course Completion Rate</span>
                    <div className="flex items-center">
                      <div className="w-full sm:w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                      </div>
                      <span className="text-sm sm:text-base text-black font-semibold whitespace-nowrap">94%</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <span className="text-sm sm:text-base text-black">Research Publications</span>
                    <div className="flex items-center">
                      <span className="text-sm sm:text-base text-black font-semibold">12 this year</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="w-full sm:w-auto px-4 py-2 border-2 border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
              Generate Report
            </button>
            <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfileModal;