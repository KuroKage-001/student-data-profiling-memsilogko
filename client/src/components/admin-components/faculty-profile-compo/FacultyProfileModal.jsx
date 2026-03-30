import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaBriefcase, FaGraduationCap, FaCalendarAlt, FaStickyNote, FaIdCard, FaFileAlt } from 'react-icons/fa';

const FacultyProfileModal = ({ faculty, onClose, onEdit, onGenerateReport }) => {
  if (!faculty) return null;

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'active';
    switch (statusLower) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'F';
  };

  const handleGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport(faculty);
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
            <h3 className="text-xl font-bold text-white">
              Faculty Profile
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
                    {getInitials(faculty.name)}
                  </div>
                  
                  {/* Name and ID */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{faculty.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{faculty.faculty_id || faculty.id}</p>
                  
                  {/* Status Badge */}
                  <div className="flex justify-center mb-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(faculty.status)}`}>
                      {faculty.status ? faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1) : 'Active'}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="text-center">
                        <div className="text-base font-bold text-gray-900 truncate">{faculty.position || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">Position</div>
                      </div>
                      <div className="text-center border-t border-gray-200 pt-3">
                        <div className="text-base font-bold text-gray-900 truncate">{faculty.department || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">Department</div>
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
                        <p className="text-sm text-gray-900 font-semibold truncate">{faculty.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaPhone className="text-green-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                        <p className="text-sm text-gray-900 font-semibold">{faculty.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaMapMarkerAlt className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Address</p>
                        <p className="text-sm text-gray-900 font-semibold">{faculty.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FaBriefcase className="text-indigo-600 text-xs" />
                    </div>
                    Professional Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaBuilding className="text-indigo-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Department</p>
                        <p className="text-sm text-gray-900 font-semibold">{faculty.department || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaBriefcase className="text-purple-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Position</p>
                        <p className="text-sm text-gray-900 font-semibold">{faculty.position || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaGraduationCap className="text-orange-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Specialization</p>
                        <p className="text-sm text-gray-900 font-semibold">{faculty.specialization || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaMapMarkerAlt className="text-teal-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Office</p>
                        <p className="text-sm text-gray-900 font-semibold">{faculty.office || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaCalendarAlt className="text-cyan-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Hire Date</p>
                        <p className="text-sm text-gray-900 font-semibold">{formatDate(faculty.hire_date || faculty.hireDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                        <FaIdCard className="text-emerald-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Status</p>
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(faculty.status)}`}>
                          {faculty.status ? faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1) : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {faculty.notes && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
                    <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FaStickyNote className="text-gray-600 text-xs" />
                      </div>
                      Additional Notes
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{faculty.notes}</p>
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
                onClick={() => onEdit(faculty)}
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

export default FacultyProfileModal;
