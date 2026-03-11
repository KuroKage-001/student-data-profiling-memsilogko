import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import StudentList from '../../components/student-components/student-profile/StudentList';
import StudentProfileModal from '../../components/student-components/student-profile/StudentProfileModal';

const StudentProfiles = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Student Profiles</h1>
          <p className="text-gray-600">Comprehensive student data management and profiling</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search students by name, ID, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
              Add Student
            </button>
            <button className="bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors">
              Export List
            </button>
          </div>
        </div>

        <StudentList 
          searchTerm={searchTerm}
          onViewStudent={handleViewStudent}
        />

        {isModalOpen && selectedStudent && (
          <StudentProfileModal
            student={selectedStudent}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentProfiles;