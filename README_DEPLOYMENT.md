# Learn with Taxo Deployment

## Deployment Type

This project is a **full-stack app**:

- Frontend: Vite + React static build in `dist/`
- Backend: Node.js + Express API in `server/index.js`
- Storage fallback: local files in `server/uploads`
- Database fallback: JSON file in `server/data/db.json`

It is **not** a Next.js app.

## Hostinger Settings

Use **Node.js Web App hosting**, not static-only hosting, for the production portal.

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`
- Output directory: `dist`
- Entry file: `server/index.js`
- Node version: 20 LTS
- App port: use Hostinger's provided `PORT` environment variable

The Express server serves:

- `/api/*` from the backend
- `/uploads/*` from local upload storage
- all frontend routes from `dist/index.html`

## Important Hostinger Fix

Do not let Hostinger serve the old root `public_html/index.html`.

For this full app, Hostinger must run `server/index.js` after `npm run build`. If you use static hosting only, the backend API, authentication, upload storage, placement tests, and protected dashboards will not work.

If a file already exists in `public_html/index.html` from the old static deployment, remove/replace the old static deployment target and use Node.js Web App deployment instead. The Vite `index.html` in this repository is only a build entry file; it is not the production server.

## Environment Variables

Copy `.env.example` to `.env` on the server and fill the private values.

Required:

```env
SITE_URL=https://learnwithtaxo.com
OWNER_EMAIL=sagafinearts@gmail.com
VITE_API_BASE_URL=
PAYMENT_INSTRUCTIONS_EN=Upload your payment proof from your student dashboard. Admin will review and confirm your booking.
PAYMENT_INSTRUCTIONS_AR=ارفع صورة إثبات الدفع من لوحة الطالب. ستقوم الإدارة بالمراجعة وتأكيد الحجز.
MAX_UPLOAD_MB=10
LOCAL_UPLOAD_DIR=server/uploads
```

Optional backend integrations:

```env
OPENAI_API_KEY=
ENGLISH_TAXO_API_URL=
ENGLISH_TAXO_API_TOKEN=
GOOGLE_CURRICULUM_SHEET_URL=
GOOGLE_SCHEDULE_SHEET_URL=
GOOGLE_NEW_APPLICATIONS_SHEET_URL=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
```

No payment gateway variables are required. Manual payment proof upload is used.

## Test Accounts

- Admin: `admin@learnwithtaxo.com` / `admin123`
- Student: `student@test.com` / `password123`
- Teacher example: `ms..aya.el.dawoudy@learnwithtaxo.com` / `teacher1`

## Live Routes

- Public placement test: `/placement-test`
- Admin dashboard: `/admin`
- Admin placement tests: `/admin/placement-tests`
- Admin placement settings: `/admin/placement-tests/settings`
- Admin payments: `/admin/payments`
- Teacher placement tests: `/teacher/placement-tests`
- Teacher payment statuses: `/teacher/payments`
- Student placement status: `/student/placement-test/status`
- Student payment confirmation: `/student/payment`

## Build Checklist

Run on a machine with Node/npm:

```bash
npm install
npm run build
npm start
```

Then open:

```text
http://localhost:8787/
http://localhost:8787/api/health
```

## CSV Import

The project includes:

- `taxo_students.csv`
- `taxo_teachers_groups.csv`

When these files are present at the project root, the backend seeds the database with current students/groups/teachers on first run. Admin can also import CSVs from the dashboard.

## Security Notes

- API tokens stay in backend environment variables only.
- Students only receive their own data from `/api/records/bootstrap`.
- Teachers only receive their assigned groups/students/payments/placement tests.
- Admin receives all records.
- Uploads are restricted by file type and size.
- Payment proof accepts images/PDF.
- Speaking placement accepts browser audio recordings.
