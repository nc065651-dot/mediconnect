import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { DoctorScheduleDay } from '../../types.ts';
import { Clock, Calendar, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const DoctorSchedule: React.FC = () => {
  const { showToast } = useAuth();
  const [schedule, setSchedule] = useState<DoctorScheduleDay[]>([
    { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', enabled: true, startTime: '09:00', endTime: '16:00' },
    { day: 'Saturday', enabled: false, startTime: '10:00', endTime: '13:00' },
    { day: 'Sunday', enabled: false, startTime: '10:00', endTime: '13:00' },
  ]);
  const [slotDuration, setSlotDuration] = useState(30);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getDoctorProfile();
        if (res.doctor.schedule) setSchedule(res.doctor.schedule);
        if (res.doctor.slotDurationMinutes) setSlotDuration(res.doctor.slotDurationMinutes);
      } catch (err) {
        console.error('Failed to load doctor schedule:', err);
      }
    }
    load();
  }, []);

  const handleToggleDay = (index: number) => {
    const updated = [...schedule];
    updated[index].enabled = !updated[index].enabled;
    setSchedule(updated);
  };

  const handleChangeTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateDoctorProfile({
        schedule,
        slotDurationMinutes: slotDuration,
      });
      showToast('Clinical practice hours updated and synchronized with booking engine!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update schedule', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Availability & Schedule</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure working hours, appointment slot durations, and clinic calendar availability
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSchedule} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        {/* Slot Duration Selector */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-900">Standard Consultation Slot Duration</h3>
            <p className="text-slate-500">Defines the booking window for patient appointments</p>
          </div>
          <select
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
            className="p-2 bg-white border border-slate-200 rounded-xl font-bold font-mono-numbers focus:outline-none focus:border-teal-600"
          >
            <option value={15}>15 Minutes (Express)</option>
            <option value={30}>30 Minutes (Standard)</option>
            <option value={45}>45 Minutes (Extended)</option>
            <option value={60}>60 Minutes (Comprehensive)</option>
          </select>
        </div>

        {/* Days Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Weekly Practice Days</h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
            {schedule.map((day, idx) => (
              <div
                key={day.day}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  day.enabled ? 'bg-white' : 'bg-slate-50/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 w-36">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => handleToggleDay(idx)}
                    className="w-4 h-4 rounded text-teal-600 accent-teal-600"
                  />
                  <span className="font-bold text-slate-900">{day.day}</span>
                </div>

                {day.enabled ? (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Hours:</span>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => handleChangeTime(idx, 'startTime', e.target.value)}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono-numbers text-xs"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => handleChangeTime(idx, 'endTime', e.target.value)}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono-numbers text-xs"
                    />
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Practice Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating System...' : 'Save Availability Schedule'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
