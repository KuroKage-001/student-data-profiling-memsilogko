import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import violationsService from '../../../services/student-profile-service/violationsService';

const EMPTY_FORM = {
  violation_type: '',
  severity: 'minor',
  violation_date: '',
  description: '',
  action_taken: '',
};

const SeverityBadge = ({ severity }) => {
  const styles = {
    minor: 'bg-yellow-100 text-yellow-800',
    moderate: 'bg-orange-100 text-orange-800',
    major: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${styles[severity] || 'bg-gray-100 text-gray-600'}`}>
      {severity ? severity.charAt(0).toUpperCase() + severity.slice(1) : 'N/A'}
    </span>
  );
};

const ViolationsSection = ({ studentId }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingViolation, setEditingViolation] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data, isLoading, error } = useQuery({
    queryKey: ['violations', studentId],
    queryFn: () => violationsService.getViolations(studentId),
    select: (res) => res.data || [],
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['violations', studentId] });

  const createMutation = useMutation({
    mutationFn: (data) => violationsService.createViolation(studentId, data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => violationsService.updateViolation(studentId, id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => violationsService.deleteViolation(studentId, id),
    onSuccess: invalidate,
  });

  const openAddForm = () => {
    setEditingViolation(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (violation) => {
    setEditingViolation(violation);
    setFormData({
      violation_type: violation.violation_type || '',
      severity: violation.severity || 'minor',
      violation_date: violation.violation_date ? violation.violation_date.split('T')[0] : '',
      description: violation.description || '',
      action_taken: violation.action_taken || '',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingViolation(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingViolation) {
      await updateMutation.mutateAsync({ id: editingViolation.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    handleCancel();
  };

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  const violations = data || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-orange-50 px-4 py-2 border-b border-orange-200 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-orange-700 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
          Violations
        </h4>
        <button
          onClick={openAddForm}
          className="text-xs px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Add Violation
        </button>
      </div>

      <div className="p-4">
        {/* Error banner */}
        {error && (
          <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error.message || 'Failed to load violations'}
          </div>
        )}

        {/* Inline form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Violation Type</label>
                <input
                  type="text"
                  value={formData.violation_type}
                  onChange={(e) => setFormData(p => ({ ...p, violation_type: e.target.value }))}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData(p => ({ ...p, severity: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="major">Major</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.violation_date}
                  onChange={(e) => setFormData(p => ({ ...p, violation_date: e.target.value }))}
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
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Action Taken</label>
              <textarea
                value={formData.action_taken}
                onChange={(e) => setFormData(p => ({ ...p, action_taken: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
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
                Save Violation
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
        ) : violations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No violations on record</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Violation Type</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Severity</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Date</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Action Taken</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 px-2 text-gray-900">{v.violation_type}</td>
                    <td className="py-2 px-2"><SeverityBadge severity={v.severity} /></td>
                    <td className="py-2 px-2 text-gray-600">
                      {v.violation_date ? new Date(v.violation_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-2 px-2 text-gray-600 max-w-xs truncate">{v.action_taken || 'N/A'}</td>
                    <td className="py-2 px-2">
                      {confirmDeleteId === v.id ? (
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
                            onClick={() => openEditForm(v)}
                            className="text-xs text-orange-600 hover:underline font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(v.id)}
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

export default ViolationsSection;
