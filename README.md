# MediConnect — Smart Healthcare & Medical Records Portal

MediConnect is a comprehensive, production-grade healthcare web application integrating doctor discovery, appointment booking, digital prescriptions, telehealth consultations, and centralized health records repository inspired by **Practo**, **MFine**, and **DRiefcase**.

---

## 🏥 Product Vision & Core Inspirations

1. **Practo Inspiration (Doctor Discovery & Booking)**:
   - Search credentialed physicians across specialties (Cardiology, Neurology, Pediatrics, Orthopedics, etc.).
   - Multi-criteria filters: specialty, consultation mode (in-person vs. video), fee range, hospital affiliations.
   - 5-step appointment booking wizard with server-side double booking prevention and slot concurrency locking.

2. **MFine Inspiration (Digital Healthcare Access & Telehealth)**:
   - High-definition in-browser telehealth consultation suite with call duration timer, camera/mic controls, in-call chat, and clinical note review.
   - Licensed clinician e-prescription studio with ICD assessment, multi-medication rows (dosage, frequency, duration, meal timing, special instructions), and digital signing.

3. **DRiefcase Inspiration (Centralized Medical Records Locker)**:
   - Complete personal health record vault supporting pathology lab panels, diagnostic radiology/X-ray imaging, hospital discharge summaries, and pediatric vaccination records.
   - File upload simulation with encrypted storage, categorization, clinical tags, document previews, and patient-authoritative deletion.

---

## 🔑 Demo Accounts for Professor / Evaluation

MediConnect comes seeded with realistic, fully populated fictional clinical data and a **1-Click Demo Switcher** in the top navigation and authentication page:

| Role | Name | Email | Password | Features Highlighted |
| :--- | :--- | :--- | :--- | :--- |
| **Patient** | Alex Morgan | `patient@mediconnect.demo` | `patient123` | O+ blood group, appointments, DRiefcase records, e-Rx, lab tests, billing |
| **Doctor** | Dr. Sarah Chen, MD | `doctor@mediconnect.demo` | `doctor123` | Senior Cardiologist, schedule manager, issue electronic prescriptions, appointment queue |
| **Admin** | Chief Hospital Admin | `admin@mediconnect.demo` | `admin123` | Hospital statistics, doctor verification toggles, security audit logs, reset demo data |

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion
- **Backend API**: Express server running on Node.js / `tsx`
- **Data Persistence**: File-backed relational JSON database with atomic transactions, password hashing (SHA-256 + salt), audit logging, and double-booking concurrency guards
- **Bundler & Dev Server**: Vite with Express middleware mode

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run the development full-stack server (Port 3000)
npm run dev

# Run production build
npm run build

# Start production server
npm start
```
