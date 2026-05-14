# Healthcare Management System (MERN)

Full-stack Healthcare Management System with role-based modules for `admin`, `doctor`, `patient`, and `lab assistant`.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT
- Uploads: Multer

## Project Structure
- `frontend/` React client
- `backend/` Express API

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)

## Environment Variables
Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/healthcare
JWT_SECRET=your_jwt_secret_here
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

## Run Project

Start frontend + backend together (from project root):
```bash
npm install
npm run dev
```

Start backend:
```bash
cd backend
npm run dev
```

Start frontend:
```bash
cd frontend
npm run dev
```

## Seed Dummy Data

```bash
cd backend
node seed.js
```

Seed includes:
- 1 admin
- 10 doctors
- 30 patients
- 5 lab assistants + 5 labs
- 50 appointments
- 40 payments
- 20 reports
- notifications + system settings

## Default Seed Credentials
- Admin: `admin@healthcare.com` / `Admin@123`
- Doctor: `doctor1@healthcare.com` / `Doctor@123`
- Patient: `patient1@healthcare.com` / `Patient@123`
- Lab: `lab1@healthcare.com` / `Lab@123`

## Main API Groups
- Auth: `/api/auth/*`
- Doctor module: `/api/doctor/*`
- Doctor listing/book flow: `/api/doctors/*`
- Appointments: `/api/appointments/*`
- Lab module + booking: `/api/lab/*`, `/api/lab-bookings/*`, `/api/patient/lab-bookings`
- Payments: `/api/payments/*`
- Admin module: `/api/admin/*`

## Admin Module Endpoints (Implemented)
- Dashboard: `GET /api/admin/dashboard`
- Doctors: `GET/POST /api/admin/doctors`, `GET/PATCH/DELETE /api/admin/doctors/:id`
- Patients: `GET /api/admin/patients`, `GET/PATCH/DELETE /api/admin/patients/:id`
- Labs: `GET/POST /api/admin/labs`, `PATCH/DELETE /api/admin/labs/:id`
- Appointments: `GET /api/admin/appointments`, `PATCH/DELETE /api/admin/appointments/:id`
- Payments: `GET /api/admin/payments`, `PATCH /api/admin/payments/:id`
- Reports: `GET /api/admin/reports`, `DELETE /api/admin/reports/:id`
- Settings: `GET/PATCH /api/admin/settings`
- Notifications: `GET /api/admin/notifications`

## Recent Fixes
- Admin Lab creation now supports:
  - selecting existing lab assistant, or
  - creating/using assistant by `assistantName + assistantEmail + assistantPassword`.
- Register page now supports role-based direct signup:
  - `patient`, `doctor`, `lab`.
- Role-based post-register redirects:
  - patient -> `/patient/dashboard`
  - doctor -> `/doctor/dashboard`
  - lab -> `/lab/dashboard`

## Notes
- Uploaded files are served from `backend/uploads` via `/uploads/*`.
- Keep frontend and backend running together for full functionality.
