import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

function CollegeResearchPage() {
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
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || material.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">College Research Library</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage research materials for CCS faculty</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
          <input
            type="text"
            placeholder="Search research materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base"
          />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base min-w-0"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Data Science">Data Science</option>
          </select>
        </div>
        
        <button className="bg-orange-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base font-medium w-full lg:w-auto">
          + Add New Research
        </button>
      </div>

      {/* Research Materials Table */}
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-4 xl:px-6 py-4">
                    <div className="text-sm font-medium text-black">{material.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{material.description}</div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-black">{material.author}</td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-black">{material.department}</td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-black">{material.research_type}</td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      material.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {material.status}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col xl:flex-row xl:space-x-3 space-y-1 xl:space-y-0">
                      <button className="text-orange-600 hover:text-orange-700 transition-colors text-left">View</button>
                      <button className="text-black hover:text-orange-600 transition-colors text-left">Edit</button>
                      <button className="text-red-600 hover:text-red-700 transition-colors text-left">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-black mb-1">{material.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{material.description}</p>
                  
                  {/* Research Details */}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{material.author}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{material.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{material.research_type}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {material.year}
                      </div>
                    </div>
                    
                    {/* Keywords */}
                    {material.keywords && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {material.keywords.split(', ').map((keyword, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  material.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                } ml-2 shrink-0`}>
                  {material.status}
                </span>
              </div>
              
              <div className="flex justify-end space-x-3 text-sm">
                <button className="text-orange-600 hover:text-orange-700 transition-colors font-medium">
                  View
                </button>
                <button className="text-black hover:text-orange-600 transition-colors font-medium">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-700 transition-colors font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-gray-500 text-sm sm:text-base">No research materials found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
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
          <div className="text-xl sm:text-2xl font-bold text-black">{new Set(materials.map(m => m.department)).size}</div>
          <div className="text-xs sm:text-sm text-gray-600">Departments</div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}

export default CollegeResearchPage;
