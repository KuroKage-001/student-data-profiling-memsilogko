import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import usePageTitle from '../../hooks/usePageTitle';
import { FaBook, FaSearch, FaPlus, FaChartBar, FaCheckCircle, FaClipboardList, FaGraduationCap } from 'react-icons/fa';
import { usePermissions } from '../../hooks/usePermissions';
import { instructionsAPI } from '../../services/instructionsService';
import { InstructionFormModal, InstructionDeleteModal } from '../../components/admin-components/instructions-compo';
import { InstructionsSkeleton } from '../../layouts/skeleton-loading';
import { toast } from 'react-toastify';

const InstructionsPage = () => {
  usePageTitle('Instructions');
  const { canCreate, canEdit, canDelete, isAdmin } = usePermissions();
  
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState(null);
  const [deletingInstruction, setDeletingInstruction] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    department: '',
    course_code: '',
    course_name: '',
    instructor: '',
    academic_year: '',
    semester: '',
    units: '',
    status: 'active',
    description: '',
    learning_outcomes: '',
  });

  // Fetch instructions
  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const response = await instructionsAPI.getAll();
      
      // Handle different response structures
      let instructionsData = [];
      
      if (response && typeof response === 'object') {
        // Laravel pagination: { data: [...], current_page, total, ... }
        if (response.data && Array.isArray(response.data)) {
          instructionsData = response.data;
        }
        // Direct array response
        else if (Array.isArray(response)) {
          instructionsData = response;
        }
        // Nested data.data structure
        else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          instructionsData = response.data.data;
        }
      }
      
      setInstructions(instructionsData);
    } catch (error) {
      console.error('Failed to fetch instructions:', error);
      toast.error(error.message || 'Failed to load instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingInstruction(null);
    setFormData({
      title: '',
      type: '',
      department: '',
      course_code: '',
      course_name: '',
      instructor: '',
      academic_year: '',
      semester: '',
      units: '',
      status: 'active',
      description: '',
      learning_outcomes: '',
    });
    setShowForm(true);
  };

  const handleEdit = (instruction) => {
    setEditingInstruction(instruction);
    setFormData({
      title: instruction.title || '',
      type: instruction.type || '',
      department: instruction.department || '',
      course_code: instruction.course_code || '',
      course_name: instruction.course_name || '',
      instructor: instruction.instructor || '',
      academic_year: instruction.academic_year || '',
      semester: instruction.semester || '',
      units: instruction.units || '',
      status: instruction.status || 'active',
      description: instruction.description || '',
      learning_outcomes: instruction.learning_outcomes || '',
    });
    setShowForm(true);
  };

  const handleDelete = (instruction) => {
    setDeletingInstruction(instruction);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingInstruction) {
        await instructionsAPI.update(editingInstruction.id, formData);
        toast.success('Instruction updated successfully');
      } else {
        await instructionsAPI.create(formData);
        toast.success('Instruction created successfully');
      }
      
      setShowForm(false);
      fetchInstructions();
    } catch (error) {
      console.error('Failed to save instruction:', error);
      toast.error(error.message || 'Failed to save instruction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingInstruction) return;

    setSubmitting(true);
    try {
      await instructionsAPI.delete(deletingInstruction.id);
      toast.success('Instruction deleted successfully');
      setShowDeleteModal(false);
      setDeletingInstruction(null);
      fetchInstructions();
    } catch (error) {
      console.error('Failed to delete instruction:', error);
      toast.error(error.message || 'Failed to delete instruction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredInstructions = instructions.filter(instruction => {
    const matchesSearch = instruction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || instruction.type === filterType;
    const matchesDepartment = filterDepartment === 'All' || instruction.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || instruction.status === filterStatus;
    return matchesSearch && matchesType && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'syllabus': return '📋';
      case 'curriculum': return '📚';
      case 'lesson': return '📝';
      default: return '📄';
    }
  };

  const instructionTypes = ['syllabus', 'curriculum', 'lesson'];
  const departments = ['Computer Science', 'Information Technology', 'Computer Engineering', 'Data Science', 'All Departments'];
  const statuses = ['active', 'draft', 'archived'];

  if (loading) {
    return (
      <AdminLayout>
        <InstructionsSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section with Enhanced Design */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBook className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Instructions Management
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-16 font-medium">
            Syllabus, Curriculum, and Lesson Management
          </p>
        </div>

        {/* Quick Stats - Enhanced Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{instructions.length}</div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-gray-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Instructions</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{instructions.filter(i => i.status === 'active').length}</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Active</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{instructions.filter(i => i.type === 'syllabus').length}</div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClipboardList className="text-yellow-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Syllabi</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{instructions.filter(i => i.type === 'curriculum').length}</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaGraduationCap className="text-blue-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Curricula</div>
          </div>
        </div>

        {/* Search and Filters - Enhanced Design */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch className="text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search instructions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md"
            >
              <option value="All">All Types</option>
              {instructionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md"
            >
              <option value="All">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {isAdmin() && (
            <button 
              onClick={handleAdd}
              className="group relative bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <FaPlus className="text-sm relative z-10" />
              <span className="relative z-10">Add New Instruction</span>
            </button>
          )}
        </div>

        {/* Instructions List - Enhanced Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instruction
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Department
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Instructor
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Academic Year
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
                {filteredInstructions.map((instruction) => (
                  <tr key={instruction.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-start">
                        <div className="text-lg sm:text-2xl mr-2 sm:mr-3">{getTypeIcon(instruction.type)}</div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-black">{instruction.title}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">{instruction.description}</div>
                          <div className="text-xs text-gray-400 mt-1">Updated: {instruction.last_updated}</div>
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {instruction.type} • {instruction.department} • {instruction.instructor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-black">{instruction.type}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-black">{instruction.department}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-black">{instruction.instructor}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-black">{instruction.academic_year}</div>
                      <div className="text-sm text-gray-500">{instruction.semester}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(instruction.status)}`}>
                        {getStatusLabel(instruction.status)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                        {isAdmin() && (
                          <>
                            <button 
                              onClick={() => handleEdit(instruction)}
                              className="text-black hover:text-orange-600 transition-colors text-xs sm:text-sm"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(instruction)}
                              className="text-red-600 hover:text-red-700 transition-colors text-xs sm:text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {!isAdmin() && (
                          <span className="text-gray-400 text-xs sm:text-sm">View Only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInstructions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">No instructions found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Modals */}
        <InstructionFormModal
          show={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleInputChange}
          isEditing={!!editingInstruction}
          submitting={submitting}
        />

        <InstructionDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          instruction={deletingInstruction}
          loading={submitting}
        />
      </div>
    </AdminLayout>
  );
};

export default InstructionsPage;
