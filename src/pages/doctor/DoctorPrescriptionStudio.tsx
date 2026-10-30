import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { PrescriptionMedication, Prescription } from '../../types.ts';
import { Pill, Plus, Trash2, CheckCircle2, ShieldCheck, Download, FileText, ArrowRight } from 'lucide-react';

export const DoctorPrescriptionStudio: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, showToast } = useAuth();
  const [patientId, setPatientId] = useState('user_pat_01'); // Alex Morgan default
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [issuedPrescription, setIssuedPrescription] = useState<Prescription | null>(null);

  // Dynamic medication rows
  const [medications, setMedications] = useState<
    Omit<PrescriptionMedication, 'id'>[]
  >([
    {
      name: 'Lisinopril Oral Tablet',
      dosage: '10 mg',
      frequency: 'Once daily morning',
      duration: '30 days',
      timing: 'After Breakfast',
      instructions: 'Take consistently at same time with glass of water. Monitor resting BP weekly.',
    },
  ]);

  const addMedicationRow = () => {
    setMedications([
      ...medications,
      {
        name: '',
        dosage: '',
        frequency: 'Once daily',
        duration: '14 days',
        timing: 'After Meals',
        instructions: '',
      },
    ]);
  };

  const removeMedicationRow = (index: number) => {
    if (medications.length <= 1) {
      showToast('Prescription must contain at least one medication', 'info');
      return;
    }
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      showToast('Please provide a clinical diagnosis or assessment', 'error');
      return;
    }

    for (const med of medications) {
      if (!med.name.trim() || !med.dosage.trim()) {
        showToast('Please specify drug name and dosage for all medication rows', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await api.createPrescription({
        patientId,
        diagnosis,
        clinicalNotes,
        medications,
        followUpDate: followUpDate || undefined,
      });

      setIssuedPrescription(res.prescription);
      showToast('Official e-Prescription signed and issued to patient portal!');
    } catch (err: any) {
      showToast(err.message || 'Failed to sign prescription', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">E-Prescription Studio</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, sign, and issue binding electronic prescriptions directly into patient records
          </p>
        </div>
      </div>

      {issuedPrescription ? (
        <div className="bg-white rounded-3xl border border-teal-500/30 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Prescription Signed & Synced</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Rx ID: {issuedPrescription.id}</h2>
            <p className="text-xs text-slate-500">
              Dispatched to patient <strong className="text-slate-800">{issuedPrescription.patientName}</strong>'s portal and medical records vault.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Clinical Assessment:</span>
              <strong className="text-slate-900">{issuedPrescription.diagnosis}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Medications Count:</span>
              <strong className="text-slate-900 font-mono-numbers">{issuedPrescription.medications.length} items</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Digital Seal:</span>
              <span className="text-teal-800 font-mono-numbers font-semibold">{issuedPrescription.signedAt}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIssuedPrescription(null);
                setDiagnosis('');
                setClinicalNotes('');
              }}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              Issue Another Prescription
            </button>
            <button
              onClick={() => onNavigate('/doctor/dashboard')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
            >
              Back to Clinical Desk
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          {/* Header & Patient Select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white font-semibold text-slate-800"
              >
                <option value="user_pat_01">Alex Morgan (Age: 32 · Male · O+ Positive)</option>
                <option value="user_pat_02">Maya Patel (Age: 28 · Female)</option>
                <option value="user_pat_03">Robert Davis (Age: 45 · Male)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis / ICD Summary</label>
              <input
                type="text"
                required
                placeholder="e.g. Essential Hypertension (I10) or Tension-type headache"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Dynamic Medication Rows */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Medications Regimen</h3>
                <p className="text-xs text-slate-500">Enter dosage, administration frequency, duration, and patient timing instructions</p>
              </div>

              <button
                type="button"
                onClick={addMedicationRow}
                className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-3">
              {medications.map((med, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Medication #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeMedicationRow(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block font-medium text-slate-600 mb-1">Drug Name & Formulation</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amlodipine Oral Capsule"
                        value={med.name}
                        onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Dosage</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 mg"
                        value={med.dosage}
                        onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 font-mono-numbers"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Frequency</label>
                      <select
                        value={med.frequency}
                        onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                      >
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="As needed (PRN)">As needed (PRN)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 30 days"
                        value={med.duration}
                        onChange={(e) => updateMedication(idx, 'duration', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 font-mono-numbers"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Meal Timing</label>
                      <select
                        value={med.timing}
                        onChange={(e) => updateMedication(idx, 'timing', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                      >
                        <option value="After Breakfast">After Breakfast</option>
                        <option value="Before Food">Before Food</option>
                        <option value="With Meals">With Meals</option>
                        <option value="At Bedtime">At Bedtime</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Special Instructions</label>
                      <input
                        type="text"
                        placeholder="e.g. Avoid taking with grapefruit juice"
                        value={med.instructions}
                        onChange={(e) => updateMedication(idx, 'instructions', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up & Doctor Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recommended Follow-Up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 font-mono-numbers"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Additional Clinical Advice & Lifestyle Notes</label>
              <textarea
                rows={2}
                placeholder="Dietary recommendations, physical exercise guidelines, or warning symptoms..."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Signed digitally under {user?.name || 'Dr. Sarah Chen, MD'} Credentials</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Signing & Storing...' : 'Sign & Issue e-Prescription'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
