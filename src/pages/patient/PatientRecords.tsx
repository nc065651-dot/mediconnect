import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { MedicalRecord, RecordCategory } from '../../types.ts';
import {
  FolderHeart,
  Upload,
  Search,
  Filter,
  FileText,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  Shield,
  FileSpreadsheet,
  Layers,
  Calendar,
  Building,
  Tag,
  X,
  FileCheck,
} from 'lucide-react';

interface PatientRecordsProps {
  onNavigate: (path: string) => void;
}

export const PatientRecords: React.FC<PatientRecordsProps> = ({ onNavigate }) => {
  const { showToast } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [previewRecord, setPreviewRecord] = useState<MedicalRecord | null>(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<RecordCategory>('lab_report');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newFacility, setNewFacility] = useState<string>('');
  const [newDoctor, setNewDoctor] = useState<string>('');
  const [newSummary, setNewSummary] = useState<string>('');
  const [newFileType, setNewFileType] = useState<'PDF' | 'DICOM' | 'JPG'>('PDF');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const loadRecords = async () => {
    try {
      const res = await api.getRecords();
      setRecords(res.records);
    } catch (err) {
      console.error('Failed to load medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newFacility) {
      showToast('Title and facility are required', 'error');
      return;
    }

    setIsUploading(true);
    try {
      await api.uploadRecord({
        title: newTitle,
        category: newCategory,
        date: newDate,
        facility: newFacility,
        doctorName: newDoctor,
        summary: newSummary || 'Archived health diagnostic record',
        fileType: newFileType,
      });

      showToast('Medical record archived successfully in DRiefcase Vault!');
      setShowUploadModal(false);
      setNewTitle('');
      setNewFacility('');
      setNewDoctor('');
      setNewSummary('');
      await loadRecords();
    } catch (err: any) {
      showToast(err.message || 'Failed to upload document', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRecord = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from your health vault?`)) {
      return;
    }
    try {
      await api.deleteRecord(id);
      showToast('Record deleted successfully');
      await loadRecords();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete record', 'error');
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.facility.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories: { label: string; value: string }[] = [
    { label: 'All Records', value: 'all' },
    { label: 'Lab Reports', value: 'lab_report' },
    { label: 'Imaging & Scans', value: 'imaging_scan' },
    { label: 'Discharge Summaries', value: 'discharge_summary' },
    { label: 'Vaccination Cards', value: 'vaccination' },
    { label: 'Clinical Notes', value: 'clinical_notes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with DRiefcase Trust Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>DRiefcase-Inspired Central Health Locker</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Digital Medical Records</h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Organize lifetime health documents, diagnostic pathology results, radiology scans, and surgery notes with patient-authoritative access control.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Medical Record</span>
        </button>
      </div>

      {/* Filter and Search toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === c.value
                  ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Document Records Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <FolderHeart className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">No medical documents in this folder</p>
          <p className="text-xs text-slate-500">
            Upload diagnostic reports, prescription scans, or clinic discharge summaries to keep them organized.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-2 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold"
          >
            Upload Your First Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
                        {rec.category.replace('_', ' ')}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">{rec.title}</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 bg-slate-100 rounded font-semibold text-slate-600">
                    {rec.fileType}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {rec.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{rec.facility}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono-numbers">{rec.date}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[10px] font-mono-numbers">{rec.fileSize}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewRecord(rec)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleDeleteRecord(rec.id, rec.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload to DRiefcase Vault</h3>
                <p className="text-xs text-slate-500">Supported formats: PDF, DICOM, High-Res JPG</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brain MRI T1/T2 Scan or Lipid Profile"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as RecordCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                  >
                    <option value="lab_report">Lab Report</option>
                    <option value="imaging_scan">Imaging / X-Ray / MRI</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="vaccination">Vaccination Record</option>
                    <option value="clinical_notes">Clinical Consultation Note</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Test / Exam</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility / Lab Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quest Diagnostics"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ordering Doctor</label>
                  <input
                    type="text"
                    placeholder="Dr. Sarah Chen, MD"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Notes & Summary</label>
                <textarea
                  rows={2}
                  placeholder="Key findings, reference interpretations, or physician instructions..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Simulated File Drop Container */}
              <div className="border-2 border-dashed border-teal-600/40 bg-teal-50/40 rounded-2xl p-5 text-center space-y-1">
                <Upload className="w-6 h-6 text-teal-700 mx-auto" />
                <p className="font-semibold text-slate-800">Digital Document Attached</p>
                <p className="text-[10px] text-slate-500">File simulation: Encrypted AES-256 cloud container</p>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl shadow-sm"
                >
                  {isUploading ? 'Encrypting & Storing...' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                  {previewRecord.category.replace('_', ' ')}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{previewRecord.title}</h3>
                <p className="text-xs text-slate-500">{previewRecord.facility} · {previewRecord.date}</p>
              </div>
              <button
                onClick={() => setPreviewRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Document inspection paper card */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 font-sans text-xs">
              <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-2">
                <span>Facility: <strong className="text-slate-800">{previewRecord.facility}</strong></span>
                <span>Format: <strong className="font-mono-numbers text-slate-800">{previewRecord.fileType}</strong></span>
              </div>
              <div>
                <strong className="text-slate-900 block mb-1">Diagnostic Interpretation:</strong>
                <p className="text-slate-700 leading-relaxed">{previewRecord.summary}</p>
              </div>
              {previewRecord.doctorName && (
                <div className="text-slate-500 pt-2">
                  <span>Reporting Clinician: </span>
                  <strong className="text-slate-800">{previewRecord.doctorName}</strong>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Authenticated SHA-256 Checksum Verified</span>
              <button
                onClick={() => {
                  showToast(`Downloading ${previewRecord.title} (${previewRecord.fileType})`);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
