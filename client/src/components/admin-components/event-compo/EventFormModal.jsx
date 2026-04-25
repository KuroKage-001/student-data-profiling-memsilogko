import { FaTimes, FaSpinner } from 'react-icons/fa';

const EventFormModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  editingEvent, 
  submitting 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
              disabled={submitting}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form - Scrollable with custom scrollbar */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                placeholder="Enter event title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChange}
                required
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                placeholder="Enter location"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={onChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                >
                  <option value="Academic">Academic</option>
                  <option value="Professional">Professional</option>
                  <option value="Competition">Competition</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
              <input
                type="number"
                name="attendees"
                value={formData.attendees}
                onChange={onChange}
                min="0"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all resize-none"
                placeholder="Enter event description"
              />
            </div>
          </div>
        </form>

        {/* Action Buttons - Fixed at bottom */}
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-gray-100 border-t border-gray-200 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all font-semibold shadow-sm"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onSubmit}
              className="flex-1 px-5 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Saving...
                </span>
              ) : (
                editingEvent ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFormModal;
