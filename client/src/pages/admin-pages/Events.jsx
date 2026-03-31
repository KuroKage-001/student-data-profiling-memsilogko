import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import usePageTitle from '../../hooks/usePageTitle';
import { 
  EventCalendar, 
  EventStatistics, 
  EventControls, 
  EventListView, 
  EventFormModal, 
  EventViewModal,
  EventDeleteModal
} from '../../components/admin-components/event-compo';
import { FaCalendarAlt } from 'react-icons/fa';
import { EventsSkeleton } from '../../layouts/skeleton-loading';
import { 
  getStatusColor, 
  handleEventSubmit, 
  handleEventDelete,
  VIEW_MODES,
} from '../../utils/admin-utilities/events-utils';
import { useEventData } from '../../utils/admin-utilities/events-utils/useEventData';
import { useEventForm } from '../../utils/admin-utilities/events-utils/useEventForm';

const Events = () => {
  usePageTitle('Events');
  
  // UI State
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState(VIEW_MODES.CALENDAR);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Custom Hooks
  const { events, statistics, loading, refreshData } = useEventData(filterStatus, searchTerm);
  const { formData, editingEvent, handleInputChange, resetForm, loadEventForEdit, setFormDate } = useEventForm();

  // Event Handlers
  const handleSubmit = async (e) => {
    await handleEventSubmit({
      event: e,
      formData,
      editingEvent,
      setSubmitting,
      onSuccess: () => {
        setShowForm(false);
        resetForm();
        refreshData();
      },
    });
  };

  const handleEdit = (event) => {
    loadEventForEdit(event);
    setShowForm(true);
  };

  const handleDelete = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setDeleting(true);
    try {
      await handleEventDelete(eventToDelete.id, refreshData);
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const handleEventClick = (event) => {
    setViewingEvent(event);
    setShowViewModal(true);
  };

  const handleViewModalEdit = () => {
    setShowViewModal(false);
    handleEdit(viewingEvent);
  };

  const handleDateSelect = (selectInfo) => {
    resetForm();
    setFormDate(selectInfo.startStr);
    setShowForm(true);
  };

  // Show skeleton loading while data is being fetched
  if (loading) {
    return (
      <AdminLayout>
        <EventsSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <FaCalendarAlt className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Events Management
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 ml-12 sm:ml-16 font-medium">
            Manage academic and institutional events
          </p>
        </div>

        {/* Quick Stats */}
        <EventStatistics statistics={statistics} />

        {/* Controls */}
        <EventControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddEvent={() => { resetForm(); setShowForm(true); }}
        />

        {/* Calendar View */}
        {viewMode === VIEW_MODES.CALENDAR && (
          <EventCalendar 
            events={events}
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
          />
        )}

        {/* List View */}
        {viewMode === VIEW_MODES.LIST && (
          <EventListView
            events={events}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getStatusColor={getStatusColor}
          />
        )}

        {/* View Event Modal */}
        {showViewModal && (
          <EventViewModal
            event={viewingEvent}
            onClose={() => { setShowViewModal(false); setViewingEvent(null); }}
            onEdit={handleViewModalEdit}
            getStatusColor={getStatusColor}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <EventDeleteModal
            isOpen={showDeleteModal}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            event={eventToDelete}
            loading={deleting}
          />
        )}

        {/* Add/Edit Event Modal */}
        {showForm && (
          <EventFormModal
            show={showForm}
            onClose={() => { setShowForm(false); resetForm(); }}
            onSubmit={handleSubmit}
            formData={formData}
            onChange={handleInputChange}
            editingEvent={editingEvent}
            submitting={submitting}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Events;
