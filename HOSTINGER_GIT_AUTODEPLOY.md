# Hostinger Git Auto-Deploy

Use this when Hostinger must deploy the live static website automatically from GitHub.

## Branches

- `main`: full source code.
- `hostinger-static`: built website only.

Hostinger must deploy `hostinger-static`, not `main`.

## Hostinger Setup

1. Go to Hostinger hPanel.
2. Open `Websites` -> `learnwithtaxo.com`.
3. Go to `Advanced` -> `Git`.
4. Disconnect the current Git deployment if it only shows `main` and cannot switch branch.
5. Reconnect GitHub repository:
   `englishtaxo2024-rgb/learnwithtaxo`
6. Choose branch:
   `hostinger-static`
7. Root directory:
   `public_html`
8. Enable auto-deployment.
9. Click `Deploy` or `Redeploy`.
10. Open:
    `https://www.learnwithtaxo.com?fresh=1`

## Deploy From Your Computer

Run:

```bash
npm install
npm run deploy:hostinger
```

The deployment script builds the site, replaces the `hostinger-static` branch with the contents of `dist/`, commits, and pushes the branch.

## Branch Contents

The `hostinger-static` branch root should contain:

- `index.html`
- `assets/`
- any other static files generated inside `dist/`

It must not contain:

- `src/`
- `server/`
- `public/`
- `package.json`
- `package-lock.json`
- `node_modules/`
- `.env`
- `.env.example`
- README files
- build config files
