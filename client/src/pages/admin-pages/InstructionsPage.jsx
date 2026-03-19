import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FaBook, FaSearch, FaPlus, FaChartBar, FaCheckCircle, FaClipboardList, FaGraduationCap } from 'react-icons/fa';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section with Enhanced Design */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBook className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Instructions Management
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-16 font-medium">
            Syllabus, Curriculum, and Lesson Management
          </p>
        </div>

        {/* Quick Stats - Enhanced Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{instructions.length}</div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-gray-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Instructions</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{instructions.filter(i => i.status === 'Active').length}</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Active</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{instructions.filter(i => i.type === 'Syllabus').length}</div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClipboardList className="text-yellow-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Syllabi</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{instructions.filter(i => i.type === 'Curriculum').length}</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaGraduationCap className="text-blue-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Curricula</div>
          </div>
        </div>

        {/* Search and Filters - Enhanced Design */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch className="text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search instructions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md"
            >
              <option value="All">All Types</option>
              {instructionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md"
            >
              <option value="All">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <button className="group relative bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden w-full sm:w-auto">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <FaPlus className="text-sm relative z-10" />
            <span className="relative z-10">Add New Instruction</span>
          </button>
        </div>

        {/* Instructions List - Enhanced Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instruction
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Department
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Instructor
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Academic Year
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstructions.map((instruction) => (
                  <tr key={instruction.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-start">
                        <div className="text-lg sm:text-2xl mr-2 sm:mr-3">{getTypeIcon(instruction.type)}</div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-black">{instruction.title}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">{instruction.description}</div>
                          <div className="text-xs text-gray-400 mt-1">Updated: {instruction.last_updated}</div>
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {instruction.type} • {instruction.department} • {instruction.instructor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-black">{instruction.type}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-black">{instruction.department}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-black">{instruction.instructor}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-black">{instruction.academic_year}</div>
                      <div className="text-sm text-gray-500">{instruction.semester}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(instruction.status)}`}>
                        {instruction.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                        <button className="text-orange-600 hover:text-orange-700 transition-colors text-xs sm:text-sm">
                          View
                        </button>
                        <button className="text-black hover:text-orange-600 transition-colors text-xs sm:text-sm">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 transition-colors text-xs sm:text-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInstructions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">No instructions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructionsPage;
