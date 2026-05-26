# Learn with Taxo

Production-ready full-stack scaffold for the Learn with Taxo website and role-based portal.

## What Is Included

- React + Vite frontend with Tailwind CSS, Framer Motion, React Router, and lucide-react.
- Dark navy/gold premium SaaS UI with animated hero, glass panels, hover cards, page transitions, language toggle, and sound toggle.
- Role-based customer/student, teacher, and owner/admin portals.
- Protected route guards and role-specific navigation. Students do not see material management as a top-level menu.
- Student onboarding, placement, booking, EasyKash payment proof flow, student profile, homework, feedback, final test, reports, certificates, and group chat placeholders.
- Teacher dashboard, profile/media approval form, availability, schedule, assigned protected material viewer, attendance, homework, feedback summary, students, salary, chat, and vacation/off request pages.
- Owner/Admin command center, students, teachers, payment approvals, finance/prices/material/tests/homework/reports/certificates/salary/monthly awards/roles/blocked users/automation/audit/data sources/assets pages.
- Secure Node/Express API proxy layer for Apps Script, Google Sheets sync, assets, email, and AI stubs.
- Mock fallback data so the app works before live services are shared or configured.
- Data import parser utilities, including the schedule rule that teacher names are parsed from blue section headers and not the Admin column.

## Logo

The site is configured to load the official logo from:

`public/assets/logo.png`

If that file is missing, `public/assets/README_LOGO.txt` explains where to place it. I could not copy the supplied logo from Downloads because this workspace cannot read that folder. Do not replace it with a fake logo.

## Install And Run

```bash
npm install
npm run start
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:8787/api/health`

Build:

```bash
npm run build
```

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

1. Run `npm install`.
2. Create `.env` on the server with the values from `.env.example`.
3. Run `npm run build`.
4. Deploy `dist/` as the static frontend.
5. Deploy `server/` as a Node app with `npm run server`.
6. Set `SITE_URL=https://learnwithtaxo.com`.
7. Configure the frontend host to proxy `/api/*` to the Node backend.
8. Upload the official logo to `public/assets/logo.png` before building, or place it in the deployed asset folder.

## Integration Placeholders

- EasyKash payment links are read from environment variables.
- Email automation routes are stubbed and ready for SMTP configuration.
- AI scoring route is stubbed and waits for `OPENAI_API_KEY`.
- Asset upload stores files under `server/uploads` for local development; use S3, Cloudflare R2, Hostinger storage, or another private object store in production.
- Protected material viewer includes view-only UI, watermark text, disabled right-click, and logging-ready structure. Use signed expiring URLs in production.

## QA Checklist

- `npm run build` should pass with no missing imports.
- Student menu excludes material management.
- Teacher feedback page is separate from student feedback form.
- Payment page uses EasyKash wording and manual proof upload.
- Apps Script token is only referenced on the backend.
- New Applications permission fallback is visible in `/admin/data-sources`.
- Official logo path is fixed at `public/assets/logo.png`.
