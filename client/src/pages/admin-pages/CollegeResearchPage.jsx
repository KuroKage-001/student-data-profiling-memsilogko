import { useState } from 'react';

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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">College Research Library</h1>
        <p className="text-gray-600">Manage research materials for CCS faculty</p>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search research materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="Data Science">Data Science</option>
        </select>
      </div>

      <div className="mb-4">
        <button className="bg-orange-800 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          + Add New Research
        </button>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-black">{material.title}</div>
                    <div className="text-sm text-gray-500">{material.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{material.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{material.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{material.research_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      material.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {material.status}
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

export default CollegeResearchPage;
