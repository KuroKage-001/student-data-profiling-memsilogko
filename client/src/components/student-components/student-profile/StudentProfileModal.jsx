import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaCalendar, FaUserFriends, FaFileAlt } from 'react-icons/fa';
import { generateStudentPDF } from '../../../utils/admin-utilities/pdfGenerator';

const StudentProfileModal = ({ student, onClose, onEdit, onGenerateReport }) => {
  if (!student) return null;

  // Helper functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'suspended':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  // Handle generate report
  const handleGenerateReport = async () => {
    if (onGenerateReport) {
      onGenerateReport(student);
    } else {
      try {
        await generateStudentPDF(student);
      } catch (error) {
        alert('Failed to generate PDF report');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal panel - Optimized for full space usage */}
      <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header - Minimal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Student Profile
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 bg-gray-50">
          <div className="p-4 sm:p-6">
            {/* Student Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-semibold shrink-0">
                  {getInitials(student.name)}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{student.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{student.student_id || student.id}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${getStatusColor(student.status)}`}>
                      {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'N/A'}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-500">GPA:</span>
                      <span className="font-semibold text-orange-600">{formatGPA(student.gpa)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-500">Year:</span>
                      <span className="font-semibold text-gray-900">{student.year_level || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Grid - 3 columns on large screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Personal Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FaEnvelope className="text-gray-400 text-sm mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900 truncate">{student.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaPhone className="text-gray-400 text-sm mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{student.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gray-400 text-sm mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">{student.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  Academic Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FaGraduationCap className="text-gray-400 text-sm mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Program</p>
                      <p className="text-sm text-gray-900">{student.program || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaUser className="text-gray-400 text-sm mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Year Level</p>
                      <p className="text-sm text-gray-900">{student.year_level || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaCalendar className="text-gray-400 text-sm mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Enrollment</p>
                      <p className="text-sm text-gray-900">{formatDate(student.enrollment_date)}</p>
                    </div>
                  </div>

                  {student.graduation_date && (
                    <div className="flex items-start gap-2">
                      <FaCalendar className="text-gray-400 text-sm mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Expected Graduation</p>
                        <p className="text-sm text-gray-900">{formatDate(student.graduation_date)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Guardian Information */}
              {(student.guardian_name || student.guardian_phone) && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                    Guardian Information
                  </h4>
                  <div className="space-y-3">
                    {student.guardian_name && (
                      <div className="flex items-start gap-2">
                        <FaUserFriends className="text-gray-400 text-sm mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="text-sm text-gray-900">{student.guardian_name}</p>
                        </div>
                      </div>
                    )}

                    {student.guardian_phone && (
                      <div className="flex items-start gap-2">
                        <FaPhone className="text-gray-400 text-sm mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm text-gray-900">{student.guardian_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {student.skills && (
                <div className="bg-white border border-orange-200 rounded-lg overflow-hidden lg:col-span-3">
                  <div className="bg-orange-50 px-4 py-2 border-b border-orange-200">
                    <h4 className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                      Skills & Competencies
                    </h4>
                  </div>
                  <div className="p-4 border-l-2 border-orange-600">
                    <p className="text-sm text-gray-700 leading-relaxed">{student.skills}</p>
                  </div>
                </div>
              )}

              {/* Activities */}
              {student.extracurricular_activities && (
                <div className="bg-white border border-orange-200 rounded-lg overflow-hidden lg:col-span-3">
                  <div className="bg-orange-50 px-4 py-2 border-b border-orange-200">
                    <h4 className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                      Extracurricular Activities
                    </h4>
                  </div>
                  <div className="p-4 border-l-2 border-orange-600">
                    <p className="text-sm text-gray-700 leading-relaxed">{student.extracurricular_activities}</p>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {student.notes && (
                <div className="bg-white border border-orange-200 rounded-lg overflow-hidden lg:col-span-3">
                  <div className="bg-orange-50 px-4 py-2 border-b border-orange-200">
                    <h4 className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                      Additional Notes
                    </h4>
                  </div>
                  <div className="p-4 border-l-2 border-orange-600">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{student.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 shrink-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleGenerateReport}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
            >
              <FaFileAlt className="text-sm" />
              <span>Generate Report</span>
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(student)}
                className="flex-1 px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
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