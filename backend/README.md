# NoteVault Backend

This folder contains the backend API for the NoteVault app.

## Deploy only backend on Railway

1. In Railway, create a new project and choose **Deploy from GitHub repo**.
2. Select this repository and set the root path to `backend`.
3. Set the build command to:

```bash
npm install
```

4. Set the start command to:

```bash
npm start
```

## Required environment variables

- `JWT_SECRET` — a long random secret string
- `PORT` — Railway will set this automatically, but the app also falls back to `5000`
- `FRONTEND_URL` — optional, set this if your frontend is hosted separately
- `NODE_ENV=production` — optional, but used when serving frontend assets if available

## Notes

- The backend uses a local JSON datastore (`app.json`) instead of SQLite.
- On Railway, local disk is not guaranteed to persist across redeploys. For production you should migrate to a hosted database such as PostgreSQL.
- If you deploy backend-only and do not include frontend assets, only the API routes will be available.
