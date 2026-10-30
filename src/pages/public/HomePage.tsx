import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Search,
  Calendar,
  ShieldCheck,
  Video,
  FolderHeart,
  ChevronRight,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Sparkles,
  Stethoscope,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Star,
  Activity,
  FileCheck2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user, demoLogin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [consultationMode, setConsultationMode] = useState<'all' | 'in_person' | 'video'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const specialties = [
    { name: 'Cardiology', icon: HeartPulse, count: '12 Specialists', desc: 'Heart health, hypertension, ECG & echo workups' },
    { name: 'Neurology', icon: Brain, count: '8 Specialists', desc: 'Migraine care, neuro-diagnostics & cognitive health' },
    { name: 'Pediatrics', icon: Baby, count: '15 Specialists', desc: 'Child wellness, growth tracking & vaccinations' },
    { name: 'Orthopedics', icon: Bone, count: '10 Specialists', desc: 'Joint reconstruction, sports injuries & spine therapy' },
    { name: 'Dermatology', icon: Sparkles, count: '9 Specialists', desc: 'Clinical dermatology, allergies & skin wellness' },
    { name: 'General Medicine', icon: Stethoscope, count: '24 Specialists', desc: 'Preventive screenings, viral illnesses & lifestyle' },
  ];

  const featuredDoctors = [
    {
      id: 'doc_prof_01',
      name: 'Dr. Sarah Chen, MD',
      title: 'Senior Interventional Cardiologist',
      specialty: 'Cardiology',
      experience: '14 years',
      rating: 4.9,
      reviews: 184,
      fee: 120,
      clinic: 'St. Luke Heart Center, Metro Plaza',
      image: '/src/assets/images/doctor_sarah_chen_1793264706983.jpg',
      modes: ['In-Person', 'Video'],
    },
    {
      id: 'doc_prof_02',
      name: 'Dr. Marcus Vance, MD',
      title: 'Neurologist & Neurophysiology Specialist',
      specialty: 'Neurology',
      experience: '16 years',
      rating: 4.9,
      reviews: 212,
      fee: 150,
      clinic: 'NeuroVance Clinic, Tower B',
      image: '/src/assets/images/doctor_marcus_vance_1793264707626.jpg',
      modes: ['In-Person', 'Video'],
    },
    {
      id: 'doc_prof_03',
      name: 'Dr. Elena Rodriguez, MD',
      title: 'Pediatric & Adolescent Health Specialist',
      specialty: 'Pediatrics',
      experience: '10 years',
      rating: 4.8,
      reviews: 148,
      fee: 95,
      clinic: 'BrightCare Children Center',
      image: '/src/assets/images/doctor_elena_rodriguez_1793264708703.jpg',
      modes: ['In-Person', 'Video'],
    },
  ];

  const faqs = [
    {
      q: 'How does MediConnect prevent double bookings?',
      a: 'The server executes atomic conflict validation before writing an appointment record to persistent storage. If two users attempt to select the same clinician and time slot simultaneously, the second transaction is safely rejected with a clear conflict notice.',
    },
    {
      q: 'What is the DRiefcase-style Health Locker?',
      a: 'Inspired by DRiefcase digital health protocols, MediConnect allows patients to upload, categorize, and securely inspect diagnostic lab reports, radiology imaging scans, vaccination history, and hospital discharge summaries in one encrypted, central repository.',
    },
    {
      q: 'Can patient users modify issued prescriptions?',
      a: 'No. Strictly following medical compliance rules, only authenticated and verified clinicians can sign e-prescriptions. Patients can view, print, or download issued prescriptions, but cannot tamper with dosages or instructions.',
    },
    {
      q: 'How does the professor or reviewer evaluate different roles?',
      a: 'The top navigation and demo cards below include 1-click role switchers. You can immediately enter as Patient (Alex Morgan), Doctor (Dr. Sarah Chen), or Hospital Administrator without manually typing passwords.',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('/doctors');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Quick Demo Access Bar for Professor */}
      <section className="bg-teal-900 text-teal-100 py-2.5 px-6 border-b border-teal-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="font-semibold text-white">Demonstration Ready:</span>
            <span>Click any role below to experience the authenticated portal instantly:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                demoLogin('patient');
                onNavigate('/patient/dashboard');
              }}
              className="px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-white font-medium rounded-md transition-colors text-[11px]"
            >
              Patient Portal (Alex Morgan)
            </button>
            <button
              onClick={() => {
                demoLogin('doctor');
                onNavigate('/doctor/dashboard');
              }}
              className="px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-white font-medium rounded-md transition-colors text-[11px]"
            >
              Doctor Portal (Dr. Sarah Chen)
            </button>
            <button
              onClick={() => {
                demoLogin('admin');
                onNavigate('/admin/dashboard');
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-200 font-medium rounded-md transition-colors text-[11px]"
            >
              Admin Audit Desk
            </button>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Practo · MFine · DRiefcase Unified Healthcare System</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Health, Connected in One Place.
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              MediConnect bridges verified specialist consultations, scheduled clinic appointments, real-time telehealth video, and centralized DRiefcase-style medical records into one clinical platform.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (user?.role === 'patient') onNavigate('/patient/book-appointment');
                  else if (!user) onNavigate('/login');
                  else onNavigate('/doctor/dashboard');
                }}
                className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all hover:shadow-md flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
              </button>
              <button
                onClick={() => onNavigate('/doctors')}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Explore Doctors</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <p className="text-2xl font-bold text-slate-900 font-mono-numbers">180+</p>
                <p className="text-xs text-slate-500 mt-0.5">Verified Physicians</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 font-mono-numbers">12,400+</p>
                <p className="text-xs text-slate-500 mt-0.5">Records Archived</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 font-mono-numbers">99.4%</p>
                <p className="text-xs text-slate-500 mt-0.5">Patient Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Hero Media Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 aspect-[4/3]">
              <img
                src="/src/assets/images/hero_medical_consultation_1793264706670.jpg"
                alt="Doctor patient clinical consultation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>St. Luke Medical Center Network</span>
                </div>
                <h3 className="text-lg font-bold">Empathetic Clinical Consultation</h3>
                <p className="text-xs text-slate-300 mt-1">In-person clinical care and instant high-definition telehealth.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-lg p-4 max-w-5xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search doctor name, hospital, or symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:bg-white text-slate-700"
              >
                <option value="">All Specialties</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={consultationMode}
                onChange={(e) => setConsultationMode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:bg-white text-slate-700"
              >
                <option value="all">Any Mode</option>
                <option value="in_person">In-Person</option>
                <option value="video">Video Call</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Find Care</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Clinical Care Divisions</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Specialized Medical Care</h2>
          </div>
          <button
            onClick={() => onNavigate('/doctors')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Specialties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                onClick={() => onNavigate('/doctors')}
                className="group p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-teal-800 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{item.count}</span>
                  <span className="text-teal-700 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Book <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Verified Doctors */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Credited Clinicians</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Featured Doctors</h2>
          </div>
          <button
            onClick={() => onNavigate('/doctors')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="p-6 pb-4 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-teal-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Specialist</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 truncate mt-0.5">{doc.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono-numbers">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{doc.experience} exp</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-2 text-xs text-slate-500 border-t border-slate-100">
                  <p className="truncate">{doc.clinic}</p>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Consultation</span>
                  <span className="text-base font-bold text-slate-900 font-mono-numbers">${doc.fee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`/doctors/${doc.id}`)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      if (!user) onNavigate('/login');
                      else onNavigate('/patient/book-appointment');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How MediConnect Works — Inspired by Practo, MFine & DRiefcase */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Unified Healthcare Architecture</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">How MediConnect Operates</h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Synthesizing doctor discovery, telehealth access, and secure lifetime health records management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Practo Inspiration: Smart Discovery</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter credentialed physicians across specialties, read peer patient reviews, inspect hospital affiliations, and view transparent consultation fees.
              </p>
              <div className="pt-2 text-xs text-teal-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero double bookings with slot lock</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-white">MFine Inspiration: Digital Care</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consult seamlessly through encrypted in-browser video calls or schedule clinic visits. Authorized clinicians sign electronic prescriptions with medication timing instructions.
              </p>
              <div className="pt-2 text-xs text-teal-400 flex items-center gap-1.5 font-medium">
                <Video className="w-3.5 h-3.5" />
                <span>Encrypted HD telehealth room</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-white">DRiefcase Inspiration: Health Locker</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Store lifetime laboratory panels, digital radiology scans, surgical summaries, and immunization records categorized with fast clinical search and patient ownership.
              </p>
              <div className="pt-2 text-xs text-teal-400 flex items-center gap-1.5 font-medium">
                <FolderHeart className="w-3.5 h-3.5" />
                <span>Categorized clinical repository</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Locker Feature Showcase */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Centralized Medical Records</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              DRiefcase-Inspired Digital Health Locker
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Never misplace another paper prescription, CT scan, or blood test. MediConnect empowers patients to organize their complete diagnostic records and grant time-limited clinical access to treating specialists.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Multi-Category Document Taxonomy</h4>
                  <p className="text-xs text-slate-500">Pathology reports, DICOM X-rays, discharge notes, and pediatric vaccination records.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Patient-Authoritative Ownership</h4>
                  <p className="text-xs text-slate-500">Only authorized doctors can view records for active appointments; unauthorized browsing is blocked.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant Digital Prescription Retrieval</h4>
                  <p className="text-xs text-slate-500">Doctors sign electronically and patients access official medication regimens in real time.</p>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  if (user) onNavigate('/patient/records');
                  else {
                    demoLogin('patient');
                    onNavigate('/patient/records');
                  }
                }}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-2"
              >
                <span>Explore Health Locker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50 aspect-[16/10]">
              <img
                src="/src/assets/images/digital_health_records_1793264708517.jpg"
                alt="Digital health records interface"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Common Questions</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:text-teal-800"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
