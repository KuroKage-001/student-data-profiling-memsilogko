import { useState } from 'react';
import AdminLayout from '../../components/admin-components/AdminLayout';

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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">College Research</h1>
          <p className="text-gray-600">Research project management and academic publications</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search research materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
          />
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
          >
            <option value="All">All Types</option>
            {researchTypes.map(type => (
              <option key={type} value={type}>{type}</option>
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
            + Add New Research
          </button>
        </div>

        {/* Research Materials List */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Research
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
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
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{material.title}</div>
                        <div className="text-sm text-gray-500">{material.description}</div>
                        <div className="text-xs text-gray-400 mt-1">Keywords: {material.keywords}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{material.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{material.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{material.research_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{material.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(material.status)}`}>
                        {material.status}
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
          
          {filteredMaterials.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No research materials found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Research Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-black">{materials.length}</div>
            <div className="text-sm text-gray-600">Total Research</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-600">{materials.filter(m => m.status === 'Published').length}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-600">{materials.filter(m => m.status === 'Under Review').length}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-600">{materials.filter(m => m.status === 'Draft').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Research;