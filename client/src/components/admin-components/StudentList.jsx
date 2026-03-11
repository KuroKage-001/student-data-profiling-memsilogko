import { useState, useMemo } from 'react';

const StudentList = ({ searchTerm, onViewStudent }) => {
  // Mock student data
  const [students] = useState([
    {
      id: 'STU001',
      name: 'John Doe',
      program: 'Computer Science',
      year: '3rd Year',
      gpa: '3.85',
      status: 'Active',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      address: '123 Main St, City',
      enrollmentDate: '2022-08-15'
    },
    {
      id: 'STU002',
      name: 'Jane Smith',
      program: 'Information Technology',
      year: '2nd Year',
      gpa: '3.92',
      status: 'Active',
      email: 'jane.smith@email.com',
      phone: '+1234567891',
      address: '456 Oak Ave, City',
      enrollmentDate: '2023-08-15'
    },
    {
      id: 'STU003',
      name: 'Mike Johnson',
      program: 'Computer Engineering',
      year: '4th Year',
      gpa: '3.67',
      status: 'Active',
      email: 'mike.johnson@email.com',
      phone: '+1234567892',
      address: '789 Pine St, City',
      enrollmentDate: '2021-08-15'
    },
    {
      id: 'STU004',
      name: 'Sarah Wilson',
      program: 'Data Science',
      year: '1st Year',
      gpa: '3.78',
      status: 'Active',
      email: 'sarah.wilson@email.com',
      phone: '+1234567893',
      address: '321 Elm St, City',
      enrollmentDate: '2024-08-15'
    }
  ]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GPA
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
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-black">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{student.program}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{student.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-black">{student.gpa}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewStudent(student)}
                    className="text-orange-600 hover:text-orange-700 mr-3 transition-colors"
                  >
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
      
      {filteredStudents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No students found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default StudentList;