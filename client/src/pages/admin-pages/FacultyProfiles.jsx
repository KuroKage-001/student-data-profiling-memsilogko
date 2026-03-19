import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import FacultyList from '../../components/admin-components/faculty-profile/FacultyList';
import FacultyProfileModal from '../../components/admin-components/faculty-profile/FacultyProfileModal';
import { FaChalkboardTeacher, FaSearch, FaPlus, FaFileExport } from 'react-icons/fa';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section with Enhanced Design */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaChalkboardTeacher className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Faculty Profiles
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-16 font-medium">
            Faculty information and professional development management
          </p>
        </div>

        {/* Search and Actions Section - Enhanced Design */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-4 lg:items-center lg:justify-between">
            {/* Search Input with Icon */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch className="text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search faculty by name, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            
            {/* Action Buttons - Enhanced */}
            <div className="flex flex-col min-[480px]:flex-row gap-3 w-full min-[480px]:w-auto lg:w-auto">
              <button className="group relative bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <FaPlus className="text-sm relative z-10" />
                <span className="relative z-10">Add Faculty</span>
              </button>
              <button className="group bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5">
                <FaFileExport className="text-sm" />
                <span>Export List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Faculty List - Enhanced Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <FacultyList 
            searchTerm={searchTerm}
            onViewFaculty={handleViewFaculty}
          />
        </div>

        {/* Modal */}
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