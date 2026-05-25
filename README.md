# 🔐 NoteVault — Full-Stack Auth App

A production-ready full-stack web application with:
- **Real user authentication** (JWT + bcrypt)
- **Express.js REST API** backend
- **SQLite database** (zero config, file-based)
- **React + Vite** frontend
- **Protected routes** (dashboard only accessible when logged in)
- **Notes CRUD** per user

---

## 🚀 Quick Start (Local Dev)

### 1. Install dependencies
```bash
# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
```

### 2. Run backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### 3. Run frontend (new terminal)
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open http://localhost:5173 — sign up and you're in! ✅

---

## 🌐 Deploy to Railway (Free, ~5 minutes)

Railway is the easiest way to deploy a full-stack Node app with persistent storage.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create notevault --public --push
# or push to your existing GitHub repo
```

### Step 2: Deploy on Railway
1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Node.js

### Step 3: Set environment variables in Railway dashboard
```
JWT_SECRET=your_super_long_random_secret_here_min_32_chars
NODE_ENV=production
FRONTEND_URL=https://your-app.railway.app
```

### Step 4: Build frontend and serve from backend
```bash
cd frontend && npm run build
```
Copy the `frontend/dist` folder contents are served by the backend in production mode.

**Or use the build command in Railway:**
Set Build Command: `cd frontend && npm install && npm run build`
Set Start Command: `cd backend && npm install && node server.js`

Your live URL will be: `https://your-app-name.railway.app`

---

## 🌐 Deploy to Render (Alternative, also free)

1. Go to https://render.com
2. New → **Web Service** → connect GitHub repo
3. Set:
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Environment**: `NODE_ENV=production`, `JWT_SECRET=your_secret`
4. Click **Deploy** — live in ~3 minutes

---

## 🏗 Architecture

```
fullstack-app/
├── backend/
│   ├── server.js          # Express app, all routes
│   ├── app.db             # SQLite database (auto-created)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Router
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       └── Dashboard.jsx
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/notes` | Yes | Get user's notes |
| POST | `/api/notes` | Yes | Create note |
| DELETE | `/api/notes/:id` | Yes | Delete note |
| GET | `/api/health` | No | Health check |

## 🔒 Security Features
- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT tokens** expire in 7 days
- Each user can only access their own notes
- SQL injection protection via prepared statements
- CORS configured for your frontend URL

---

## ⬆️ Upgrading the Database
To switch from SQLite to PostgreSQL (for production scale):
1. `npm install pg` in backend
2. Replace `better-sqlite3` calls with `pg` pool queries
3. Railway and Render both offer free PostgreSQL add-ons
