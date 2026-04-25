import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import academicRecordsService from '../../../services/student-profile-service/academicRecordsService';

const EMPTY_SUBJECT = { subject_code: '', subject_name: '', units: '', grade: '' };

const EMPTY_FORM = {
  semester: '1st Sem',
  academic_year: '',
  semester_gpa: '',
  remarks: '',
  subjects: [{ ...EMPTY_SUBJECT }],
};

const AcademicHistorySection = ({ studentId, canModify = true }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data, isLoading, error } = useQuery({
    queryKey: ['academicRecords', studentId],
    queryFn: () => academicRecordsService.getAcademicRecords(studentId),
    select: (res) => res.data || [],
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['academicRecords', studentId] });

  const createMutation = useMutation({
    mutationFn: (data) => academicRecordsService.createAcademicRecord(studentId, data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => academicRecordsService.updateAcademicRecord(studentId, id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => academicRecordsService.deleteAcademicRecord(studentId, id),
    onSuccess: invalidate,
  });

  const openAddForm = () => {
    setEditingRecord(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setEditingRecord(record);
    setFormData({
      semester: record.semester || '1st Sem',
      academic_year: record.academic_year || '',
      semester_gpa: record.semester_gpa != null ? record.semester_gpa : '',
      remarks: record.remarks || '',
      subjects: record.subjects && record.subjects.length > 0
        ? record.subjects.map(s => ({
            subject_code: s.subject_code || '',
            subject_name: s.subject_name || '',
            units: s.units != null ? s.units : '',
            grade: s.grade != null ? s.grade : '',
          }))
        : [{ ...EMPTY_SUBJECT }],
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubjectChange = (index, field, value) => {
    setFormData(prev => {
      const subjects = [...prev.subjects];
      subjects[index] = { ...subjects[index], [field]: value };
      return { ...prev, subjects };
    });
  };

  const addSubject = () => {
    setFormData(prev => ({ ...prev, subjects: [...prev.subjects, { ...EMPTY_SUBJECT }] }));
  };

  const removeSubject = (index) => {
    setFormData(prev => ({ ...prev, subjects: prev.subjects.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      semester_gpa: formData.semester_gpa !== '' ? parseFloat(formData.semester_gpa) : null,
      subjects: formData.subjects
        .filter(s => s.subject_name && s.subject_name.trim() !== '')
        .map(s => ({
          ...s,
          units: s.units !== '' && s.units != null ? parseFloat(s.units) : null,
          grade: s.grade !== '' && s.grade != null ? parseFloat(s.grade) : null,
        })),
    };
    if (editingRecord) {
      await updateMutation.mutateAsync({ id: editingRecord.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    handleCancel();
  };

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));

  const records = data || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-orange-50 px-4 py-2 border-b border-orange-200 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-orange-700 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
          Academic History
        </h4>
        {canModify && (
          <button
            onClick={openAddForm}
            className="text-xs px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add Semester Record
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Error banner */}
        {error && (
          <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error.message || 'Failed to load academic records'}
          </div>
        )}

        {/* Inline form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData(p => ({ ...p, semester: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="1st Sem">1st Sem</option>
                  <option value="2nd Sem">2nd Sem</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Academic Year</label>
                <select
                  value={formData.academic_year}
                  onChange={(e) => setFormData(p => ({ ...p, academic_year: e.target.value }))}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select academic year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const start = 2020 + i;
                    return `${start}-${start + 1}`;
                  }).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Semester GPA</label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={formData.semester_gpa}
                  onChange={(e) => setFormData(p => ({ ...p, semester_gpa: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                <select
                  value={formData.remarks}
                  onChange={(e) => setFormData(p => ({ ...p, remarks: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select remarks</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                  <option value="Incomplete">Incomplete</option>
                  <option value="Dropped">Dropped</option>
                  <option value="Good Standing">Good Standing</option>
                  <option value="Dean's List">Dean's List</option>
                  <option value="Academic Probation">Academic Probation</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">Subjects</label>
                <button
                  type="button"
                  onClick={addSubject}
                  className="text-xs text-orange-600 hover:underline font-medium"
                >
                  + Add Subject
                </button>
              </div>
              <div className="space-y-2">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Code"
                        value={subject.subject_code}
                        onChange={(e) => handleSubjectChange(index, 'subject_code', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={subject.subject_name}
                        required
                        onChange={(e) => handleSubjectChange(index, 'subject_name', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Units"
                        value={subject.units}
                        onChange={(e) => handleSubjectChange(index, 'units', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Grade"
                        value={subject.grade}
                        onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {formData.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                Save Record
              </button>
            </div>
          </form>
        )}

        {/* Records list */}
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No academic records on file</p>
        ) : (
          <div className="space-y-2">
            {records.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Collapsed row header */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(record.id)}
                >
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-900">{record.semester} — {record.academic_year}</span>
                    <span className="text-gray-500">
                      GPA: <span className="font-semibold text-orange-600">
                        {record.semester_gpa != null ? parseFloat(record.semester_gpa).toFixed(2) : 'N/A'}
                      </span>
                    </span>
                    {record.remarks && (
                      <span className="text-gray-500 text-xs">{record.remarks}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {canModify && (
                      <>
                        {confirmDeleteId === record.id ? (
                          <span className="flex items-center gap-1 text-xs" onClick={(e) => e.stopPropagation()}>
                            <span className="text-gray-600">Are you sure?</span>
                            <button onClick={handleConfirmDelete} className="text-red-600 hover:underline font-medium">Confirm</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-gray-500 hover:underline">Cancel</button>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => openEditForm(record)}
                              className="text-xs text-orange-600 hover:underline font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(record.id)}
                              className="text-xs text-red-600 hover:underline font-medium"
                            >
                              Delete
                            </button>
                          </span>
                        )}
                      </>
                    )}
                    <span className="text-gray-400 text-xs">{expandedId === record.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded subjects table */}
                {expandedId === record.id && (
                  <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                    {record.subjects && record.subjects.length > 0 ? (
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-1.5 px-2 font-medium text-gray-500">Subject Code</th>
                            <th className="text-left py-1.5 px-2 font-medium text-gray-500">Subject Name</th>
                            <th className="text-left py-1.5 px-2 font-medium text-gray-500">Units</th>
                            <th className="text-left py-1.5 px-2 font-medium text-gray-500">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {record.subjects.map((s, i) => (
                            <tr key={i} className="border-b border-gray-100 last:border-0">
                              <td className="py-1.5 px-2 text-gray-600">{s.subject_code || '—'}</td>
                              <td className="py-1.5 px-2 text-gray-900">{s.subject_name}</td>
                              <td className="py-1.5 px-2 text-gray-600">{s.units != null ? s.units : '—'}</td>
                              <td className="py-1.5 px-2 text-gray-600">{s.grade != null ? s.grade : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-xs text-gray-500">No subjects listed for this semester.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicHistorySection;
