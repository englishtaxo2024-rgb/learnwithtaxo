# Hostinger Node.js Auto-Deploy

Learn with Taxo is a full-stack Vite and Express application. The authenticated
portal must deploy from `main` as a Hostinger Node.js Web App.

## Repository

- Repository: `englishtaxo2024-rgb/learnwithtaxo`
- Branch: `main`
- Node version: `20.x`
- Install/build command: `npm ci && npm run build`
- Start command: `npm start`
- Entry point: `server/index.js`
- Frontend output: `dist`

The Express server serves `dist`, provides SPA fallback routing, and owns every
private Google Sheets, Google Drive, OpenAI, login, payment, and portal API.

## Hostinger Setup

1. In hPanel, create or open a Node.js Web App for `learnwithtaxo.com`.
2. Connect the GitHub repository above and select `main`.
3. Set Node.js to version 20.
4. Set build to `npm ci && npm run build`.
5. Set start to `npm start`.
6. Set the entry file to `server/index.js`.
7. Add production environment variables from `.env.example`.
8. Enable automatic deployment for pushes to `main`.
9. Deploy or redeploy after the environment variables are saved.

Do not use `hostinger-static` for the authenticated platform. That branch can
only display the public Vite build and cannot securely execute backend APIs.

## Required External Access

- Share each required spreadsheet with `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
- Grant the same service account access to material, certificate, report, and
  placement-audio Drive folders.
- Keep all credentials in Hostinger environment variables, never in GitHub.
