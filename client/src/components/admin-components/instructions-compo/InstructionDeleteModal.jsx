import { FaExclamationTriangle } from 'react-icons/fa';

const InstructionDeleteModal = ({ isOpen, onClose, onConfirm, instruction, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-2xl flex items-center gap-3">
          <FaExclamationTriangle className="text-2xl" />
          <h2 className="text-xl font-bold">Confirm Delete</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this instruction?
          </p>
          {instruction && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="font-semibold text-gray-900">{instruction.title}</p>
              <p className="text-sm text-gray-600 mt-1">{instruction.type} • {instruction.department}</p>
            </div>
          )}
          <p className="text-sm text-red-600 font-medium">
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionDeleteModal;
