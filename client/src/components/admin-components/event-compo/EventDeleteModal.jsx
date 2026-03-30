import { FaTimes, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const EventDeleteModal = ({ isOpen, onClose, onConfirm, event, loading }) => {
  if (!isOpen || !event) return null;

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
                className="text-white hover:text-gray-200 transition-colors"
                disabled={loading}
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
                <p className="text-gray-900 font-semibold">Delete Event</p>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-3">
                Are you sure you want to delete this event?
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
                <div className="flex items-start gap-2">
                  <FaCalendarAlt className="text-orange-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <FaClock className="text-gray-400" />
                  <span>{event.date} • {event.time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDeleteModal;
