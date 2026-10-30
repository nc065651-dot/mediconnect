import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { DoctorProfile } from '../../types.ts';
import {
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Building,
  GraduationCap,
  Languages,
  CalendarPlus,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

interface DoctorProfilePageProps {
  doctorId: string;
  onNavigate: (path: string) => void;
  onBookDoctor: (doctor: DoctorProfile) => void;
}

export const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({
  doctorId,
  onNavigate,
  onBookDoctor,
}) => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getDoctor(doctorId);
        setDoctor(res.doctor);
      } catch (e) {
        console.error('Failed to load doctor:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-48 bg-slate-200 rounded-3xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-200">
        <p className="text-base font-bold text-slate-800">Doctor not found</p>
        <button
          onClick={() => onNavigate('/doctors')}
          className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <button
        onClick={() => onNavigate('/doctors')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Physician Directory</span>
      </button>

      {/* Main Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <img
              src={doctor.avatarUrl}
              alt={doctor.fullName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-teal-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Hospital Specialist</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{doctor.fullName}</h1>
            <p className="text-sm text-slate-600">{doctor.title}</p>
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
              <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono-numbers">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.reviewCount} reviews)</span>
              </div>
              <span>·</span>
              <span>{doctor.experienceYears} Years Clinical Experience</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto p-4 md:p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex md:flex-col items-center justify-between md:items-end gap-3 shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block md:text-right">Consultation Fee</span>
            <span className="text-2xl font-bold text-slate-900 font-mono-numbers">${doctor.consultationFee}</span>
          </div>
          <button
            onClick={() => {
              onBookDoctor(doctor);
              onNavigate(`/patient/book-appointment?doctorId=${doctor.id}`);
            }}
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Biography */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">About the Physician</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Education & Credentials */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <GraduationCap className="w-5 h-5 text-teal-700" />
              <h2>Education & Certifications</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 pt-1">
              {doctor.education.map((edu, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinic & Affiliations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Building className="w-5 h-5 text-teal-700" />
              <h2>Practice Location & Affiliation</h2>
            </div>
            <div className="space-y-2 text-xs text-slate-600 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{doctor.clinicAddress}</span>
              </div>
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Hospital Affiliation: {doctor.hospitalAffiliation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Consultation Schedule */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Calendar className="w-5 h-5 text-teal-700" />
              <h3>Weekly Schedule</h3>
            </div>
            <div className="space-y-2">
              {doctor.schedule.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0"
                >
                  <span className="font-medium text-slate-700">{day.day}</span>
                  {day.enabled ? (
                    <span className="text-teal-800 font-mono-numbers">
                      {day.startTime} – {day.endTime}
                    </span>
                  ) : (
                    <span className="text-slate-400">Unavailable</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{doctor.slotDurationMinutes} min standard session</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Languages className="w-5 h-5 text-teal-700" />
              <h3>Spoken Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {doctor.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
