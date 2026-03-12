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
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Student Profiles</h1>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive student data management and profiling</p>
        </div>

        {/* Search and Actions Section */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:flex-col lg:flex-row lg:gap-4 lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="w-full lg:flex-1 lg:max-w-md">
            <input
              type="text"
              placeholder="Search students by name, ID, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col min-[480px]:flex-row gap-2 sm:gap-3 w-full min-[480px]:w-auto lg:w-auto">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium w-full min-[480px]:w-auto">
              Add Student
            </button>
            <button className="bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium w-full min-[480px]:w-auto">
              Export List
            </button>
          </div>
        </div>

        {/* Student List */}
        <div className="overflow-hidden">
          <StudentList 
            searchTerm={searchTerm}
            onViewStudent={handleViewStudent}
          />
        </div>

        {/* Modal */}
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