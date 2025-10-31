# Veridia Hiring Platform (Frontend)

Live demo: https://main.d4jzhm4gaw9jp.amplifyapp.com/

A clean Next.js hiring platform for Veridia. Applicants can register, apply, and track status. Admins can search, filter, and set Accepted (Hired), Waitlisted, or Rejected with notes and status history.

Admin test: admin@veridia.com • Password: Admin123

## Tech Stack
- Next.js 15 + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- Zustand (state, persisted to localStorage)
- React Hook Form + Zod (form + validation)
- Sonner (toasts)
- Fuse.js (search)

## Features
- Applicant
  - Register & Login (demo: stored locally)
  - Application form with validation (save draft, submit)
  - Dashboard: see application status + HR notes
- Admin
  - Login (admin@veridia.com / Admin123)
  - Applications list: search, filter, Accept/Waitlist/Reject with confirm dialog + note
  - Application detail: change status, add note, view status history
  - Admin dashboard: counts + three columns (Accepted, Waitlisted, Rejected)

## Statuses
Draft • Submitted • Under Review • Shortlisted • Rejected • Hired (displayed as “Accepted”) • Waitlisted

## How to run locally
- Prerequisite: Node 18+ (recommended Node 20)
- Install dependencies:
```bash
npm install
Start dev server:
Bash

npm run dev
Open http://localhost:3000

Build for production:
Bash

npm run build
Start production build:
Bash

npm run start
Project Structure
src/app — routes (applicant + admin)
src/components — shared UI and admin components
src/store — Zustand stores (auth, accounts, applications)
src/types — Zod schemas and types
public — static assets (logo, screenshots)
Notes
Frontend-only demo (Zustand + localStorage).
For production: add backend (Supabase/Firebase/Node API), secure auth, and password hashing.
Screenshots
Home / Applicant tab
Login
Apply Form
Applicant Dashboard
Admin Applications List