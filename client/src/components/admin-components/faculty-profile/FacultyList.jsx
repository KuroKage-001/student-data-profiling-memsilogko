import { useState, useMemo } from 'react';

const FacultyList = ({ searchTerm, onViewFaculty }) => {
  // Mock faculty data
  const [faculty] = useState([
    {
      id: 'FAC001',
      name: 'Dr. Robert Anderson',
      department: 'Computer Science',
      position: 'Professor',
      specialization: 'Artificial Intelligence',
      status: 'Active',
      email: 'robert.anderson@university.edu',
      phone: '+1234567890',
      office: 'CS Building, Room 301',
      hireDate: '2015-08-15',
      courses: ['CS 401 - AI Fundamentals', 'CS 501 - Machine Learning']
    },
    {
      id: 'FAC002',
      name: 'Dr. Maria Garcia',
      department: 'Information Technology',
      position: 'Associate Professor',
      specialization: 'Cybersecurity',
      status: 'Active',
      email: 'maria.garcia@university.edu',
      phone: '+1234567891',
      office: 'IT Building, Room 205',
      hireDate: '2018-01-10',
      courses: ['IT 301 - Network Security', 'IT 401 - Ethical Hacking']
    },
    {
      id: 'FAC003',
      name: 'Prof. David Chen',
      department: 'Computer Engineering',
      position: 'Assistant Professor',
      specialization: 'Embedded Systems',
      status: 'Active',
      email: 'david.chen@university.edu',
      phone: '+1234567892',
      office: 'CE Building, Room 150',
      hireDate: '2020-09-01',
      courses: ['CE 301 - Microprocessors', 'CE 401 - IoT Systems']
    },
    {
      id: 'FAC004',
      name: 'Dr. Lisa Thompson',
      department: 'Data Science',
      position: 'Professor',
      specialization: 'Statistical Analysis',
      status: 'Active',
      email: 'lisa.thompson@university.edu',
      phone: '+1234567893',
      office: 'DS Building, Room 401',
      hireDate: '2012-03-15',
      courses: ['DS 301 - Statistics', 'DS 401 - Advanced Analytics']
    }
  ]);

  const filteredFaculty = useMemo(() => {
    if (!searchTerm) return faculty;
    
    return faculty.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [faculty, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Faculty Member
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFaculty.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-black">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.id}</div>
                  </div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{member.department}</div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{member.position}</div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{member.specialization}</div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col xl:flex-row xl:space-x-3 space-y-1 xl:space-y-0">
                    <button
                      onClick={() => onViewFaculty(member)}
                      className="text-orange-600 hover:text-orange-700 transition-colors text-left"
                    >
                      View
                    </button>
                    <button className="text-black hover:text-orange-600 transition-colors text-left">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-700 transition-colors text-left">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {filteredFaculty.map((member) => (
          <div key={member.id} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-black mb-1">{member.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{member.id}</p>
                <div className="flex flex-wrap gap-2 text-sm mb-2">
                  <span className="text-gray-700">{member.department}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-700">{member.position}</span>
                </div>
                <p className="text-sm text-gray-600">{member.specialization}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)} ml-2 shrink-0`}>
                {member.status}
              </span>
            </div>
            
            <div className="flex justify-end space-x-3 text-sm">
              <button
                onClick={() => onViewFaculty(member)}
                className="text-orange-600 hover:text-orange-700 transition-colors font-medium"
              >
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
      
      {filteredFaculty.length === 0 && (
        <div className="text-center py-8 px-4">
          <p className="text-gray-500 text-sm sm:text-base">No faculty members found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FacultyList;