import { FaTimes, FaUser, FaEnvelope, FaIdCard, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaCalendar, FaUserFriends, FaChartLine, FaFileAlt, FaTrophy, FaRunning } from 'react-icons/fa';

const StudentProfileModal = ({ student, onClose, onEdit, onGenerateReport }) => {
  if (!student) return null;

  // Helper functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatGPA = (gpa) => {
    if (!gpa && gpa !== 0) return 'N/A';
    const gpaNumber = parseFloat(gpa);
    if (isNaN(gpaNumber)) return 'N/A';
    return gpaNumber.toFixed(2);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Calculate performance percentage from GPA
  const calculatePerformance = (gpa) => {
    if (!gpa) return 0;
    const gpaValue = parseFloat(gpa) || 0;
    return Math.min(100, (gpaValue / 4.0) * 100);
  };

  const performancePercentage = calculatePerformance(student.gpa);

  // Handle generate report
  const handleGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport(student);
    } else {
      // Default behavior: Generate a simple text report
      const report = `
STUDENT PROFILE REPORT
=====================

Personal Information:
- Name: ${student.name}
- Student ID: ${student.student_id || student.id}
- Email: ${student.email || 'N/A'}
- Phone: ${student.phone || 'N/A'}
- Address: ${student.address || 'N/A'}

Academic Information:
- Program: ${student.program || 'N/A'}
- Year Level: ${student.year_level || 'N/A'}
- GPA: ${formatGPA(student.gpa)}
- Status: ${student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'N/A'}
- Enrollment Date: ${formatDate(student.enrollment_date)}
- Expected Graduation: ${formatDate(student.graduation_date)}

Guardian Information:
- Guardian Name: ${student.guardian_name || 'N/A'}
- Guardian Phone: ${student.guardian_phone || 'N/A'}

Skills & Activities:
- Skills: ${student.skills || 'N/A'}
- Extracurricular Activities: ${student.extracurricular_activities || 'N/A'}

Additional Notes:
${student.notes || 'No additional notes'}

Generated on: ${new Date().toLocaleString()}
      `.trim();

      // Create a blob and download
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_report_${student.student_id || student.id}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal panel - Optimized size */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FaUser className="text-lg" />
              Student Profile
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable with custom scrollbar */}
        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1 flex items-start justify-center">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center w-full">
                  {/* Profile Avatar */}
                  <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
                    {getInitials(student.name)}
                  </div>
                  
                  {/* Name and ID */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{student.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{student.student_id || student.id}</p>
                  
                  {/* Status Badge */}
                  <div className="flex justify-center mb-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'N/A'}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{formatGPA(student.gpa)}</div>
                        <div className="text-xs text-gray-500 mt-1">GPA</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{student.year_level || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">Year Level</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Information Cards */}
              <div className="lg:col-span-2 space-y-4">
                {/* Personal Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FaUser className="text-orange-600 text-xs" />
                    </div>
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaEnvelope className="text-blue-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Email Address</p>
                        <p className="text-sm text-gray-900 font-semibold truncate">{student.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaPhone className="text-green-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                        <p className="text-sm text-gray-900 font-semibold">{student.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaMapMarkerAlt className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Address</p>
                        <p className="text-sm text-gray-900 font-semibold">{student.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FaGraduationCap className="text-indigo-600 text-xs" />
                    </div>
                    Academic Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaGraduationCap className="text-indigo-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Program</p>
                        <p className="text-sm text-gray-900 font-semibold">{student.program || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaIdCard className="text-purple-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Year Level</p>
                        <p className="text-sm text-gray-900 font-semibold">{student.year_level || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaChartLine className="text-orange-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">GPA</p>
                        <p className="text-sm text-gray-900 font-semibold">{formatGPA(student.gpa)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaCalendar className="text-teal-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Enrollment Date</p>
                        <p className="text-sm text-gray-900 font-semibold">{formatDate(student.enrollment_date)}</p>
                      </div>
                    </div>

                    {student.graduation_date && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                          <FaCalendar className="text-cyan-600 text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Expected Graduation</p>
                          <p className="text-sm text-gray-900 font-semibold">{formatDate(student.graduation_date)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaIdCard className="text-emerald-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Status</p>
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                          {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                {(student.guardian_name || student.guardian_phone) && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                        <FaUserFriends className="text-amber-600 text-xs" />
                      </div>
                      Guardian Information
                    </h4>
                    <div className="space-y-3">
                      {student.guardian_name && (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                            <FaUserFriends className="text-amber-600 text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Guardian Name</p>
                            <p className="text-sm text-gray-900 font-semibold">{student.guardian_name}</p>
                          </div>
                        </div>
                      )}

                      {student.guardian_phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center shrink-0">
                            <FaPhone className="text-yellow-600 text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Guardian Phone</p>
                            <p className="text-sm text-gray-900 font-semibold">{student.guardian_phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Activities */}
                {(student.skills || student.extracurricular_activities) && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FaTrophy className="text-purple-600 text-xs" />
                      </div>
                      Skills & Activities
                    </h4>
                    <div className="space-y-4">
                      {student.skills && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                              <FaTrophy className="text-purple-600 text-xs" />
                            </div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Skills</p>
                          </div>
                          <p className="text-sm text-gray-900 leading-relaxed pl-9">{student.skills}</p>
                        </div>
                      )}

                      {student.extracurricular_activities && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                              <FaRunning className="text-blue-600 text-xs" />
                            </div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Extracurricular Activities</p>
                          </div>
                          <p className="text-sm text-gray-900 leading-relaxed pl-9">{student.extracurricular_activities}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {student.notes && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
                    <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FaChartLine className="text-gray-600 text-xs" />
                      </div>
                      Additional Notes
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{student.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGenerateReport}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all font-semibold flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              <FaFileAlt className="text-base" />
              <span>Generate Report</span>
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(student)}
                className="flex-1 px-4 py-2.5 border-2 border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 hover:border-orange-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all font-semibold shadow-md hover:shadow-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;