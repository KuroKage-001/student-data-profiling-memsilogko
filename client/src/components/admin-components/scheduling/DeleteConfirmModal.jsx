import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmModal = ({ section, onClose, onConfirm, loading }) => {
  if (!section) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with blur */}
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full relative z-10">
          {/* Header */}
          <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold">Delete Class Section</p>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-3">
                Are you sure you want to delete this class section?
              </p>
              <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gray-500">Course:</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">{section.course_code} - {section.course_name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gray-500">Section:</span>
                  <span className="text-sm text-gray-900">{section.section_code}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gray-500">Schedule:</span>
                  <span className="text-sm text-gray-900 text-right">{section.day_of_week} {section.start_time} - {section.end_time}</span>
                </div>
                {section.instructor && (
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-gray-500">Instructor:</span>
                    <span className="text-sm text-gray-900">{section.instructor}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
              <div className="flex gap-2">
                <FaExclamationTriangle className="text-yellow-600 text-sm mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-700">
                  All associated data will be permanently deleted. This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all font-semibold shadow-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-5 py-3 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete Section'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
