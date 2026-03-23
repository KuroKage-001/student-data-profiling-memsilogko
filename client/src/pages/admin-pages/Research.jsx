import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import usePageTitle from '../../hooks/usePageTitle';
import { FaFlask, FaSearch, FaPlus, FaChartBar, FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';

const Research = () => {
  usePageTitle('Research');
  
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: 'Machine Learning Applications in Healthcare',
      author: 'Dr. Robert Anderson',
      department: 'Computer Science',
      research_type: 'Journal Article',
      year: '2024',
      status: 'Published',
      description: 'Comprehensive study on ML applications in medical diagnosis',
      keywords: 'machine learning, healthcare, AI, diagnosis'
    },
    {
      id: 2,
      title: 'Cybersecurity Framework for Educational Institutions',
      author: 'Dr. Maria Garcia',
      department: 'Information Technology',
      research_type: 'Conference Paper',
      year: '2024',
      status: 'Under Review',
      description: 'Security framework designed specifically for academic environments',
      keywords: 'cybersecurity, education, framework, security'
    },
    {
      id: 3,
      title: 'IoT Systems in Smart Campus Development',
      author: 'Prof. David Chen',
      department: 'Computer Engineering',
      research_type: 'Research Project',
      year: '2023',
      status: 'Published',
      description: 'Implementation of IoT technologies for smart campus infrastructure',
      keywords: 'IoT, smart campus, embedded systems, automation'
    },
    {
      id: 4,
      title: 'Statistical Analysis of Student Performance Data',
      author: 'Dr. Lisa Thompson',
      department: 'Data Science',
      research_type: 'Technical Report',
      year: '2024',
      status: 'Draft',
      description: 'Advanced statistical methods for analyzing academic performance trends',
      keywords: 'statistics, data analysis, education, performance'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.keywords.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'All' || material.department === filterDepartment;
    const matchesType = filterType === 'All' || material.research_type === filterType;
    const matchesStatus = filterStatus === 'All' || material.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const departments = ['Computer Science', 'Information Technology', 'Computer Engineering', 'Data Science'];
  const researchTypes = ['Journal Article', 'Conference Paper', 'Research Project', 'Technical Report', 'Thesis'];
  const statuses = ['Published', 'Under Review', 'Draft', 'Rejected'];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section with Enhanced Design */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaFlask className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                College Research
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-16 font-medium">
            Research project management and academic publications
          </p>
        </div>

        {/* Research Stats - Enhanced Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{materials.length}</div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-gray-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Research</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{materials.filter(m => m.status === 'Published').length}</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Published</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{materials.filter(m => m.status === 'Under Review').length}</div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Under Review</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{materials.filter(m => m.status === 'Draft').length}</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-blue-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">In Progress</div>
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
                placeholder="Search research materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md"
            >
              <option value="All">All Types</option>
              {researchTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
            <span className="relative z-10">Add New Research</span>
          </button>
        </div>

        {/* Research Materials List - Enhanced Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Research
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Author
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Department
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Year
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
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{material.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">{material.description}</div>
                        <div className="text-xs text-gray-400 mt-1">Keywords: {material.keywords}</div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          {material.author} • {material.department} • {material.research_type} • {material.year}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-black">{material.author}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-black">{material.department}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-black">{material.research_type}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-black">{material.year}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(material.status)}`}>
                        {material.status}
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
          
          {filteredMaterials.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">No research materials found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Research;