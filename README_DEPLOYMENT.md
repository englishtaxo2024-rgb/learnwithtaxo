# Learn with Taxo Deployment

## Application Type

- Frontend: React and Vite, built into `dist`
- Backend: Node.js and Express at `server/index.js`
- Production data: Google Sheets through backend-only Google APIs
- Protected files: Google Drive through backend permission checks
- AI features: OpenAI through backend-only routes

This is a Node.js Web App, not a static-only deployment.

## Hostinger Settings

| Setting | Value |
| --- | --- |
| Repository | `englishtaxo2024-rgb/learnwithtaxo` |
| Branch | `main` |
| Node version | `20.x` |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Entry point | `server/index.js` |
| Frontend output | `dist` |

Hostinger supplies `PORT`; the app reads it automatically.

## Production Environment

Create environment variables in hPanel from `.env.example`. At minimum, set:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_PROJECT_ID`
- `GOOGLE_SYSTEM_SPREADSHEET_ID`
- `TEMPORARY_CURRICULUM_SHEET_ID`
- `OPENAI_API_KEY`
- `ADMIN_ACCESS_CODE`
- `SESSION_SECRET`
- `JWT_SECRET`
- Drive folder IDs used by certificates, reports, materials, and placement audio

The Google private key normally needs escaped newlines (`\n`) in hPanel.

## Verification

After deployment:

1. Open `/api/health` and confirm a 200 response.
2. Confirm `/`, `/placement-test`, and public course routes load.
3. Confirm `/api/google-sheets/status` returns 401 without admin login.
4. Log in with a real account and confirm role-specific dashboard access.
5. Confirm the temporary curriculum sheet is shared with the service account.
6. Confirm student, teacher, payment, and file APIs return only scoped records.

No demo account is included. Access codes are generated or reset by an
authenticated administrator and stored as hashes.
