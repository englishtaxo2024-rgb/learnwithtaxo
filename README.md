# Learn with Taxo

Production-ready full-stack scaffold for the Learn with Taxo website and role-based portal.

## What Is Included

- React + Vite frontend with Tailwind CSS, Framer Motion, React Router, and lucide-react.
- Dark navy/gold premium SaaS UI with animated hero, glass panels, hover cards, page transitions, language toggle, and sound toggle.
- Role-based customer/student, teacher, and owner/admin portals.
- Protected route guards and role-specific navigation. Students do not see material management as a top-level menu.
- Student onboarding, placement, booking, manual payment confirmation, student profile, homework, feedback, final test, reports, certificates, and group chat areas.
- Teacher dashboard, profile/media approval form, availability, schedule, assigned protected material viewer, attendance, homework, feedback summary, students, salary, chat, and vacation/off request pages.
- Owner/Admin command center, students, teachers, payment approvals, finance/prices/material/tests/homework/reports/certificates/salary/monthly awards/roles/blocked users/automation/audit/data sources/assets pages.
- Secure Node/Express API proxy layer for Apps Script, Google Sheets sync, assets, email, and AI stubs.
- Backend-only Google Sheets adapters with explicit setup errors when production services are not configured.
- Data import parser utilities, including the schedule rule that teacher names are parsed from blue section headers and not the Admin column.

## Logo

The site is configured to load the official logo from:

`public/assets/logo.png`

If that file is missing, `public/assets/README_LOGO.txt` explains where to place it. The UI never replaces the logo with a fake letter mark; it shows a visible warning until the official PNG is available.

## Install And Run

```bash
npm install
npm run dev
```

Production start after build:

```bash
npm run build
npm start
```

Dev frontend: `http://localhost:5173`  
Production/backend API: `http://localhost:8787/api/health`

Build:

```bash
npm run build
```

## Production Portal Status

The React app is now API-backed, not a static preview:

- `POST /api/auth/login`, `GET /api/auth/me`, and `POST /api/auth/logout` provide token sessions.
- `GET /api/records/bootstrap` returns data already scoped to the logged-in role.
- Admin can import `taxo_students.csv` and `taxo_teachers_groups.csv`.
- Admin can upload material slide pictures; teachers/students only see assigned material.
- Student, teacher, and admin routes are guarded in the React app and in the API.
- Data persists to `server/data/db.json`; uploaded files persist under `server/uploads`.
- Google Sheets sync is available through `POST /api/records/sync/google-students` and uses backend-only Apps Script environment variables.

No demo users or public access codes are included. Admin, teacher, and student
logins require real directory records and server-validated access codes.

CSV templates are included:

- `taxo_students.csv`
- `taxo_teachers_groups.csv`

## Environment

Copy `.env.example` to `.env` and fill private values on the server only.

Important security notes:

- Never expose `ENGLISH_TAXO_API_TOKEN`, `OPENAI_API_KEY`, email credentials, or payment provider secrets in frontend code.
- Apps Script and Google Sheets access must go through the backend proxy.
- OpenAI is only for AI scoring, writing feedback, homework correction, reports, and recommendations. It does not provide Google Sheets access.
- If any key/token has been publicly exposed, revoke and replace it.

## Google Sheets And Apps Script

Configured backend endpoints:

- `GET /api/apps-script/health`
- `GET /api/apps-script/students`
- `GET /api/apps-script/student/:studentId`
- `POST /api/apps-script/attendance`
- `POST /api/apps-script/homework`
- `POST /api/apps-script/students`
- `GET /api/data-sources/status`
- `POST /api/sync/curriculum`
- `POST /api/sync/schedule`
- `POST /api/sync/new-applications`
- `POST /api/sync/all`

The New Applications sheet may return 403 until it is shared with the backend identity. The app handles that with a “Permission required” state and keeps the rest of the portal working.

## Hostinger Deployment

For the full production portal, Hostinger must run a Node backend or you must deploy the backend on VPS/Node hosting.

1. Run `npm install`.
2. Create `.env` on the server with the values from `.env.example`.
3. Start the backend with `npm run server`.
4. Build the frontend with `npm run build`.
5. Deploy `dist/` as the frontend.
6. Configure `/api/*` to proxy to the Node backend.
7. Set `SITE_URL=https://learnwithtaxo.com`.
8. Upload the official logo to `public/assets/logo.png` before building, or place it in the deployed asset folder.

Static-only Hostinger Git deployment cannot run the full authenticated API. It can show the fallback `index.html`, but authentication, persistent uploads, CSV import, and Google Sheets sync require the Node backend.

## Integration Placeholders

- Manual payment confirmation is built into the protected API.
- Email automation routes are stubbed and ready for SMTP configuration.
- AI scoring route is stubbed and waits for `OPENAI_API_KEY`.
- Asset upload stores files under `server/uploads` for local development; use S3, Cloudflare R2, Hostinger storage, or another private object store in production.
- Protected material viewer includes view-only UI, watermark text, disabled right-click, and logging-ready structure. Use signed expiring URLs in production.

## QA Checklist

- `npm run build` should pass with no missing imports.
- Student menu excludes material management.
- Teacher feedback page is separate from student feedback form.
- Payment page uses manual proof upload only.
- Apps Script token is only referenced on the backend.
- New Applications permission fallback is visible in `/admin/data-sources`.
- Official logo path is fixed at `public/assets/logo.png`.
