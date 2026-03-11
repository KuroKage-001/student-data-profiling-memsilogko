import { useState } from 'react';

function InstructionsPage() {
  const [instructions, setInstructions] = useState([
    {
      id: 1,
      title: 'CS 101 - Introduction to Programming Syllabus',
      type: 'Syllabus',
      department: 'Computer Science',
      semester: 'Fall 2024',
      academic_year: '2024-2025',
      instructor: 'Dr. Robert Anderson',
      status: 'Active',
      description: 'Complete syllabus for introductory programming course'
    },
    {
      id: 2,
      title: 'Network Security Lab Manual',
      type: 'Lesson Plan',
      department: 'Information Technology',
      semester: 'Fall 2024',
      academic_year: '2024-2025',
      instructor: 'Dr. Maria Garcia',
      status: 'Active',
      description: 'Comprehensive lab exercises for network security course'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredInstructions = instructions.filter(instruction => {
    const matchesSearch = instruction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || instruction.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Instructions</h1>
        <p className="text-gray-600">Manage syllabus, curriculum, and lessons for CCS</p>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search instructions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
        >
          <option value="">All Types</option>
          <option value="Syllabus">Syllabus</option>
          <option value="Curriculum">Curriculum</option>
          <option value="Lesson Plan">Lesson Plan</option>
          <option value="Assessment">Assessment</option>
        </select>
      </div>

      <div className="mb-4">
        <button className="bg-orange-800 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          + Add New Instruction
        </button>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructions.map((instruction) => (
                <tr key={instruction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-black">{instruction.title}</div>
                    <div className="text-sm text-gray-500">{instruction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{instruction.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{instruction.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{instruction.instructor}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      instruction.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {instruction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-700 mr-3">View</button>
                    <button className="text-black hover:text-orange-600 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InstructionsPage;
