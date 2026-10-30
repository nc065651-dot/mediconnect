import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { DoctorProfile, Appointment } from '../../types.ts';
import {
  Calendar,
  Clock,
  Video,
  Building,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  Star,
  ShieldCheck,
  CreditCard,
  FileCheck2,
} from 'lucide-react';

interface PatientBookAppointmentProps {
  initialDoctorId?: string;
  onNavigate: (path: string) => void;
}

export const PatientBookAppointment: React.FC<PatientBookAppointmentProps> = ({
  initialDoctorId,
  onNavigate,
}) => {
  const { user, showToast } = useAuth();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Booking fields
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'in_person' | 'video'>('in_person');
  const [reason, setReason] = useState<string>('');
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  // Time slots template
  const availableSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ];

  // Generate next 10 selectable dates
  const nextDates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1));
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    async function init() {
      try {
        const res = await api.getDoctors();
        setDoctors(res.doctors);
        if (initialDoctorId) {
          const match = res.doctors.find((d) => d.id === initialDoctorId || d.userId === initialDoctorId);
          if (match) {
            setSelectedDoctor(match);
            setStep(2);
          }
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [initialDoctorId]);

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setErrorMsg('Please select a doctor, date, and available slot.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.bookAppointment({
        doctorId: selectedDoctor.userId,
        date: selectedDate,
        timeSlot: selectedSlot,
        type: consultationType,
        reason: reason || 'Routine clinical consultation',
      });

      setBookedAppointment(res.appointment);
      setStep(4); // Confirmation step
      showToast('Appointment booked successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to book slot. It may have already been reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Step Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'}`}>1</span>
            <span>Select Doctor</span>
          </div>
          <span className="text-slate-300">———</span>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'}`}>2</span>
            <span>Date & Slot</span>
          </div>
          <span className="text-slate-300">———</span>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'}`}>3</span>
            <span>Consultation Details</span>
          </div>
          <span className="text-slate-300">———</span>
          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-teal-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 4 ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'}`}>4</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Select Doctor */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Step 1: Choose Your Doctor</h2>
            <span className="text-xs text-slate-500">Pick from our credentialed medical specialists</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setStep(2);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                  selectedDoctor?.id === doc.id
                    ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md'
                    : 'border-slate-200 hover:border-teal-500/50 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
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
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Specialist</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm truncate">{doc.fullName}</h3>
                      <p className="text-xs text-slate-500 truncate">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono-numbers">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{doc.rating}</span>
                        </div>
                        <span>·</span>
                        <span>{doc.experienceYears} yrs</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">{doc.bio}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fee</span>
                    <span className="font-bold text-slate-900 font-mono-numbers text-sm">${doc.consultationFee}</span>
                  </div>
                  <button className="px-3 py-1.5 bg-teal-700 text-white rounded-lg text-xs font-semibold hover:bg-teal-800 transition-colors">
                    Select Doctor →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Date & Slot Selection */}
      {step === 2 && selectedDoctor && (
        <div className="space-y-6 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Doctor</span>
            </button>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900">{selectedDoctor.fullName}</span>
              <span className="text-xs text-slate-400 block font-mono-numbers">${selectedDoctor.consultationFee}</span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">1. Choose Date</h3>
            <p className="text-xs text-slate-500 mb-3">Select from the doctor's upcoming clinic availability:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {nextDates.map((dateStr) => {
                const isSelected = selectedDate === dateStr;
                const dateObj = new Date(dateStr + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });

                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setSelectedSlot('');
                    }}
                    className={`p-3 min-w-[76px] rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-teal-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block opacity-75">{dayName}</span>
                    <span className="text-lg font-bold font-mono-numbers block">{dayNum}</span>
                    <span className="text-[10px] block opacity-75">{monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Choose Time Slot</h3>
              <p className="text-xs text-slate-500 mb-4">
                Available slots for <strong className="text-slate-800 font-mono-numbers">{selectedDate}</strong>:
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold font-mono-numbers transition-all ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                          : 'border-slate-200 text-slate-700 hover:border-teal-500 hover:bg-teal-50/50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Continue to Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Consultation Details & Review */}
      {step === 3 && selectedDoctor && (
        <div className="space-y-6 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Slot Picker</span>
            </button>
            <span className="text-xs font-bold text-teal-800">Review & Confirm</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Select Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setConsultationType('in_person')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  consultationType === 'in_person'
                    ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Building className="w-4 h-4 text-teal-700" />
                  <span>In-Person Clinic Visit</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  At {selectedDoctor.clinicAddress}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('video')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  consultationType === 'video'
                    ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Video className="w-4 h-4 text-teal-700" />
                  <span>Encrypted Telehealth Video</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  High-definition virtual room from your browser
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Chief Complaint or Symptoms
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Follow-up on blood pressure, routine wellness review, or symptom description..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Appointment Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>Doctor: <strong className="text-slate-900">{selectedDoctor.fullName}</strong></div>
              <div>Specialty: <span className="text-teal-800 font-medium">{selectedDoctor.specialty}</span></div>
              <div>Date: <strong className="text-slate-900 font-mono-numbers">{selectedDate}</strong></div>
              <div>Time: <strong className="text-slate-900 font-mono-numbers">{selectedSlot}</strong></div>
              <div>Patient: <strong className="text-slate-900">{user?.name || 'Alex Morgan'}</strong></div>
              <div>Fee: <strong className="text-slate-900 font-mono-numbers">${selectedDoctor.consultationFee}</strong></div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Simulated Instant Payment (Zero Real Charge)</span>
            </div>
            <button
              disabled={submitting}
              onClick={handleConfirmBooking}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{submitting ? 'Confirming with Doctor...' : `Pay $${selectedDoctor.consultationFee} & Book`}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Confirmation */}
      {step === 4 && bookedAppointment && (
        <div className="bg-white rounded-3xl border border-teal-500/30 p-8 shadow-xl text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Booking Confirmed</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Your Appointment is Scheduled</h2>
            <p className="text-xs text-slate-500">
              Appointment ID: <strong className="font-mono-numbers text-slate-800">{bookedAppointment.id}</strong>
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Doctor</span>
              <span className="font-bold text-slate-900">{bookedAppointment.doctorName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Date & Slot</span>
              <span className="font-bold text-slate-900 font-mono-numbers">
                {bookedAppointment.date} at {bookedAppointment.timeSlot}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Consultation Type</span>
              <span className="font-bold text-teal-800 uppercase">
                {bookedAppointment.type === 'video' ? 'Virtual Video Visit' : 'In-Person Clinic Visit'}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Fee Status</span>
              <span className="font-bold text-emerald-700">Paid ($ {bookedAppointment.fee})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/patient/appointments')}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              View My Appointments
            </button>
            <button
              onClick={() => onNavigate('/patient/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
