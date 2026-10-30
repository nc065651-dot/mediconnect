import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { PatientProfile } from '../../types.ts';
import { UserCheck, Shield, AlertCircle, Heart, Phone, MapPin, Save, Plus, X } from 'lucide-react';

export const PatientHealthProfile: React.FC = () => {
  const { user, showToast } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [newMed, setNewMed] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [address, setAddress] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getPatientProfile();
        setProfile(res.profile);
        setFullName(res.profile.fullName || user?.name || '');
        setPhone(res.profile.phone || '');
        setDob(res.profile.dob || '1992-06-14');
        setGender(res.profile.gender || 'Male');
        setBloodGroup(res.profile.bloodGroup || 'O+ Positive');
        setAllergies(res.profile.allergies || []);
        setConditions(res.profile.chronicConditions || []);
        setMedications(res.profile.currentMedications || []);
        setEmergencyName(res.profile.emergencyContact?.name || '');
        setEmergencyRel(res.profile.emergencyContact?.relationship || '');
        setEmergencyPhone(res.profile.emergencyContact?.phone || '');
        setAddress(res.profile.address || '');
        setInsuranceProvider(res.profile.insuranceProvider || '');
        setInsurancePolicyNumber(res.profile.insurancePolicyNumber || '');
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updatePatientProfile({
        fullName,
        phone,
        dob,
        gender,
        bloodGroup,
        allergies,
        chronicConditions: conditions,
        currentMedications: medications,
        emergencyContact: {
          name: emergencyName,
          relationship: emergencyRel,
          phone: emergencyPhone,
        },
        address,
        insuranceProvider,
        insurancePolicyNumber,
      });
      setProfile(res.profile);
      showToast('Health profile saved and updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (item: string) => {
    setAllergies(allergies.filter((a) => a !== item));
  };

  const addCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const removeCondition = (item: string) => {
    setConditions(conditions.filter((c) => c !== item));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Health Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your authoritative clinical history, allergies, emergency contacts, and personal information
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white font-mono-numbers"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Home Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Clinical History & Allergies */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Clinical Health Indicators
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              >
                <option value="O+ Positive">O+ Positive</option>
                <option value="O- Negative">O- Negative</option>
                <option value="A+ Positive">A+ Positive</option>
                <option value="A- Negative">A- Negative</option>
                <option value="B+ Positive">B+ Positive</option>
                <option value="B- Negative">B- Negative</option>
                <option value="AB+ Positive">AB+ Positive</option>
                <option value="AB- Negative">AB- Negative</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Known Drug & Food Allergies</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Sulfa drugs, Peanuts"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                />
                <button
                  type="button"
                  onClick={addAllergy}
                  className="px-3 py-2 bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allergies.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 font-semibold rounded-lg text-[11px] flex items-center gap-1"
                  >
                    <span>{item}</span>
                    <button type="button" onClick={() => removeAllergy(item)} className="hover:text-rose-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Chronic Conditions</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Asthma, Type 2 Diabetes, Hypertension"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                />
                <button
                  type="button"
                  onClick={addCondition}
                  className="px-3 py-2 bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {conditions.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 font-semibold rounded-lg text-[11px] flex items-center gap-1"
                  >
                    <span>{item}</span>
                    <button type="button" onClick={() => removeCondition(item)} className="hover:text-teal-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact & Insurance */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Emergency Contact & Health Insurance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                placeholder="Spouse / Parent"
                value={emergencyRel}
                onChange={(e) => setEmergencyRel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Insurance Provider</label>
              <input
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Policy / Member ID</label>
              <input
                type="text"
                value={insurancePolicyNumber}
                onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 font-mono-numbers"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Records...' : 'Save Health Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
