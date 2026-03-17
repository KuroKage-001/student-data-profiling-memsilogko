import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const Research = () => {
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
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">College Research</h1>
          <p className="text-sm sm:text-base text-gray-600">Research project management and academic publications</p>
        </div>

        {/* Research Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-black">{materials.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Research</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{materials.filter(m => m.status === 'Published').length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{materials.filter(m => m.status === 'Under Review').length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{materials.filter(m => m.status === 'Draft').length}</div>
            <div className="text-xs sm:text-sm text-gray-600">In Progress</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Search research materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base"
          />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base"
          >
            <option value="All">All Types</option>
            {researchTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base"
          >
            <option value="All">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 sm:mb-6">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium w-full sm:w-auto">
            + Add New Research
          </button>
        </div>

        {/* Research Materials List */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden mb-6 sm:mb-8">
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