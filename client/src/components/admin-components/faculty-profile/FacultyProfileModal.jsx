import { FaTimes } from 'react-icons/fa';

const FacultyProfileModal = ({ faculty, onClose }) => {
  if (!faculty) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">Faculty Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Photo and Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-32 h-32 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                  {faculty.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{faculty.name}</h3>
                <p className="text-gray-600 mb-1">{faculty.id}</p>
                <p className="text-gray-600 mb-1">{faculty.position}</p>
                <p className="text-gray-600">{faculty.department}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  {faculty.status}
                </span>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-black">{faculty.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                    <p className="text-black">{faculty.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Office</label>
                    <p className="text-black">{faculty.office}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                    <p className="text-black">{faculty.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
                    <p className="text-black">{faculty.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Specialization</label>
                    <p className="text-black">{faculty.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Hire Date</label>
                    <p className="text-black">{new Date(faculty.hireDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Current Courses */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Current Courses</h4>
                <div className="space-y-2">
                  {faculty.courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-black">{course}</span>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-black">Student Satisfaction</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '88%'}}></div>
                      </div>
                      <span className="text-black font-semibold">4.4/5.0</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Course Completion Rate</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                      </div>
                      <span className="text-black font-semibold">94%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Research Publications</span>
                    <div className="flex items-center">
                      <span className="text-black font-semibold">12 this year</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 border-2 border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors">
              Generate Report
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfileModal;