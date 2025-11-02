# motia-frontend

Minimal Next.js frontend to call the deployed Motia backend.

This app is a tiny playground that lets you enter a path and call your backend URL.

Prereqs
- Node.js (16+ recommended)

# Quick start (PowerShell)

```powershell
cd C:\Users\piyus\OneDrive\Desktop\motia_project\frontend
npm install
# Copy the example env file and set your backend URL before running
Copy-Item .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_BACKEND_URL to your deployed backend base URL
npm run dev
```

Open http://localhost:3000 in your browser.

Environment
- Create `.env.local` in `frontend/` (you can copy `.env.local.example`) and add `NEXT_PUBLIC_BACKEND_URL` with the deployed backend URL. Example:

```
NEXT_PUBLIC_BACKEND_URL=https://your-app.motia.cloud
```
