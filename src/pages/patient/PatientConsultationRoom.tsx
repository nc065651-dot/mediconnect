import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { Appointment, MessageItem } from '../../types.ts';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  FileText,
  ShieldCheck,
  Send,
  User,
  Clock,
  Activity,
} from 'lucide-react';

interface PatientConsultationRoomProps {
  onNavigate: (path: string) => void;
  appointmentId?: string;
}

export const PatientConsultationRoom: React.FC<PatientConsultationRoomProps> = ({
  onNavigate,
  appointmentId,
}) => {
  const { user, showToast } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeApt, setActiveApt] = useState<Appointment | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [callSeconds, setCallSeconds] = useState(0);

  // In-call chat
  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string; time: string; isDoctor: boolean }[]
  >([
    {
      sender: 'Dr. Sarah Chen, MD',
      text: 'Good morning Alex, I am reviewing your blood pressure logs now. How have you been feeling?',
      time: '10:01 AM',
      isDoctor: true,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getAppointments();
        const videoApts = res.appointments.filter((a) => a.type === 'video');
        setAppointments(videoApts);
        if (appointmentId) {
          const match = videoApts.find((a) => a.id === appointmentId);
          if (match) setActiveApt(match);
        } else if (videoApts.length > 0) {
          setActiveApt(videoApts[0]);
        }
      } catch (err) {
        console.error('Failed to load appointments:', err);
      }
    }
    load();
  }, [appointmentId]);

  useEffect(() => {
    let interval: any;
    if (isJoined) {
      interval = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isJoined]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      sender: user?.name || 'Alex Morgan',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoctor: false,
    };
    setChatMessages([...chatMessages, newMsg]);
    setInputMsg('');

    // Simulate doctor responding after 2 seconds
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: activeApt?.doctorName || 'Dr. Sarah Chen, MD',
          text: 'Thank you for updating me. I will adjust the morning Lisinopril dosage accordingly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDoctor: true,
        },
      ]);
    }, 2000);
  };

  if (!isJoined) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Telehealth Video Suite</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted, HIPAA-compliant virtual consultation room with licensed specialists
          </p>
        </div>

        {activeApt ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={activeApt.doctorAvatar || '/src/assets/images/doctor_sarah_chen_1793264706983.jpg'}
                    alt={activeApt.doctorName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                    Ready to Connect
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">{activeApt.doctorName}</h2>
                  <p className="text-xs text-slate-500">{activeApt.doctorSpecialty} · Scheduled at {activeApt.timeSlot}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-200">
                  Clinician Online & Waiting
                </span>
              </div>
            </div>

            {/* Device Pre-flight Check */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pre-Call Device Check</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-teal-700" />
                    <span>HD Camera</span>
                  </div>
                  <button
                    onClick={() => setCameraOn(!cameraOn)}
                    className={`px-2.5 py-1 rounded-lg font-semibold ${cameraOn ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {cameraOn ? 'Active' : 'Muted'}
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-teal-700" />
                    <span>Microphone</span>
                  </div>
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`px-2.5 py-1 rounded-lg font-semibold ${micOn ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {micOn ? 'Active' : 'Muted'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>WebRTC 256-bit AES Point-to-Point Encryption</span>
              </div>

              <button
                onClick={() => {
                  setIsJoined(true);
                  showToast('Connected to Dr. Sarah Chen consultation room');
                }}
                className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Enter Video Consultation</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-sm font-semibold text-slate-800">No scheduled video appointments</p>
            <p className="text-xs text-slate-500">Book an online consultation to activate your video session.</p>
            <button
              onClick={() => onNavigate('/patient/book-appointment')}
              className="mt-2 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold"
            >
              Book Video Visit
            </button>
          </div>
        )}
      </div>
    );
  }

  // Active in-call video suite
  return (
    <div className="space-y-4">
      {/* Top Session Bar */}
      <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-sm">Consultation: {activeApt?.doctorName}</span>
          <span className="text-slate-400">·</span>
          <span className="text-teal-400 font-mono-numbers">{formatTimer(callSeconds)}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Encrypted Session</span>
        </div>
      </div>

      {/* Main Grid: Video Stream + In-Call Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Canvas Area */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-video shadow-2xl border border-slate-800 flex items-center justify-center">
            {/* Doctor Primary Video Feed */}
            <img
              src="/src/assets/images/doctor_sarah_chen_1793264706983.jpg"
              alt="Doctor Stream"
              className="w-full h-full object-cover"
            />

            {/* Doctor Name Overlay */}
            <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold">{activeApt?.doctorName || 'Dr. Sarah Chen, MD'}</span>
            </div>

            {/* Self-Camera Picture-in-Picture */}
            <div className="absolute bottom-4 right-4 w-36 h-28 rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/20 shadow-xl flex items-center justify-center">
              {cameraOn ? (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white text-xs font-semibold">
                  <span>Alex Morgan (You)</span>
                </div>
              ) : (
                <div className="text-center p-2 text-slate-400 text-[10px]">
                  <VideoOff className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                  <span>Camera Muted</span>
                </div>
              )}
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-center gap-4">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-xl transition-colors ${
                micOn ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-rose-100 text-rose-700'
              }`}
              title={micOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`p-3 rounded-xl transition-colors ${
                cameraOn ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-rose-100 text-rose-700'
              }`}
              title={cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setIsJoined(false);
                showToast('Consultation session ended safely', 'info');
                onNavigate('/patient/appointments');
              }}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Consultation</span>
            </button>
          </div>
        </div>

        {/* In-Call Live Chat Drawer */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-xs text-slate-900">In-Call Clinical Chat</h3>
            </div>
            <span className="text-[10px] text-slate-400">Archived to EHR</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.isDoctor ? 'items-start' : 'items-end'}`}
              >
                <span className="text-[10px] text-slate-400 mb-0.5">{msg.sender} · {msg.time}</span>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.isDoctor
                      ? 'bg-slate-100 text-slate-900 rounded-tl-sm'
                      : 'bg-teal-700 text-white rounded-tr-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Type message to doctor..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
            />
            <button
              type="submit"
              className="p-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
