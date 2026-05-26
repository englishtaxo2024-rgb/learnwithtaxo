# Learn with Taxo

Production-ready full-stack scaffold for the Learn with Taxo website and role-based portal.

## What Is Included

- React + Vite frontend with Tailwind CSS, Framer Motion, React Router, and lucide-react.
- Dark navy/gold premium SaaS UI with animated hero, glass panels, hover cards, page transitions, bilingual foundation, and sound-ready controls.
- Role-based customer/student, teacher, and owner/admin portals.
- Protected route guards and role-specific navigation. Students do not see material management as a top-level menu.
- Student onboarding, placement, booking, manual payment confirmation, student profile, homework, feedback, final test, reports, certificates, and group chat areas.
- Teacher dashboard, profile/media approval form, availability, schedule, assigned protected material viewer, attendance, homework, feedback summary, students, salary, chat, and vacation/off request pages.
- Owner/Admin command center, students, teachers, payment approvals, finance/prices/material/tests/homework/reports/certificates/salary/monthly awards/roles/blocked users/automation/audit/data sources/assets pages.
- Secure Node/Express API proxy layer for Apps Script, Google Sheets sync, assets, email, placement tests, manual payment proof, and AI stubs.
- Real CSV import and first-run seeding from `taxo_students.csv` and `taxo_teachers_groups.csv`.

## Logo

The site loads the official logo from `public/assets/logo.png`. The UI never replaces it with a fake letter mark; it shows a visible warning until the official PNG is available.

## Install And Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

Dev frontend: `http://localhost:5173`
Production/API: `http://localhost:8787/api/health`

## Production Portal Status

The React app is API-backed, not a static preview:

- `POST /api/auth/login`, `GET /api/auth/me`, and `POST /api/auth/logout` provide token sessions.
- `GET /api/records/bootstrap` returns data already scoped to the logged-in role.
- Public placement test route: `/placement-test`.
- Admin placement review: `/admin/placement-tests`.
- Admin placement settings: `/admin/placement-tests/settings`.
- Manual payment confirmation: `/student/payment`, `/teacher/payments`, `/admin/payments`.
- Admin can import `taxo_students.csv` and `taxo_teachers_groups.csv`.
- Admin can upload material slide pictures; teachers/students only see assigned material.
- Data persists to `server/data/db.json`; uploaded files persist under `server/uploads`.

Demo logins:

- Admin: `admin@learnwithtaxo.com` / `admin123`
- Student: `student@test.com` / `password123`
- Teacher example: `ms..aya.el.dawoudy@learnwithtaxo.com` / `teacher1`

## Environment

Copy `.env.example` to `.env` and fill private values on the server only.

Important security notes:

- Never expose `ENGLISH_TAXO_API_TOKEN`, `OPENAI_API_KEY`, or email credentials in frontend code.
- Apps Script and Google Sheets access must go through the backend proxy.
- Manual payment proof upload is used. No external payment gateway variables are required.
- If any key/token has been publicly exposed, revoke and replace it.

## Hostinger Deployment

See `README_DEPLOYMENT.md`.

Use Node.js Web App hosting:

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`
- Entry file: `server/index.js`
- Output directory: `dist`

Static-only Hostinger Git deployment will not run the authenticated portal or upload APIs.

## QA Checklist

- `npm run build` should pass on a machine with npm installed.
- Student menu excludes material management.
- Teacher only receives own groups/students/payments/placement tests from the API.
- Student only receives own profile/payments/placement status.
- Payment proof upload accepts images/PDF and is admin-reviewed.
- Speaking placement records audio in-browser and uploads it to storage.
- Apps Script token is only referenced on the backend.
- Official logo path is fixed at `public/assets/logo.png`.
