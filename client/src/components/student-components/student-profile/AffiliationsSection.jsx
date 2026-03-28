import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import affiliationsService from '../../../services/student-profile-service/affiliationsService';

const EMPTY_FORM = {
  organization_name: '',
  affiliation_type: 'academic_org',
  role: '',
  start_date: '',
  end_date: '',
  is_active: true,
  description: '',
};

const TYPE_LABELS = {
  academic_org: 'Academic Org',
  sports: 'Sports',
  civic: 'Civic',
  religious: 'Religious',
  political: 'Political',
  other: 'Other',
};

const StatusBadge = ({ isActive }) => (
  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

const AffiliationsSection = ({ studentId }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAffiliation, setEditingAffiliation] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data, isLoading, error } = useQuery({
    queryKey: ['affiliations', studentId],
    queryFn: () => affiliationsService.getAffiliations(studentId),
    select: (res) => res.data || [],
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['affiliations', studentId] });

  const createMutation = useMutation({
    mutationFn: (data) => affiliationsService.createAffiliation(studentId, data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => affiliationsService.updateAffiliation(studentId, id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => affiliationsService.deleteAffiliation(studentId, id),
    onSuccess: invalidate,
  });

  const openAddForm = () => {
    setEditingAffiliation(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (affiliation) => {
    setEditingAffiliation(affiliation);
    setFormData({
      organization_name: affiliation.organization_name || '',
      affiliation_type: affiliation.affiliation_type || 'academic_org',
      role: affiliation.role || '',
      start_date: affiliation.start_date ? affiliation.start_date.split('T')[0] : '',
      end_date: affiliation.end_date ? affiliation.end_date.split('T')[0] : '',
      is_active: affiliation.is_active ?? true,
      description: affiliation.description || '',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAffiliation(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAffiliation) {
      await updateMutation.mutateAsync({ id: editingAffiliation.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    handleCancel();
  };

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  const affiliations = data || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-orange-50 px-4 py-2 border-b border-orange-200 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-orange-700 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
          Affiliations
        </h4>
        <button
          onClick={openAddForm}
          className="text-xs px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Add Affiliation
        </button>
      </div>

      <div className="p-4">
        {/* Error banner */}
        {error && (
          <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error.message || 'Failed to load affiliations'}
          </div>
        )}

        {/* Inline form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={formData.organization_name}
                  onChange={(e) => setFormData(p => ({ ...p, organization_name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.affiliation_type}
                  onChange={(e) => setFormData(p => ({ ...p, affiliation_type: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {Object.entries(TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(p => ({ ...p, start_date: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(p => ({ ...p, end_date: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">Currently Active</label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                Save Affiliation
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
        ) : affiliations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No affiliations on record</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Organization Name</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Type</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Role</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliations.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 px-2 text-gray-900">{a.organization_name}</td>
                    <td className="py-2 px-2 text-gray-600">{TYPE_LABELS[a.affiliation_type] || a.affiliation_type}</td>
                    <td className="py-2 px-2 text-gray-600">{a.role || 'N/A'}</td>
                    <td className="py-2 px-2"><StatusBadge isActive={a.is_active} /></td>
                    <td className="py-2 px-2">
                      {confirmDeleteId === a.id ? (
                        <span className="flex items-center gap-1 text-xs">
                          <span className="text-gray-600">Are you sure?</span>
                          <button
                            onClick={handleConfirmDelete}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-gray-500 hover:underline"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <button
                            onClick={() => openEditForm(a)}
                            className="text-xs text-orange-600 hover:underline font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(a.id)}
                            className="text-xs text-red-600 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliationsSection;
