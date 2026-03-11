import { useState } from 'react';
import AdminLayout from '../../components/admin-components/AdminLayout';
import FacultyList from '../../components/admin-components/FacultyList';
import FacultyProfileModal from '../../components/admin-components/FacultyProfileModal';

const FacultyProfiles = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFaculty(null);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Faculty Profiles</h1>
          <p className="text-gray-600">Faculty information and professional development management</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search faculty by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
              Add Faculty
            </button>
            <button className="bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors">
              Export List
            </button>
          </div>
        </div>

        <FacultyList 
          searchTerm={searchTerm}
          onViewFaculty={handleViewFaculty}
        />

        {isModalOpen && selectedFaculty && (
          <FacultyProfileModal
            faculty={selectedFaculty}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default FacultyProfiles;