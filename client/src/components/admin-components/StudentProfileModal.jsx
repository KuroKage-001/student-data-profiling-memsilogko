const StudentProfileModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">Student Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Photo and Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-32 h-32 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{student.name}</h3>
                <p className="text-gray-600 mb-1">{student.id}</p>
                <p className="text-gray-600">{student.program}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  {student.status}
                </span>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-black">{student.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                    <p className="text-black">{student.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <p className="text-black">{student.address}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Program</label>
                    <p className="text-black">{student.program}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Year Level</label>
                    <p className="text-black">{student.year}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">GPA</label>
                    <p className="text-black font-semibold">{student.gpa}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Enrollment Date</label>
                    <p className="text-black">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Academic Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-black">Overall Performance</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-black font-semibold">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Attendance Rate</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                      <span className="text-black font-semibold">92%</span>
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

export default StudentProfileModal;