import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const InstructionsPage = () => {
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
      description: 'Complete syllabus for introductory programming course',
      last_updated: '2024-03-15'
    },
    {
      id: 2,
      title: 'CCS Curriculum Framework 2024',
      type: 'Curriculum',
      department: 'All Departments',
      semester: 'All',
      academic_year: '2024-2025',
      instructor: 'Academic Committee',
      status: 'Active',
      description: 'Updated curriculum framework for all CCS programs',
      last_updated: '2024-02-20'
    },
    {
      id: 3,
      title: 'Network Security Lab Manual',
      type: 'Lesson Plan',
      department: 'Information Technology',
      semester: 'Fall 2024',
      academic_year: '2024-2025',
      instructor: 'Dr. Maria Garcia',
      status: 'Active',
      description: 'Comprehensive lab exercises for network security course',
      last_updated: '2024-03-10'
    },
    {
      id: 4,
      title: 'Data Structures Assessment Guidelines',
      type: 'Assessment',
      department: 'Computer Science',
      semester: 'Spring 2024',
      academic_year: '2023-2024',
      instructor: 'Prof. David Chen',
      status: 'Archived',
      description: 'Assessment criteria and rubrics for data structures course',
      last_updated: '2024-01-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredInstructions = instructions.filter(instruction => {
    const matchesSearch = instruction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || instruction.type === filterType;
    const matchesDepartment = filterDepartment === 'All' || instruction.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || instruction.status === filterStatus;
    return matchesSearch && matchesType && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Syllabus': return '📋';
      case 'Curriculum': return '📚';
      case 'Lesson Plan': return '📝';
      case 'Assessment': return '📊';
      default: return '📄';
    }
  };

  const instructionTypes = ['Syllabus', 'Curriculum', 'Lesson Plan', 'Assessment'];
  const departments = ['Computer Science', 'Information Technology', 'Computer Engineering', 'Data Science', 'All Departments'];
  const statuses = ['Active', 'Draft', 'Under Review', 'Archived'];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Instructions Management</h1>
          <p className="text-gray-600">Syllabus, Curriculum, and Lesson Management</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search instructions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
          >
            <option value="All">All Types</option>
            {instructionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
          >
            <option value="All">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">
            + Add New Instruction
          </button>
        </div>

        {/* Instructions List */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instruction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstructions.map((instruction) => (
                  <tr key={instruction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">{getTypeIcon(instruction.type)}</div>
                        <div>
                          <div className="text-sm font-medium text-black">{instruction.title}</div>
                          <div className="text-sm text-gray-500">{instruction.description}</div>
                          <div className="text-xs text-gray-400 mt-1">Updated: {instruction.last_updated}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{instruction.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{instruction.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{instruction.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{instruction.academic_year}</div>
                      <div className="text-sm text-gray-500">{instruction.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(instruction.status)}`}>
                        {instruction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-orange-600 hover:text-orange-700 mr-3 transition-colors">
                        View
                      </button>
                      <button className="text-black hover:text-orange-600 mr-3 transition-colors">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInstructions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No instructions found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-black">{instructions.length}</div>
            <div className="text-sm text-gray-600">Total Instructions</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-600">{instructions.filter(i => i.status === 'Active').length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-600">{instructions.filter(i => i.type === 'Syllabus').length}</div>
            <div className="text-sm text-gray-600">Syllabi</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-600">{instructions.filter(i => i.type === 'Curriculum').length}</div>
            <div className="text-sm text-gray-600">Curricula</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructionsPage;
