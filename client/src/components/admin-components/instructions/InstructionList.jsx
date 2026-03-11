import { useState } from 'react';

function InstructionList({ instructions, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this instruction?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/instructions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete();
      } else {
        alert('Failed to delete instruction');
      }
    } catch (error) {
      console.error('Error deleting instruction:', error);
      alert('Error deleting instruction');
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'syllabus': return 'bg-blue-100 text-blue-800';
      case 'curriculum': return 'bg-green-100 text-green-800';
      case 'lesson': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (instructions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No instructions</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new instruction.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {instructions.map((instruction) => (
        <div key={instruction.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${getTypeColor(instruction.type)}`}>
                  {instruction.type.charAt(0).toUpperCase() + instruction.type.slice(1)}
                </span>
                <h3 className="text-xl font-semibold text-gray-800 flex-1">{instruction.title}</h3>
              </div>
              
              {instruction.description && (
                <p className="text-gray-600 mb-3">{instruction.description}</p>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Course:</span> {instruction.course_code ? `${instruction.course_code} - ` : ''}{instruction.course_name}
                </div>
                <div>
                  <span className="font-medium">Department:</span> {instruction.department}
                </div>
                {instruction.instructor && (
                  <div>
                    <span className="font-medium">Instructor:</span> {instruction.instructor}
                  </div>
                )}
                {instruction.semester && (
                  <div>
                    <span className="font-medium">Semester:</span> {instruction.semester}
                  </div>
                )}
                {instruction.academic_year && (
                  <div>
                    <span className="font-medium">A.Y.:</span> {instruction.academic_year}
                  </div>
                )}
                {instruction.units && (
                  <div>
                    <span className="font-medium">Units:</span> {instruction.units}
                  </div>
                )}
              </div>

              {instruction.topics && instruction.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {instruction.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              {instruction.file_url && (
                <div className="mt-3">
                  <a
                    href={`http://127.0.0.1:8000${instruction.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download File
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(instruction)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(instruction.id)}
                disabled={deletingId === instruction.id}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete"
              >
                {deletingId === instruction.id ? (
                  <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InstructionList;
