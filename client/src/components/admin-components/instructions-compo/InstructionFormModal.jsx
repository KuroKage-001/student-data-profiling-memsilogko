import { FaTimes, FaSpinner } from 'react-icons/fa';

const InstructionFormModal = ({ show, onClose, onSubmit, formData, onChange, isEditing, submitting }) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Instruction' : 'Add New Instruction'}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
          <div className="px-6 py-6 space-y-4">
            {/* Title */}
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
              placeholder="Enter instruction title"
            />
          </div>

          {/* Type & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select Type</option>
                <option value="syllabus">Syllabus</option>
                <option value="curriculum">Curriculum</option>
                <option value="lesson">Lesson Plan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="All Departments">All Departments</option>
              </select>
            </div>
          </div>

          {/* Course Code & Course Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Code
              </label>
              <input
                type="text"
                name="course_code"
                value={formData.course_code}
                onChange={onChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                placeholder="e.g., CS 101"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="course_name"
                value={formData.course_name}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                placeholder="Enter course name"
              />
            </div>
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instructor
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
              placeholder="Enter instructor name"
            />
          </div>

          {/* Academic Year & Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Academic Year
              </label>
              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                onChange={onChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                placeholder="e.g., 2024-2025"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={onChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select Semester</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Summer 2025">Summer 2025</option>
              </select>
            </div>
          </div>

          {/* Units & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Units
              </label>
              <input
                type="number"
                name="units"
                value={formData.units}
                onChange={onChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                placeholder="e.g., 3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all appearance-none"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all resize-none"
              placeholder="Enter instruction description"
            />
          </div>

          {/* Learning Outcomes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Learning Outcomes
            </label>
            <textarea
              name="learning_outcomes"
              value={formData.learning_outcomes}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all resize-none"
              placeholder="Enter learning outcomes"
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
              onClick={handleSubmit}
              className="flex-1 px-5 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Saving...
                </span>
              ) : (
                isEditing ? 'Update Instruction' : 'Create Instruction'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionFormModal;
