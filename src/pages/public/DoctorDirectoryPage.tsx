import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { DoctorProfile } from '../../types.ts';
import { Search, Filter, Star, CheckCircle2, Video, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

interface DoctorDirectoryPageProps {
  onNavigate: (path: string) => void;
  onSelectDoctorToBook?: (doctor: DoctorProfile) => void;
}

export const DoctorDirectoryPage: React.FC<DoctorDirectoryPageProps> = ({ onNavigate, onSelectDoctorToBook }) => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [mode, setMode] = useState<string>('all');
  const [maxFee, setMaxFee] = useState<number>(200);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getDoctors();
        setDoctors(res.doctors);
      } catch (e) {
        console.error('Failed to load doctors:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.fullName.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.clinicAddress.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty = specialty === 'All' || doc.specialty.toLowerCase() === specialty.toLowerCase();

    const matchesMode =
      mode === 'all' ||
      (mode === 'in_person' && doc.consultationModes.includes('in_person')) ||
      (mode === 'video' && doc.consultationModes.includes('video'));

    const matchesFee = doc.consultationFee <= maxFee;

    return matchesSearch && matchesSpecialty && matchesMode && matchesFee;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Hospital Clinical Directory</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Find Credentialed Specialists</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Search board-certified physicians, review clinical qualifications, check instant slot availability, and book in-person or video consultations.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search by doctor name or condition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white text-slate-700"
            >
              <option value="All">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white text-slate-700"
            >
              <option value="all">All Consultation Modes</option>
              <option value="in_person">In-Person Clinic Visit</option>
              <option value="video">Telehealth Video Call</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <div className="w-full">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>Max Fee:</span>
                <span className="font-semibold text-slate-800 font-mono-numbers">${maxFee}</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-800 font-mono-numbers">{filteredDoctors.length}</strong> available physicians</span>
        <button
          onClick={() => {
            setSearch('');
            setSpecialty('All');
            setMode('all');
            setMaxFee(200);
          }}
          className="text-teal-700 hover:underline"
        >
          Reset all filters
        </button>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-800">No doctors match your search filters</p>
          <p className="text-xs text-slate-500 mt-1">Try expanding your max fee or selecting "All Specialties".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-teal-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{doc.isVerified ? 'Verified Specialist' : 'Pending Verification'}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 truncate mt-0.5">{doc.fullName}</h3>
                    <p className="text-xs text-slate-500 truncate">{doc.title}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono-numbers">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{doc.experienceYears} yrs clinical exp</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mt-4 leading-relaxed">
                  {doc.bio}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.clinicAddress}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-slate-600 font-medium text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{doc.slotDurationMinutes} min consultations</span>
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-teal-700 font-medium text-[11px]">
                      {doc.consultationModes.map((m) => (m === 'video' ? 'Video' : 'In-Person')).join(' & ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Consultation Fee</span>
                  <span className="text-lg font-bold text-slate-900 font-mono-numbers">${doc.consultationFee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`/doctors/${doc.id}`)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectDoctorToBook) {
                        onSelectDoctorToBook(doc);
                      }
                      onNavigate(`/patient/book-appointment?doctorId=${doc.id}`);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-sm"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
