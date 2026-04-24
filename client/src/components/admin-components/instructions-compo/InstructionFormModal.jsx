import { FaTimes } from 'react-icons/fa';

const InstructionFormModal = ({ show, onClose, onSubmit, formData, onChange, isEditing, submitting }) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Edit Instruction' : 'Add New Instruction'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
              placeholder="Enter learning outcomes"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructionFormModal;
